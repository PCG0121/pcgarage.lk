import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

interface AdminAuthState {
  isAuthenticated: boolean;
  user: User | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

async function isAdminUser(userId: string) {
  if (!supabase) return false;

  const { data, error } = await supabase
    .from('admin_users')
    .select('id,email')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export const useAdminAuthStore = create<AdminAuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  email: null,
  isLoading: hasSupabaseConfig,
  error: null,

  initialize: async () => {
    if (!supabase) {
      set({ isAuthenticated: false, user: null, email: null, isLoading: false, error: 'Supabase env values are missing.' });
      return;
    }

    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      set({ isAuthenticated: false, user: null, email: null, isLoading: false, error: null });
      return;
    }

    try {
      const isAdmin = await isAdminUser(data.user.id);
      set({
        isAuthenticated: isAdmin,
        user: isAdmin ? data.user : null,
        email: isAdmin ? data.user.email || null : null,
        isLoading: false,
        error: isAdmin ? null : 'This user is not listed as an admin.',
      });
      if (!isAdmin) await supabase.auth.signOut();
    } catch (adminError) {
      set({
        isAuthenticated: false,
        user: null,
        email: null,
        isLoading: false,
        error: adminError instanceof Error ? adminError.message : 'Could not verify admin access.',
      });
    }
  },

  login: async (email, password) => {
    if (!supabase) throw new Error('Supabase env values are missing.');

    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      set({ isAuthenticated: false, user: null, email: null, isLoading: false, error: error?.message || 'Login failed.' });
      throw error || new Error('Login failed.');
    }

    const isAdmin = await isAdminUser(data.user.id);
    if (!isAdmin) {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null, email: null, isLoading: false, error: 'This user is not listed as an admin.' });
      throw new Error('This user is not listed as an admin.');
    }

    set({
      isAuthenticated: true,
      user: data.user,
      email: data.user.email || email,
      isLoading: false,
      error: null,
    });
  },

  logout: async () => {
    if (supabase) await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, email: null, isLoading: false, error: null });
  },
}));

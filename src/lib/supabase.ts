import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

function isPlaceholder(value: string) {
  const normalized = value.trim().toUpperCase();
  return normalized === 'YOUR_SUPABASE_URL' || normalized === 'YOUR_SUPABASE_ANON_KEY';
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function getSupabaseConfigError() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Supabase is not configured yet. Create .env.local in the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  }

  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
    return 'Supabase env values still contain placeholders. Replace them in .env.local with your real project URL and anon key.';
  }

  if (!isValidUrl(supabaseUrl)) {
    return 'VITE_SUPABASE_URL must be a valid Supabase project URL, for example https://your-project.supabase.co.';
  }

  return null;
}

export const supabaseConfigError = getSupabaseConfigError();
export const hasSupabaseConfig = !supabaseConfigError;
export const supabaseSetupMessage = supabaseConfigError;

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

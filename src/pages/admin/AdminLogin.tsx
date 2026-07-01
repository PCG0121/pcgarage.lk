import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { hasSupabaseConfig, supabaseSetupMessage } from '../../lib/supabase';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAdminAuthStore((state) => state.login);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const isLoading = useAdminAuthStore((state) => state.isLoading);
  const authError = useAdminAuthStore((state) => state.error);
  const setupMessage = hasSupabaseConfig ? null : supabaseSetupMessage;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid email or password.');
    }
  };

  const inputStyle = (field: string) => ({
    width: '100%',
    background: '#ffffff',
    border: `1px solid ${error ? 'rgba(225,29,72,0.4)' : focusedField === field ? 'rgba(225,29,72,0.45)' : 'var(--border-subtle)'}`,
    borderRadius: '0.75rem',
    color: 'var(--text-primary)',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-10rem', left: '-10rem', width: '40rem', height: '40rem', background: 'radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10rem', right: '-10rem', width: '35rem', height: '35rem', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '26rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 30px rgba(239,68,68,0.3)',
          }}>
            <Cpu size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: '0 0 0.375rem' }}>
            PC GARAGE<span style={{ color: '#ef4444' }}>.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Admin Dashboard - Sign In</p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 0 60px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="admin-email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@pcgarage.lk"
                  style={inputStyle('email')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="********"
                  style={{ ...inputStyle('password'), paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {setupMessage && (
              <div style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: '0.625rem',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: '#b45309',
                fontWeight: 600,
                lineHeight: 1.5,
              }}>
                {setupMessage}
              </div>
            )}

            {(error || (!setupMessage && authError)) && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '0.625rem',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: '#f87171',
                fontWeight: 500,
              }}>
                {error || authError}
              </div>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              className="btn-glow"
              disabled={isLoading || Boolean(setupMessage)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem', opacity: isLoading || setupMessage ? 0.7 : 1 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight size={15} />
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: '0.75rem',
            padding: '0.875rem 1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              Supabase Auth
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>
              Use an Auth user listed in admin_users.
            </div>
          </div>
        </div>
      </div>

      <style>{`input::placeholder { color: var(--text-muted) !important; }`}</style>
    </div>
  );
}

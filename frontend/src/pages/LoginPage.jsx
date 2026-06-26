import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* LEFT PANEL */}
      <div style={{
        width: '50%',
        background: 'linear-gradient(160deg, #1a56db 0%, #0a2d7a 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '64px 56px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
          top: -150, right: -150
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350,
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
          bottom: -100, left: -100
        }} />
        <div style={{
          position: 'absolute', width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
          top: '40%', right: '10%'
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 12, marginBottom: 64, zIndex: 1
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24
          }}>🏥</div>
          <span style={{
            color: 'white', fontSize: 22,
            fontWeight: 700, letterSpacing: '-0.3px'
          }}>MediBook</span>
        </div>

        {/* Main text */}
        <div style={{ zIndex: 1 }}>
          <h1 style={{
            color: 'white', fontSize: 44, fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-1.5px',
            marginBottom: 20
          }}>
            Your Health,<br />Our Priority
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 16, lineHeight: 1.7,
            maxWidth: 360, marginBottom: 48
          }}>
            Book appointments with top specialists easily. Fast, secure, and hassle-free.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '⚡', text: 'Instant appointment confirmation' },
              { icon: '🔒', text: 'Secure and private platform' },
              { icon: '✕', text: 'Free cancellation anytime' },
            ].map(f => (
              <div key={f.text} style={{
                display: 'flex', alignItems: 'center', gap: 14
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16, flexShrink: 0
                }}>{f.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', background: '#f8faff'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 32, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.8px', marginBottom: 8
            }}>
              Welcome back
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 15 }}>
              Sign in to continue to MediBook
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', borderRadius: 12,
              padding: '13px 16px', marginBottom: 24,
              fontSize: 14, display: 'flex', gap: 8, alignItems: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, color: '#334155', marginBottom: 8
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '1.5px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, outline: 'none', background: 'white',
                  color: '#0f172a', boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, color: '#334155', marginBottom: 8
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '1.5px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, outline: 'none', background: 'white',
                  color: '#0f172a', boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: loading
                  ? '#93c5fd'
                  : 'linear-gradient(135deg, #1a56db, #0f3fa6)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(26,86,219,0.3)',
                letterSpacing: '0.2px'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 12, margin: '28px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#cbd5e1', fontSize: 13 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#1a56db', fontWeight: 700, textDecoration: 'none'
            }}>
              Create account →
            </Link>
          </p>

          <div style={{
            marginTop: 40, padding: '16px 20px',
            background: 'white', borderRadius: 14,
            border: '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'center', gap: 32
          }}>
            {['🔒 Secure', '✅ Verified', '⚡ Instant'].map(b => (
              <span key={b} style={{
                fontSize: 12, color: '#64748b', fontWeight: 500
              }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
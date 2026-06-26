import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const SPECIALIZATIONS = [
  'Cardiologist',
  'Neurologist',
  'Dermatologist',
  'Orthopedic Surgeon',
  'Pediatrician',
  'Gynecologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Psychiatrist',
  'Urologist',
  'Oncologist',
  'Endocrinologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Rheumatologist',
  'Nephrologist',
  'General Physician',
  'Dentist',
  'Physiotherapist',
  'Radiologist',
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'patient', specialization: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.role === 'doctor' && !form.specialization) {
      setError('Please select your specialization');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    border: '1.5px solid #e2e8f0', borderRadius: 12,
    fontSize: 14, outline: 'none', background: 'white',
    color: '#0f172a', boxSizing: 'border-box',
    transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif'
  };

  const labelStyle = {
    display: 'block', fontSize: 13,
    fontWeight: 600, color: '#334155', marginBottom: 8
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

        <div style={{ zIndex: 1 }}>
          <h1 style={{
            color: 'white', fontSize: 44, fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 20
          }}>
            Join MediBook<br />Today
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 16,
            lineHeight: 1.7, maxWidth: 360, marginBottom: 48
          }}>
            Create your account and start in minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '👤', title: 'As a Patient', desc: 'Book and manage your appointments' },
              { icon: '👨‍⚕️', title: 'As a Doctor', desc: 'Set your schedule and specialization' },
            ].map(r => (
              <div key={r.title} style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 20
                }}>{r.icon}</div>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', background: '#f8faff',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 30, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.8px', marginBottom: 8
            }}>
              Create your account
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 15 }}>
              Fill in your details to get started
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

            {/* Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder="Dr. John Smith"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { value: 'patient', icon: '👤', label: 'Patient' },
                  { value: 'doctor', icon: '👨‍⚕️', label: 'Doctor' },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value, specialization: '' })}
                    style={{
                      padding: '14px',
                      border: form.role === r.value
                        ? '2px solid #1a56db'
                        : '1.5px solid #e2e8f0',
                      borderRadius: 12,
                      background: form.role === r.value ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{r.icon}</span>
                    <span style={{
                      fontSize: 14, fontWeight: 600,
                      color: form.role === r.value ? '#1a56db' : '#64748b'
                    }}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Specialization — only show for doctors */}
            {form.role === 'doctor' && (
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Specialization</label>
                <select
                  value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  required
                  style={{
                    ...inputStyle,
                    cursor: 'pointer'
                  }}
                  onFocus={e => e.target.style.borderColor = '#1a56db'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="">-- Select your specialization --</option>
                  {SPECIALIZATIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* Specialization preview badge */}
                {form.specialization && (
                  <div style={{
                    marginTop: 10, display: 'inline-flex',
                    alignItems: 'center', gap: 6,
                    background: '#eff6ff', border: '1px solid #bfdbfe',
                    borderRadius: 99, padding: '5px 12px'
                  }}>
                    <span style={{ fontSize: 14 }}>👨‍⚕️</span>
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: '#1d4ed8'
                    }}>
                      {form.specialization}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: 32 }} />

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
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 24,
            fontSize: 14, color: '#64748b'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: '#1a56db', fontWeight: 700,
              textDecoration: 'none'
            }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
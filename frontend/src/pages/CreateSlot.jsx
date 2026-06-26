import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function CreateSlot() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ slot_date: '', start_time: '', end_time: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/slots', form);
      setMessage('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to create slot');
    } finally {
      setLoading(false);
    }
  };

  if (message === 'success') {
    return (
      <div style={{
        minHeight: '100vh', background: '#f8faff',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            Slot Created!
          </h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, sans-serif' }}>

      {/* NAVBAR */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e8edf5',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #1a56db, #0f3fa6)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20
          }}>🏥</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>MediBook</span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{
          padding: '9px 18px', background: 'none',
          color: '#64748b', border: '1px solid #e2e8f0',
          borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer'
        }}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.5px', marginBottom: 6
          }}>
            Create Availability Slot
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>
            Add a time slot so patients can book appointments with you
          </p>
        </div>

        {message && message !== 'success' && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', borderRadius: 12,
            padding: '12px 16px', marginBottom: 24, fontSize: 14
          }}>
            ⚠️ {message}
          </div>
        )}

        <div style={{
          background: 'white', borderRadius: 20,
          border: '1px solid #e8edf5', padding: '32px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 600, color: '#374151', marginBottom: 8
              }}>
                📅 Date
              </label>
              <input
                type="date"
                value={form.slot_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, slot_date: e.target.value })}
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  border: '1.5px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, outline: 'none', color: '#0f172a',
                  boxSizing: 'border-box', background: 'white'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              <div>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 600, color: '#374151', marginBottom: 8
                }}>
                  🕐 Start Time
                </label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={e => setForm({ ...form, start_time: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, outline: 'none', color: '#0f172a',
                    boxSizing: 'border-box', background: 'white'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 600, color: '#374151', marginBottom: 8
                }}>
                  🕐 End Time
                </label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={e => setForm({ ...form, end_time: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, outline: 'none', color: '#0f172a',
                    boxSizing: 'border-box', background: 'white'
                  }}
                />
              </div>
            </div>

            {/* Preview */}
            {form.slot_date && form.start_time && form.end_time && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 12, padding: '16px', marginBottom: 24
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#15803d', marginBottom: 4 }}>
                  ✓ Slot Preview
                </div>
                <div style={{ fontSize: 15, color: '#0f172a', fontWeight: 500 }}>
                  📅 {new Date(form.slot_date).toLocaleDateString('en-IN', {
                    weekday: 'long', day: 'numeric',
                    month: 'long', year: 'numeric'
                  })}
                </div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                  🕐 {form.start_time} – {form.end_time}
                </div>
              </div>
            )}

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
                boxShadow: '0 4px 15px rgba(26,86,219,0.35)'
              }}
            >
              {loading ? 'Creating...' : '+ Create Slot'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/appointments/me');
        setAppointments(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const reload = async () => {
    const { data } = await api.get('/appointments/me');
    setAppointments(data);
  };

  const handleCancel = async (id) => {
    await api.delete(`/appointments/${id}`);
    reload();
  };

  const handleStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  const statusStyle = (status) => {
    if (status === 'confirmed') return { bg: '#dcfce7', color: '#15803d', label: '✓ Confirmed' };
    if (status === 'cancelled') return { bg: '#fee2e2', color: '#dc2626', label: '✕ Cancelled' };
    return { bg: '#fef9c3', color: '#b45309', label: '⏳ Pending' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter, sans-serif' }}>

      {/* NAVBAR */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e8edf5',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #1a56db, #0f3fa6)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20
          }}>🏥</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', letterSpacing: '-0.3px' }}>
            MediBook
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#f1f5f9', borderRadius: 99,
            padding: '6px 14px'
          }}>
            <span style={{ fontSize: 16 }}>{user?.role === 'doctor' ? '👨‍⚕️' : '👤'}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569', textTransform: 'capitalize' }}>
              {user?.role}
            </span>
          </div>

          {user?.role === 'patient' && (
            <button onClick={() => navigate('/book')} style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #1a56db, #0f3fa6)',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(26,86,219,0.3)'
            }}>
              + Book Appointment
            </button>
          )}

          {user?.role === 'doctor' && (
            <button onClick={() => navigate('/create-slot')} style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #0891b2, #0e7490)',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(8,145,178,0.3)'
            }}>
              + Create Slot
            </button>
          )}

          <button onClick={handleLogout} style={{
            padding: '9px 18px', background: 'none',
            color: '#64748b', border: '1px solid #e2e8f0',
            borderRadius: 10, fontSize: 13,
            fontWeight: 500, cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.5px', marginBottom: 4
          }}>
            {user?.role === 'doctor' ? '👨‍⚕️ Doctor Dashboard' : '👤 My Appointments'}
          </h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            {user?.role === 'doctor'
              ? 'Manage your patient appointments'
              : 'Track and manage your bookings'}
          </p>
        </div>

        {/* STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Confirmed', value: confirmed, icon: '✅', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
            { label: 'Pending', value: pending, icon: '⏳', bg: '#fefce8', color: '#b45309', border: '#fde68a' },
            { label: 'Cancelled', value: cancelled, icon: '❌', bg: '#fff1f2', color: '#dc2626', border: '#fecdd3' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16
            }}>
              <div style={{ fontSize: 32 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: s.color, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* APPOINTMENTS LIST */}
        <div style={{
          background: 'white', borderRadius: 20,
          border: '1px solid #e8edf5',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              All Appointments
            </h2>
            <span style={{
              background: '#f1f5f9', color: '#64748b',
              fontSize: 12, fontWeight: 600,
              padding: '4px 12px', borderRadius: 99
            }}>
              {appointments.length} total
            </span>
          </div>

          {appointments.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
              <h3 style={{ color: '#0f172a', fontWeight: 600, marginBottom: 8 }}>No appointments yet</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                {user?.role === 'patient' ? 'Book your first appointment with a specialist' : 'No patients have booked yet'}
              </p>
              {user?.role === 'patient' && (
                <button onClick={() => navigate('/book')} style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #1a56db, #0f3fa6)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>
                  Book Appointment
                </button>
              )}
            </div>
          ) : (
            appointments.map((a, i) => {
              const s = statusStyle(a.status);
              const date = new Date(a.slot_date);
              const dateStr = date.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              });
              return (
                <div key={a.id} style={{
                  padding: '20px 24px',
                  borderBottom: i < appointments.length - 1 ? '1px solid #f1f5f9' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 50, height: 50, borderRadius: 14,
                      background: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 22,
                      flexShrink: 0
                    }}>
                      {user?.role === 'patient' ? '👨‍⚕️' : '🧑'}
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 3 }}>
                        {user?.role === 'patient' ? a.doctor_name : a.patient_name}
                      </div>
                      {a.specialization && (
                        <div style={{
                          display: 'inline-block',
                          background: '#eff6ff', color: '#1d4ed8',
                          fontSize: 11, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 99,
                          marginBottom: 6
                        }}>
                          {a.specialization}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                        <span>📅 {dateStr}</span>
                        <span>🕐 {a.start_time} – {a.end_time}</span>
                      </div>
                      {a.notes && (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                          📝 {a.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <span style={{
                      background: s.bg, color: s.color,
                      fontSize: 12, fontWeight: 600,
                      padding: '5px 12px', borderRadius: 99
                    }}>
                      {s.label}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {user?.role === 'patient' && a.status !== 'cancelled' && (
                        <button onClick={() => handleCancel(a.id)} style={{
                          padding: '7px 14px', background: 'none',
                          color: '#dc2626', border: '1px solid #fecaca',
                          borderRadius: 8, fontSize: 12,
                          fontWeight: 600, cursor: 'pointer'
                        }}>
                          Cancel
                        </button>
                      )}
                      {user?.role === 'doctor' && a.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatus(a.id, 'confirmed')} style={{
                            padding: '7px 14px',
                            background: 'linear-gradient(135deg, #16a34a, #15803d)',
                            color: 'white', border: 'none',
                            borderRadius: 8, fontSize: 12,
                            fontWeight: 600, cursor: 'pointer'
                          }}>
                            ✓ Confirm
                          </button>
                          <button onClick={() => handleStatus(a.id, 'cancelled')} style={{
                            padding: '7px 14px', background: 'none',
                            color: '#dc2626', border: '1px solid #fecaca',
                            borderRadius: 8, fontSize: 12,
                            fontWeight: 600, cursor: 'pointer'
                          }}>
                            ✕ Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function BookingPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/doctors');
      setDoctors(data);
    };
    load();
  }, []);

  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    setSelectedSlot('');
    setSlots([]);
    if (!doctorId) { setDoctorInfo(null); return; }
    const found = doctors.find(d => String(d.id) === String(doctorId));
    setDoctorInfo(found);
    const { data } = await api.get(`/slots/${doctorId}`);
    setSlots(data);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments', { slot_id: selectedSlot, notes });
      setMessage('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
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
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            Appointment Booked!
          </h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>
            Redirecting to your dashboard...
          </p>
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
          borderRadius: 10, fontSize: 13,
          fontWeight: 500, cursor: 'pointer'
        }}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.5px', marginBottom: 6
          }}>
            Book an Appointment
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>
            Choose a specialist and pick a convenient time slot
          </p>
        </div>

        {message && message !== 'success' && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#dc2626', borderRadius: 12,
            padding: '12px 16px', marginBottom: 24,
            fontSize: 14
          }}>
            ⚠️ {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* LEFT - Form */}
          <div style={{
            background: 'white', borderRadius: 20,
            border: '1px solid #e8edf5', padding: '28px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <form onSubmit={handleBook}>

              {/* Doctor Select */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 600, color: '#374151', marginBottom: 8
                }}>
                  👨‍⚕️ Select Doctor
                </label>
                <select
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  required
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, outline: 'none',
                    background: 'white', color: '#0f172a',
                    cursor: 'pointer', boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Select */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 600, color: '#374151', marginBottom: 8
                }}>
                  🕐 Select Time Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={e => setSelectedSlot(e.target.value)}
                  required
                  disabled={!selectedDoctor}
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, outline: 'none',
                    background: selectedDoctor ? 'white' : '#f8fafc',
                    color: '#0f172a', cursor: selectedDoctor ? 'pointer' : 'not-allowed',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">-- Choose a slot --</option>
                  {slots.map(s => (
                    <option key={s.id} value={s.id}>
                      📅 {new Date(s.slot_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })} · {s.start_time} - {s.end_time}
                    </option>
                  ))}
                </select>
                {selectedDoctor && slots.length === 0 && (
                  <p style={{ fontSize: 12, color: '#f59e0b', marginTop: 6 }}>
                    ⚠️ No slots available for this doctor
                  </p>
                )}
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 28 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 600, color: '#374151', marginBottom: 8
                }}>
                  📝 Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows={4}
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, outline: 'none',
                    resize: 'vertical', color: '#0f172a',
                    boxSizing: 'border-box', fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedSlot}
                style={{
                  width: '100%', padding: '15px',
                  background: loading || !selectedSlot
                    ? '#93c5fd'
                    : 'linear-gradient(135deg, #1a56db, #0f3fa6)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 700,
                  cursor: loading || !selectedSlot ? 'not-allowed' : 'pointer',
                  boxShadow: !selectedSlot ? 'none' : '0 4px 15px rgba(26,86,219,0.35)'
                }}
              >
                {loading ? 'Booking...' : '✓ Confirm Booking'}
              </button>
            </form>
          </div>

          {/* RIGHT - Doctor Card */}
          <div>
            {doctorInfo ? (
              <div style={{
                background: 'white', borderRadius: 20,
                border: '1px solid #e8edf5', padding: '28px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                marginBottom: 16
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 20,
                  background: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 36,
                  marginBottom: 16
                }}>👨‍⚕️</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  {doctorInfo.name}
                </h3>
                <span style={{
                  display: 'inline-block',
                  background: '#eff6ff', color: '#1d4ed8',
                  fontSize: 12, fontWeight: 600,
                  padding: '4px 12px', borderRadius: 99, marginBottom: 16
                }}>
                  {doctorInfo.specialization}
                </span>
                <div style={{
                  background: '#f8fafc', borderRadius: 12,
                  padding: '14px', marginTop: 8
                }}>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                    📍 Available Slots
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                    {slots.length}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'white', borderRadius: 20,
                border: '1.5px dashed #e2e8f0', padding: '40px 28px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍⚕️</div>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>
                  Select a doctor to see their details
                </p>
              </div>
            )}

            {/* Info box */}
            <div style={{
              background: '#eff6ff', borderRadius: 16,
              border: '1px solid #bfdbfe', padding: '20px'
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1d4ed8', marginBottom: 12 }}>
                ℹ️ How it works
              </h4>
              {[
                'Select your preferred doctor',
                'Pick an available time slot',
                'Add notes about your visit',
                'Confirm your booking'
              ].map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, marginBottom: 8
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 99,
                    background: '#1d4ed8', color: 'white',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: '#1e40af' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
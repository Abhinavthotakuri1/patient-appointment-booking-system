const pool = require('../config/db');

// Get available slots for a doctor (optionally filter by date)
const getSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  let query = `
    SELECT id, slot_date, start_time, end_time
    FROM availability_slots
    WHERE doctor_id = ? AND is_booked = FALSE AND slot_date >= CURDATE()
  `;
  const params = [doctorId];

  if (date) {
    query += ' AND slot_date = ?';
    params.push(date);
  }

  query += ' ORDER BY slot_date, start_time';

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Doctor creates availability slots
const createSlot = async (req, res) => {
  const { slot_date, start_time, end_time } = req.body;
  try {
    // Find the doctor profile for this logged-in user
    const [doc] = await pool.query(
      'SELECT id FROM doctors WHERE user_id = ?', [req.user.id]
    );
    if (!doc.length) return res.status(404).json({ error: 'Doctor profile not found' });

    await pool.query(
      'INSERT INTO availability_slots (doctor_id, slot_date, start_time, end_time) VALUES (?,?,?,?)',
      [doc[0].id, slot_date, start_time, end_time]
    );
    res.status(201).json({ message: 'Slot created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getSlots, createSlot };
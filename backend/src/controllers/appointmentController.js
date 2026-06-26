const pool = require('../config/db');

const bookAppointment = async (req, res) => {
  const { slot_id, notes } = req.body;
  const patient_id = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock the row — prevents race conditions (two patients booking same slot)
    const [slots] = await conn.query(
      'SELECT * FROM availability_slots WHERE id = ? AND is_booked = FALSE FOR UPDATE',
      [slot_id]
    );
    if (!slots.length) {
      await conn.rollback();
      return res.status(409).json({ error: 'Slot is no longer available' });
    }

    const [result] = await conn.query(
      'INSERT INTO appointments (patient_id, slot_id, notes) VALUES (?, ?, ?)',
      [patient_id, slot_id, notes || null]
    );
    await conn.query(
      'UPDATE availability_slots SET is_booked = TRUE WHERE id = ?',
      [slot_id]
    );

    await conn.commit();
    res.status(201).json({ message: 'Appointment booked', appointmentId: result.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Server error' });
  } finally {
    conn.release();
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const isDoctor = req.user.role === 'doctor';

    let query, params;
    if (isDoctor) {
      query = `
        SELECT a.id, a.status, a.notes, a.created_at,
               u.name AS patient_name,
               s.slot_date, s.start_time, s.end_time
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        JOIN availability_slots s ON a.slot_id = s.id
        JOIN doctors d ON s.doctor_id = d.id
        WHERE d.user_id = ?
        ORDER BY s.slot_date ASC
      `;
      params = [req.user.id];
    } else {
      query = `
        SELECT a.id, a.status, a.notes, a.created_at,
               du.name AS doctor_name,
               d.specialization,
               s.slot_date, s.start_time, s.end_time
        FROM appointments a
        JOIN availability_slots s ON a.slot_id = s.id
        JOIN doctors d ON s.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        WHERE a.patient_id = ?
        ORDER BY s.slot_date ASC
      `;
      params = [req.user.id];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['confirmed', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ error: 'Invalid status' });

  try {
    const [result] = await pool.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (!result.affectedRows)
      return res.status(404).json({ error: 'Appointment not found' });

    // Free up the slot again if cancelled
    if (status === 'cancelled') {
      await pool.query(
        `UPDATE availability_slots SET is_booked = FALSE
         WHERE id = (SELECT slot_id FROM appointments WHERE id = ?)`,
        [req.params.id]
      );
    }
    res.json({ message: `Appointment ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const cancelAppointment = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [appt] = await conn.query(
      'SELECT * FROM appointments WHERE id = ? AND patient_id = ?',
      [req.params.id, req.user.id]
    );
    if (!appt.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await conn.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['cancelled', req.params.id]
    );
    await conn.query(
      'UPDATE availability_slots SET is_booked = FALSE WHERE id = ?',
      [appt[0].slot_id]
    );
    await conn.commit();
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Server error' });
  } finally {
    conn.release();
  }
};

module.exports = { bookAppointment, getMyAppointments, updateStatus, cancelAppointment };
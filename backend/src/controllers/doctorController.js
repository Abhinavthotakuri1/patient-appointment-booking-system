const pool = require('../config/db');

const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, u.name, d.specialization, d.bio
      FROM doctors d
      JOIN users u ON d.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, u.name, d.specialization, d.bio
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Doctor not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllDoctors, getDoctorById };

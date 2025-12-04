import { pool } from '../config/db.js';

export const listPayments = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, b.status as booking_status FROM payments p
     JOIN bookings b ON b.id = p.booking_id
     ORDER BY p.created_at DESC`,
  );
  res.json(rows);
};

export const createPayment = async (req, res) => {
  const { booking_id, amount, method, status } = req.body;
  const [result] = await pool.query(
    'INSERT INTO payments (booking_id, amount, method, status) VALUES (?, ?, ?, ?)',
    [booking_id, amount, method || 'card', status || 'pending'],
  );
  res.status(201).json({ id: result.insertId });
};

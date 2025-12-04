import { pool } from '../config/db.js';

export const listBookings = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, u.name AS customer_name, c.name AS car_name FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN cars c ON c.id = b.car_id
     ORDER BY b.created_at DESC`,
  );
  res.json(rows);
};

export const createBooking = async (req, res) => {
  const { car_id, start_date, end_date, total_price, status, delivery_address } = req.body;
  const [result] = await pool.query(
    `INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, status, delivery_address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, car_id, start_date, end_date, total_price, status || 'pending', delivery_address],
  );
  res.status(201).json({ id: result.insertId });
};

export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
    status,
    req.params.id,
  ]);
  res.json({ message: 'Booking status updated' });
};

export const cancelBooking = async (req, res) => {
  await pool.query('UPDATE bookings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
    req.params.id,
  ]);
  res.json({ message: 'Booking cancelled' });
};

import { pool } from '../config/db.js';

export const listDeliveries = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT d.*, b.status as booking_status, u.name as driver_name FROM deliveries d
     JOIN bookings b ON b.id = d.booking_id
     LEFT JOIN users u ON u.id = d.driver_id
     ORDER BY d.created_at DESC`,
  );
  res.json(rows);
};

export const updateDeliveryStatus = async (req, res) => {
  const { status, map_link } = req.body;
  await pool.query(
    'UPDATE deliveries SET status = ?, map_link = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, map_link, req.params.id],
  );
  res.json({ message: 'Delivery updated' });
};

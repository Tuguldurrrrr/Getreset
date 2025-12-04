import { pool } from '../config/db.js';

export const listMaintenance = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.*, c.name as car_name FROM maintenance m
     JOIN cars c ON c.id = m.car_id
     ORDER BY m.created_at DESC`,
  );
  res.json(rows);
};

export const createMaintenance = async (req, res) => {
  const { car_id, description, cost, status, next_due_date } = req.body;
  const [result] = await pool.query(
    'INSERT INTO maintenance (car_id, description, cost, status, next_due_date) VALUES (?, ?, ?, ?, ?)',
    [car_id, description, cost, status || 'pending', next_due_date],
  );
  res.status(201).json({ id: result.insertId });
};

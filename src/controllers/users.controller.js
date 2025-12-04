import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

export const listUsers = async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
};

export const createUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password || 'ChangeMe123!', 10);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, passwordHash, role || 'customer'],
  );
  res.status(201).json({ id: result.insertId });
};

export const updateRole = async (req, res) => {
  const { role } = req.body;
  await pool.query('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
    role,
    req.params.id,
  ]);
  res.json({ message: 'Role updated' });
};

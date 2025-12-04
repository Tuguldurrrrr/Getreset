import { pool } from '../config/db.js';

export const listCars = async (req, res) => {
  const { category, minPrice, maxPrice, fuel } = req.query;
  const filters = [];
  const params = [];
  if (category) {
    filters.push('c.category_id = ?');
    params.push(category);
  }
  if (fuel) {
    filters.push('c.fuel_type = ?');
    params.push(fuel);
  }
  if (minPrice) {
    filters.push('c.daily_rate >= ?');
    params.push(minPrice);
  }
  if (maxPrice) {
    filters.push('c.daily_rate <= ?');
    params.push(maxPrice);
  }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT c.*, cat.name as category_name FROM cars c JOIN car_categories cat ON cat.id = c.category_id ${where} ORDER BY c.created_at DESC`,
    params,
  );
  res.json(rows);
};

export const getCar = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT c.*, cat.name as category_name FROM cars c JOIN car_categories cat ON cat.id = c.category_id WHERE c.id = ?',
    [req.params.id],
  );
  if (!rows.length) return res.status(404).json({ message: 'Car not found' });
  res.json(rows[0]);
};

export const createCar = async (req, res) => {
  const { name, category_id, fuel_type, seats, daily_rate, transmission, image_url } = req.body;
  const [result] = await pool.query(
    'INSERT INTO cars (name, category_id, fuel_type, seats, daily_rate, transmission, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, category_id, fuel_type, seats, daily_rate, transmission, image_url],
  );
  res.status(201).json({ id: result.insertId });
};

export const updateCar = async (req, res) => {
  const { name, category_id, fuel_type, seats, daily_rate, transmission, image_url } = req.body;
  await pool.query(
    'UPDATE cars SET name=?, category_id=?, fuel_type=?, seats=?, daily_rate=?, transmission=?, image_url=?, updated_at = CURRENT_TIMESTAMP WHERE id=?',
    [name, category_id, fuel_type, seats, daily_rate, transmission, image_url, req.params.id],
  );
  res.json({ message: 'Car updated' });
};

export const deleteCar = async (req, res) => {
  await pool.query('DELETE FROM cars WHERE id = ?', [req.params.id]);
  res.json({ message: 'Car removed' });
};

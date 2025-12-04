CREATE DATABASE IF NOT EXISTS car_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE car_rental;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(32),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','customer','driver') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE car_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_category_name (name)
);

CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  fuel_type ENUM('gas','diesel','hybrid','electric') DEFAULT 'gas',
  seats INT DEFAULT 4,
  transmission ENUM('automatic','manual') DEFAULT 'automatic',
  daily_rate DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  specs JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cars_category FOREIGN KEY (category_id) REFERENCES car_categories(id)
);
CREATE INDEX idx_cars_category ON cars(category_id);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','delivering','finished','cancelled') DEFAULT 'pending',
  delivery_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_bookings_car FOREIGN KEY (car_id) REFERENCES cars(id)
);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('card','cash','wallet') DEFAULT 'card',
  status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  transaction_ref VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
CREATE INDEX idx_payments_booking ON payments(booking_id);

CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  driver_id INT,
  status ENUM('pending','dispatched','on_route','delivered') DEFAULT 'pending',
  map_link VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_deliveries_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT fk_deliveries_driver FOREIGN KEY (driver_id) REFERENCES users(id)
);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);

CREATE TABLE maintenance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  description TEXT,
  cost DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending','in_progress','done') DEFAULT 'pending',
  next_due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_maintenance_car FOREIGN KEY (car_id) REFERENCES cars(id)
);
CREATE INDEX idx_maintenance_car ON maintenance(car_id);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_favorites_car FOREIGN KEY (car_id) REFERENCES cars(id),
  UNIQUE KEY uk_favorite (user_id, car_id)
);

-- Demo data
INSERT INTO car_categories (name, description) VALUES
 ('SUV', 'Бүх төрлийн жийп'),
 ('Sedan', 'Хотын унаа'),
 ('Electric', 'Цахилгаан унаа');

INSERT INTO users (name, email, phone, password_hash, role) VALUES
 ('Админ', 'admin@example.com', '+97680111111', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8l2M90oCbGyF/F7kh/3Gzdh0dX8Gua', 'admin'),
 ('Менежер', 'manager@example.com', '+97680222222', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8l2M90oCbGyF/F7kh/3Gzdh0dX8Gua', 'manager'),
 ('Жолооч', 'driver@example.com', '+97680333333', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8l2M90oCbGyF/F7kh/3Gzdh0dX8Gua', 'driver'),
 ('Хэрэглэгч', 'customer@example.com', '+97680444444', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8l2M90oCbGyF/F7kh/3Gzdh0dX8Gua', 'customer');

INSERT INTO cars (category_id, name, fuel_type, seats, transmission, daily_rate, image_url, specs) VALUES
 (1, 'Toyota Land Cruiser 300', 'gas', 7, 'automatic', 220.00, 'https://placehold.co/600x400?text=Land+Cruiser', '{"hp": 409, "awd": true}'),
 (2, 'Honda Accord', 'gas', 5, 'automatic', 120.00, 'https://placehold.co/600x400?text=Accord', '{"hp": 192}'),
 (3, 'Tesla Model 3', 'electric', 5, 'automatic', 180.00, 'https://placehold.co/600x400?text=Model+3', '{"range_km": 450}');

INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, status, delivery_address) VALUES
 (4, 2, '2024-06-01', '2024-06-05', 480.00, 'confirmed', 'Улаанбаатар, СБД'),
 (4, 3, '2024-07-10', '2024-07-12', 360.00, 'pending', 'Улаанбаатар, БЗД');

INSERT INTO payments (booking_id, amount, method, status, transaction_ref) VALUES
 (1, 480.00, 'card', 'paid', 'PAY-001'),
 (2, 360.00, 'card', 'pending', 'PAY-002');

INSERT INTO deliveries (booking_id, driver_id, status, map_link, notes) VALUES
 (1, 3, 'delivered', 'https://maps.example.com/track/1', 'Цагт нь хүргэгдсэн'),
 (2, 3, 'dispatched', 'https://maps.example.com/track/2', 'Хүргэлтэнд гарсан');

INSERT INTO maintenance (car_id, description, cost, status, next_due_date) VALUES
 (1, 'Тос солих', 120.00, 'done', '2024-09-01'),
 (2, 'Тоормос шалгах', 80.00, 'pending', '2024-08-15');

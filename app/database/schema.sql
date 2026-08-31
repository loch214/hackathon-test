CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicle_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  daily_rate NUMERIC(10,2) NOT NULL,
  description TEXT
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  year INT NOT NULL,
  category_id INT REFERENCES vehicle_categories(id),
  status VARCHAR(30) NOT NULL DEFAULT 'available',
  mileage INT NOT NULL DEFAULT 0,
  fuel_level INT NOT NULL DEFAULT 100,
  last_service_date DATE,
  insurance_expiry DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  phone VARCHAR(30),
  id_number VARCHAR(40),
  address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  vehicle_id INT REFERENCES vehicles(id),
  pickup_datetime TIMESTAMP NOT NULL,
  return_datetime TIMESTAMP NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_method VARCHAR(40) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE maintenance_records (
  id SERIAL PRIMARY KEY,
  vehicle_id INT REFERENCES vehicles(id),
  maintenance_type VARCHAR(80) NOT NULL,
  description TEXT,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  scheduled_date DATE,
  completed_date DATE,
  cost NUMERIC(10,2) DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE inspections (
  id SERIAL PRIMARY KEY,
  vehicle_id INT REFERENCES vehicles(id),
  inspection_type VARCHAR(40) NOT NULL,
  checked_by VARCHAR(120),
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  remarks TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id),
  invoice_number VARCHAR(40) UNIQUE NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  issued_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);

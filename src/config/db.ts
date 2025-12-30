import pg from 'pg';
import config from './index';

const { Pool } = pg;
// DB Connection
export const pool = new Pool({
  connectionString: config.db_connection_str,
});

const initDB = async () => {
  try {
    // ১. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL,
        CONSTRAINT email_lowercase_check CHECK (email = LOWER(email)),
        CONSTRAINT password_min_length CHECK (LENGTH(password) >= 6)
      );
    `);

    // ২. Vehicles Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL,
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        daily_rent_price INT NOT NULL,
        availability_status VARCHAR(20) DEFAULT 'available',
        CONSTRAINT rent_price_positive CHECK (daily_rent_price > 0)
      );
    `);

    // ৩. Bookings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price INT NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        CONSTRAINT date_range_check CHECK (rent_end_date > rent_start_date),
        CONSTRAINT total_price_positive CHECK (total_price > 0)
      );
    `);

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

export const testDBConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release(); 
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); 
    }
};

export default initDB;
const { Pool } = require('pg');
require('dotenv').config();

// Define the pool with configuration from environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Define the query function using the pool
const query = (text, params) => {
  console.log("QUERY:", text, params || "");
  return pool.query(text, params);
};

// Define the createTableQuery and related functionality
const createTableQuery = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        profile_picture BYTEA,
        bio TEXT,
        username VARCHAR(100) UNIQUE,
        hashed_password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP,
        deleted_at DATE
    );
`;

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

createTable();

// Export the query function and pool for use in other modules
module.exports = {
  query,
  pool
};

// server/config/db.js
import mysql from "mysql2/promise"; // <-- Import the promise wrapper
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Use empty string if no password
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true, // Wait for available connection if pool is full
  connectionLimit: 10,      // Adjust pool size as needed
  queueLimit: 0,             // Unlimited queue for waiting requests
  connectTimeout: 10000     // Connection timeout in milliseconds
});

// Test the pool connection on startup (optional but recommended)
pool.getConnection()
  .then(connection => {
    console.log(" MySQL Connection Pool Acquired Successfully");
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error(" MySQL Pool Connection Failed:", err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
    // Consider exiting if the pool can't connect initially
    // process.exit(1);
  });

// Export the pool
export default pool;
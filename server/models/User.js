import db from "../config/db.js";


// Create Users Table if it doesn't exist
// export const createUsersTable = () => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS users (
//       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//       name VARCHAR(100) NOT NULL,
//       email VARCHAR(100) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       role ENUM('user', 'admin') DEFAULT 'user',
//       balance DECIMAL(10,2) DEFAULT 1000.00,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     ) ENGINE=InnoDB;
//   `;
//   db.query(sql, (err) => {
//     if (err) console.error(" Error creating users table:", err.message);
//     else console.log(" Users table ready");
//   });
// };

export default {};
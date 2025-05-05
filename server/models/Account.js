import db from "../config/db.js";

// Create Accounts Table if it doesn't exist
// export const createAccountsTable = () => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS accounts (
//       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//       user_id INT UNSIGNED NOT NULL,
//       account_number VARCHAR(20) UNIQUE NOT NULL,
//       account_type ENUM('Savings', 'Checking') DEFAULT 'Checking',
//       balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL, -- Ensure balance is never NULL
//       status ENUM('active', 'inactive', 'frozen') DEFAULT 'active',
//       branch_id INT UNSIGNED NULL,     -- Account might be associated with a branch
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//       INDEX idx_user_id (user_id),
//       INDEX idx_account_number (account_number),
//       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete accounts if user is deleted
//       FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL -- Set branch to NULL if deleted
//     ) ENGINE=InnoDB;
//   `;
//   db.query(sql, (err) => {
//     if (err) console.error(" Error creating accounts table:", err.message);
//     else console.log(" Accounts table ready");
//   });
// };


export default{};
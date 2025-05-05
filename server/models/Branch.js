import db from "../config/db.js";

// Create Branches Table if it doesn't exist
// export const createBranchesTable = () => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS branches (
//       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//       name VARCHAR(100) NOT NULL,
//       location TEXT NULL,
//       manager_id INT UNSIGNED NULL,     -- Reference to an Admin user
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//       -- Foreign key constraint added separately to avoid order issues
//       INDEX idx_manager (manager_id)
//     ) ENGINE=InnoDB;
//   `;
//   db.query(sql, (err) => {
//     if (err) console.error(" Error creating branches table:", err.message);
//     else console.log("Branches table ready");
//   });
// };

// Alter Branches Table to add Foreign Key for manager_id after Users table exists
// export const alterBranchesTableAddManagerFK = () => {
//   const sql = `
//     ALTER TABLE branches
//     ADD CONSTRAINT fk_branch_manager
//     FOREIGN KEY (manager_id) REFERENCES users(id)
//     ON DELETE SET NULL; -- Set manager to NULL if the admin user is deleted
//   `;
//   db.query(sql, (err) => {
//      if (err && err.code !== 'ER_FK_DUP_NAME' && err.code !== 'ER_DUP_KEYNAME') { // Ignore errors if FK already exists
//         console.error(" Error adding foreign key to branches table (manager_id):", err.message);
//     } else if (!err) {
//         console.log(" Foreign key branches(manager_id) -> users(id) added/verified.");
//     } else {
//         console.log("ℹ Foreign key branches(manager_id) -> users(id) likely already exists.");
//     }
//   });
// };

export default{};
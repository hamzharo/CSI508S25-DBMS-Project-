import db from "../config/db.js";

// // Create Fraud Reports Table if it doesn't exist
// export const createFraudReportsTable = () => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS fraud_reports (
//       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//       reporting_customer_id INT UNSIGNED NOT NULL, -- User who reported the fraud
//       description TEXT NOT NULL,
//       status ENUM('reported', 'investigating', 'action_taken', 'resolved', 'dismissed') DEFAULT 'reported',
//       assigned_admin_id INT UNSIGNED NULL,       -- Admin investigating the report
//       reported_account_id INT UNSIGNED NULL,     -- The account potentially affected/involved
//       related_transaction_id INT UNSIGNED NULL,  -- The specific transaction flagged (if any)
//       evidence_details TEXT NULL,              -- Admin notes or details of findings
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//       resolved_at DATETIME NULL,
//       INDEX idx_reporting_customer_id (reporting_customer_id),
//       INDEX idx_status (status),
//       INDEX idx_assigned_admin_id (assigned_admin_id),
//       FOREIGN KEY (reporting_customer_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete report if reporter deleted
//       FOREIGN KEY (assigned_admin_id) REFERENCES users(id) ON DELETE SET NULL,
//       FOREIGN KEY (reported_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
//       FOREIGN KEY (related_transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
//     ) ENGINE=InnoDB;
//   `;
//   db.query(sql, (err) => {
//     if (err) console.error(" Error creating fraud_reports table:", err.message);
//     else console.log(" Fraud Reports table ready");
//   });
// };

export default{};
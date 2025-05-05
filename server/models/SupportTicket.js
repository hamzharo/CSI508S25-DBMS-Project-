import db from "../config/db.js";

// // Create Support Tickets Table if it doesn't exist
// export const createSupportTicketsTable = () => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS support_tickets (
//       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//       customer_id INT UNSIGNED NOT NULL,          -- User (Customer) who raised the ticket
//       subject VARCHAR(255) NOT NULL,
//       description TEXT NOT NULL,
//       status ENUM('open', 'in_progress', 'resolved', 'closed', 'reopened') DEFAULT 'open',
//       priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
//       assigned_admin_id INT UNSIGNED NULL,     -- Admin user handling the ticket
//       related_account_id INT UNSIGNED NULL,    -- Optional: link to a specific account
//       related_transaction_id INT UNSIGNED NULL, -- Optional: link to a specific transaction
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//       resolved_at DATETIME NULL,               -- Timestamp when resolved
//       closed_at DATETIME NULL,                 -- Timestamp when closed
//       INDEX idx_customer_id (customer_id),
//       INDEX idx_status (status),
//       INDEX idx_assigned_admin_id (assigned_admin_id),
//       FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete tickets if customer is deleted
//       FOREIGN KEY (assigned_admin_id) REFERENCES users(id) ON DELETE SET NULL, -- Keep ticket if admin is deleted
//       FOREIGN KEY (related_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
//       FOREIGN KEY (related_transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
//     ) ENGINE=InnoDB;
//   `;
//   db.query(sql, (err) => {
//     if (err) console.error(" Error creating support_tickets table:", err.message);
//     else console.log(" Support Tickets table ready");
//   });
// };

export default{};
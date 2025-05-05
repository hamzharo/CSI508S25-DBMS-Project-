import db from "../config/db.js";

// Create Transactions Table if it doesn't exist
// export const createTransactionsTable = () => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS transactions (
//       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//       sender_id INT UNSIGNED NOT NULL,
//       receiver_id INT UNSIGNED NOT NULL,
//       amount DECIMAL(10,2) NOT NULL,
//       date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
//       FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
//     ) ENGINE=InnoDB;
//   `;
//   db.query(sql, (err) => {
//     if (err) console.error(" Error creating transactions table:", err.message);
//     else console.log(" Transactions table ready");
//   });
// };

export default{};

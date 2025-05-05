// server/controllers/accountController.js
import pool from "../config/db.js"; // Import the connection pool

/**
 * @desc    Get accounts for the logged-in user
 * @route   GET /api/accounts
 * @access  Private (Requires authMiddleware)
 */
export const getUserAccounts = async (req, res) => {
    const userId = req.user.id; // Extracted from JWT payload by authMiddleware

    if (!userId) {
        // This shouldn't happen if authMiddleware is working correctly
        return res.status(401).json({ message: "Not authorized, user ID missing." });
    }

    try {
        const sql = `
            SELECT
                a.id,
                a.account_number,
                a.account_type,
                a.balance,
                a.status AS account_status,
                a.created_at AS account_created_at,
                b.id AS branch_id,
                b.name AS branch_name
            FROM accounts a
            LEFT JOIN branches b ON a.branch_id = b.id
            WHERE a.user_id = ?
            ORDER BY a.created_at ASC;
        `;

        const [accounts] = await pool.query(sql, [userId]);

        // It's okay to return an empty array if the user has no accounts yet
        res.json(accounts);

    } catch (err) {
        console.error(" Database error getting user accounts:", err);
        res.status(500).json({ message: "Error fetching account details." });
    }
};

// --- Add other account-related controller functions here later ---
// e.g., getAccountById, createAccount (maybe admin only?), closeAccount, etc.
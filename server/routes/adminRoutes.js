// server/routes/adminRoutes.js
import express from 'express';
import pool from '../config/db.js'; // Keep pool if summary is calculated here, otherwise remove if summary moves to controller
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

// --- Import necessary controller functions ---
import {
    getAllUsers,
    getPendingUsers,
    approveUser,
    // Import getAdminDashboardSummary if you move summary logic to controller
} from '../controllers/adminController.js'; // Adjust path if needed

const router = express.Router();

// --- Endpoint for Dashboard Summary ---
// Note: It's often cleaner to move this logic into its own controller function
// in adminController.js (like getAdminDashboardSummary) and import/use it here.
// But leaving it inline as you provided for now.
router.get('/summary', authMiddleware, adminMiddleware, async (req, res) => {
    console.log('GET /api/admin/summary hit');
    try {
        const [pendingUsersRows] = await pool.query("SELECT COUNT(*) as count FROM users WHERE status = 'pending_approval'"); // Corrected status check
        const pendingApprovals = pendingUsersRows[0]?.count ?? 0;

        // Using controller's logic, count total non-admin users
        const [totalUsersRows] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role != 'admin'");
        const totalUsers = totalUsersRows[0]?.count ?? 0;

        let openSupportTickets = 0;
        try {
            const [openTicketsRows] = await pool.query("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open' OR status = 'reopened'"); // Check multiple open statuses
            openSupportTickets = openTicketsRows[0]?.count ?? 0;
        } catch (ticketError) {
            console.warn("Could not query support_tickets table for summary:", ticketError.message);
        }

        console.log('Summary Counts:', { pendingApprovals, totalUsers, openSupportTickets });
        res.json({ pendingApprovals, totalUsers, openSupportTickets });

    } catch (error) {
        console.error('Error fetching admin summary:', error);
        res.status(500).json({ message: 'Server error fetching summary data.' });
    }
});


// --- User Management Routes ---
// Base path for these will be /api/admin (assuming setup in server.js)

// GET /api/admin/users - Fetch all users (or filter by branch)
router.get(
    '/users',
    authMiddleware,
    adminMiddleware,
    getAllUsers // Use imported controller function
);

// GET /api/admin/users/pending - Fetch pending users
router.get(
    '/users/pending',
    authMiddleware,
    adminMiddleware,
    getPendingUsers // Use imported controller function
);

// POST /api/admin/users/:userId/approve - Approve a user
router.post(
    '/users/:userId/approve',
    authMiddleware,
    adminMiddleware,
    approveUser // Use imported controller function
);

// --- Add routes for Support, Fraud, Branches later ---
// Example:
// router.get('/support/tickets', authMiddleware, adminMiddleware, getAllSupportTicketsAdmin);


export default router; // Export the configured router
// server/routes/accountRoutes.js
import express from "express";
import { getUserAccounts } from "../controllers/accountController.js"; // Import controller function
import authMiddleware from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

// Route to get all accounts for the currently logged-in user
// All routes defined here are automatically prefixed with '/api/accounts' (from server.js)
router.get(
    '/',             // Path is just '/' relative to the base '/api/accounts'
    authMiddleware,  // Ensure user is logged in
    getUserAccounts  // Execute the controller function
);

// --- Add other account-specific routes here later ---
// e.g., router.get('/:accountId', authMiddleware, getAccountById);

export default router;
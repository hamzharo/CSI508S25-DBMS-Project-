// server/routes/transactionRoutes.js
import express from "express";
import {
    getTransactions,
    transferFunds,
    deposit,         
    withdrawal       
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure this middleware is correctly protecting routes

const router = express.Router();

// Existing Routes (Prefix /api/transactions)
router.get(
    "/",             // GET /api/transactions/
    authMiddleware,  // Requires login
    getTransactions  // Gets history for logged-in user
);
router.post(
    "/transfer",     // POST /api/transactions/transfer
    authMiddleware,  // Requires login
    transferFunds    // Performs transfer from logged-in user
);

// --- NEW Deposit/Withdrawal Routes (Prefix /api/transactions) ---
router.post(
    "/deposit",      // POST /api/transactions/deposit
    authMiddleware,  // Requires login
    deposit          // Deposits into logged-in user's specified account
);
router.post(
    "/withdrawal",   // POST /api/transactions/withdrawal
    authMiddleware,  // Requires login
    withdrawal       // Withdraws from logged-in user's specified account
);

export default router;
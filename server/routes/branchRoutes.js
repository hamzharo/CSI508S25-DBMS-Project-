// server/routes/branchRoutes.js
import express from "express";
import {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch
    // deleteBranch // Add if implementing delete
} from "../controllers/branchController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes defined here are automatically prefixed with '/api/branches' (from server.js)
// All routes require admin privileges

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    createBranch
);

router.get(
    '/',
    authMiddleware,
    adminMiddleware, // Or just authMiddleware if customers can view branches?
    getAllBranches
);

router.get(
    '/:id',
    authMiddleware,
    adminMiddleware, // Or just authMiddleware?
    getBranchById
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    updateBranch
);

// Optional Delete Route
// router.delete('/:id', authMiddleware, adminMiddleware, deleteBranch);

export default router;
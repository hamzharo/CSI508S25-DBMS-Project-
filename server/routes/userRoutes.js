// server/routes/userRoutes.js
import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile); // Get User Profile
router.put("/profile", authMiddleware, updateUserProfile); // Update User Profile

export default router;

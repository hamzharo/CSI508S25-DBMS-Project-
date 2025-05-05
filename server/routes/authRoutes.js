// server/routes/authRoutes.js
import express from "express";
import {
  // sendVerificationEmail, // Keep if you want a resend feature later
  // verifyEmail, // This is the old one - remove/comment out
  register,
  login,
  verifyEmailToken, 
  forgotPassword, 
  resetPassword   
} from "../controllers/authController.js";

const router = express.Router();

// Optional: Keep for resend feature if needed
 //router.post("/send-verification-email", sendVerificationEmail);


// Core auth routes
router.post("/register", register);
router.post("/login", login);

// --- Password Reset Routes ---
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password", resetPassword);   

//  Route for handling token verification from email link
router.get("/verify-email", verifyEmailToken);; 

export default router;
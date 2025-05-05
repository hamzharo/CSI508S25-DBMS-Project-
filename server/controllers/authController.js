// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js"; 
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from 'crypto';
// import {resendVerificationEmail} from "../controllers/authController.js";


dotenv.config();
// router.post("/resend-verification", resendVerificationEmail); 


// Optional: Placeholder for potential "resend verification" feature
// export const sendVerificationEmail = async (req, res) => { /* ... */ };

// =============================================
//  Register User Function (Refactored for Pool)
// =============================================
export const register = async (req, res) => { 
  // 1. Destructure fields
  const {
    email, password, firstName, lastName, dob, citizenship, ssn, gender,
    phone, address, street, apt, city, country, zip, localAddressSame
  } = req.body;

  // 2. Basic Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields (Email, Password, First Name, Last Name)." });
  }

  try {
    // 3. Check if email already exists using the pool
    const checkEmailSql = "SELECT id FROM users WHERE email = ?";
    const [resultsCheck] = await pool.query(checkEmailSql, [email]); // <-- Use pool.query with await

    if (resultsCheck.length > 0) {
      return res.status(409).json({ message: "Email address is already registered." });
    }

    // 4. Hash password (using async version of bcrypt hash)
    const hashedPassword = await bcrypt.hash(password, 10); // <-- Use await with bcrypt's promise

    // 5. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // 7. Prepare SQL INSERT statement
    const insertSql = `
      INSERT INTO users (
          email, password, first_name, last_name, dob, citizenship, ssn, gender,
          phone, address, street, apt, city, country, zip, local_address_same,
          role, status, is_email_verified, email_verification_token, email_token_expires
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      email, hashedPassword, firstName, lastName, dob || null, citizenship || null,
      ssn || null, gender || null, phone || null, address || null, street || null,
      apt || null, city || null, country || null, zip || null, localAddressSame === true,
      'customer', 'pending_email_verification', false, verificationToken, tokenExpiry
    ];

    // 8. Execute Insert Query using the pool
    const [result] = await pool.query(insertSql, values); // <-- Use pool.query with await
    console.log(` User registered successfully with ID: ${result.insertId}`);

    // 9. Send Verification Email (nodemailer part remains largely the same)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials missing. Skipping verification email.");
      return res.status(201).json({ message: "Registration successful. Email verification step skipped due to server config." });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    console.log("Attempting to send verification email to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const mailOptions = {
      from: `"Online Bank" <${process.env.EMAIL_USER}>`, to: email,
      subject: "Verify Your Email Address for Online Bank",
      text: `Click link to verify: ${verificationLink} (Expires in 1 hour)`,
      html: `<p>Thank you for registering...</p><p><a href="${verificationLink}">Verify Email Address</a></p><p>Expires in <strong>1 hour</strong>.</p>`,
    };

    // Send mail using async/await with nodemailer if preferred, or keep callback
    transporter.sendMail(mailOptions, (mailErr, info) => {
      if (mailErr) {
        console.error(" Error sending verification email. Details:", mailErr);
        // Still 201 as user was created, but inform about email failure
        return res.status(201).json({
          message: "Registration successful, but the verification email could not be sent. Please contact support.",
          error: "Failed to send verification email."
        });
      }
      console.log(" Verification email sent:", info.response);
      res.status(201).json({
        message: "Registration successful! Please check your email inbox (and spam folder) to verify your account."
      });
    });

  } catch (err) { // <-- Catch errors from await blocks
    console.error(" Error during registration process:", err);
    // Check for specific DB errors if needed (e.g., err.code === 'ER_DUP_ENTRY')
    res.status(500).json({ message: "Error processing registration." });
  }
}; // End register function

// =============================================
// Login Function (Refactored for Pool & Status Check)
// =============================================
export const login = async (req, res) => { // <-- Added async
  const { email, password } = req.body;

  // TODO: Add input validation

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await pool.query(sql, [email]); // <-- Use pool.query with await

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];

    // --- Status Check ---
    if (user.status !== 'active') {
      let reason = 'Login failed. Account is not active.';
      if (user.status === 'pending_email_verification') reason = 'Account not yet active. Please verify your email address first.';
      else if (user.status === 'pending_approval') reason = 'Account verification successful, but pending administrator approval.';
      else if (user.status === 'inactive' || user.status === 'blocked') reason = 'Account has been suspended or blocked. Please contact support.';
      console.warn(`Login attempt failed for inactive user: ${user.email}, Status: ${user.status}`);
      return res.status(403).json({ message: reason });
    }
    // --- End Status Check ---

    // Compare passwords using bcrypt's async version
    const isMatch = await bcrypt.compare(password, user.password); // <-- Use await

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // --- If login is successful ---
    const payload = { id: user.id, role: user.role };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "1h" };

    if (!secret) {
      console.error('FATAL ERROR: JWT_SECRET is not defined.');
      return res.status(500).json({ message: "Server configuration error." });
    }

    // Use await for jwt.sign if using a promise-based wrapper, or keep callback
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error('Error signing JWT:', err);
        return res.status(500).json({ message: 'Error generating session.' });
      }
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name }
      });
    });

  } catch (err) { // <-- Catch errors from await blocks
    console.error("Error during login process:", err);
    res.status(500).json({ message: "Error logging in." });
  }
}; // End login function


// =============================================
// Email Verification Token Handler (Refactored for Pool)
// =============================================
//export const router.post("/verify-email", verifyEmailToken);
export const verifyEmailToken = async (req, res) => {
  const { token } = req.query;

  console.log(`[verifyEmailToken] Received token from query: ${token ? token.substring(0,10)+'...' : 'MISSING'}`);

  if (!token) {
    return res.status(400).json({ message: "Verification token misisng from request." });
  }

  try {
    // 2. Find the user with this token
    const findTokenSql = `
      SELECT id, status FROM users
      WHERE email_verification_token = ? AND email_token_expires > NOW() AND status = 'pending_email_verification'
    `;
    const [results] = await pool.query(findTokenSql, [token]); // <-- Use pool.query

    // 3. Check if found
    if (results.length === 0) {
      const checkExpiredSql = "SELECT id FROM users WHERE email_verification_token = ?";
      const [expiredResults] = await pool.query(checkExpiredSql, [token]); // <-- Use pool.query

      if (expiredResults.length > 0) {
        return res.status(400).json({ message: "Verification link has expired or is invalid. Please request a new one." });
      } else {
        return res.status(404).json({ message: "Invalid verification token." });
      }
    }

    // 4. Update the user
    const user = results[0];
    const userId = user.id;
    const updateSql = `
      UPDATE users SET is_email_verified = TRUE, status = 'pending_approval',
      email_verification_token = NULL, email_token_expires = NULL, updated_at = NOW()
      WHERE id = ? AND status = 'pending_email_verification'
    `;
    const [updateResult] = await pool.query(updateSql, [userId]); // <-- Use pool.query

    if (updateResult.affectedRows === 0) {
      console.warn(` User ${userId} status update affected 0 rows during verification...`);
      return res.status(400).json({ message: "Could not verify email at this time." });
    }

    console.log(` Email verified for user ID: ${userId}. Status set to pending_approval.`);
    res.json({ message: "Email verified successfully! Your account is now pending administrator approval." });

  } catch (err) { // <-- Catch errors from await blocks
    console.error(" Error during email token verification:", err);
    return res.status(500).json({ message: "Error verifying email token." });
  }
}; // End router.postfunction



// =============================================
//Forgot Password (Request Reset Token)
// =============================================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: "Email address is required." });
  }
  // Optional: Add stricter email format validation

  try {
      // 1. Find user by email
      const findUserSql = "SELECT id, email, status FROM users WHERE email = ?";
      const [users] = await pool.query(findUserSql, [email]);

      // IMPORTANT: ALWAYS return a generic success message even if user not found
      // This prevents attackers from guessing valid email addresses (email enumeration).
      if (users.length === 0) {
          console.log(`Password reset requested for non-existent email: ${email}`);
          return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
      }

      const user = users[0];

      // Optional: Prevent password reset for non-active users?
      // if (user.status !== 'active') {
      //     console.log(`Password reset requested for inactive user: ${email}, Status: ${user.status}`);
      //     return res.json({ message: "If an account with that email exists and is active, a password reset link has been sent." });
      // }

      // 2. Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');

      // 3. Set token expiry (e.g., 15 minutes from now)
      const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // 4. Store token and expiry in the database for the user
      const updateTokenSql = `
          UPDATE users SET
              password_reset_token = ?,
              password_reset_expires = ?,
              updated_at = NOW()
          WHERE id = ?
      `;
      await pool.query(updateTokenSql, [resetToken, resetTokenExpiry, user.id]);
      console.log(`Password reset token generated for user ID: ${user.id}`);

      // 5. Send the password reset email
      // Ensure EMAIL_USER and EMAIL_PASS are set in .env
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
           console.error(" Email credentials missing. Cannot send password reset email.");
           // Still return generic success to user, but log server error
           return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
      // Use a different path for password reset on the frontend
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

      console.log(` Attempting to send password reset email to: ${email}`);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      const mailOptions = {
        from: `"Online Bank" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Request - Online Bank",
        text: `You requested a password reset for your Online Bank account.\n\nPlease click the following link to reset your password:\n\n${resetLink}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
        html: `<p>You requested a password reset for your Online Bank account.</p><p>Please click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p><p>This link will expire in <strong>15 minutes</strong>.</p><p>If you did not request this, please ignore this email.</p>`,
      };

      // Send mail (no need to await if we return generic success anyway)
      transporter.sendMail(mailOptions, (mailErr, info) => {
          if (mailErr) {
              // Log error server-side, but don't expose failure to user
              console.error(" Error sending password reset email:", mailErr);
          } else {
              console.log(" Password reset email sent:", info.response);
          }
      });

      // 6. Return generic success response
      res.json({ message: "If an account with that email exists, a password reset link has been sent." });

  } catch (err) {
      console.error(" Error during forgot password process:", err);
      // Return a generic error message in case of unexpected issues
      res.status(500).json({ message: "An error occurred while processing your request." });
  }
};


// =============================================
// Reset Password (Using Token)
// =============================================
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Validation
  if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
  }
  // Add password strength validation if desired
  if (newPassword.length < 6) { // Example minimum length
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
      // 1. Find user by valid, non-expired reset token
      const findTokenSql = `
          SELECT id
          FROM users
          WHERE password_reset_token = ?
            AND password_reset_expires > NOW()
      `;
      const [users] = await pool.query(findTokenSql, [token]);

      if (users.length === 0) {
          console.log(`Password reset attempt with invalid or expired token: ${token.substring(0,10)}...`);
          return res.status(400).json({ message: "Password reset link is invalid or has expired." });
      }

      const userId = users[0].id;

      // 2. Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 3. Update the user's password and clear the reset token fields
      const updatePasswordSql = `
          UPDATE users SET
              password = ?,
              password_reset_token = NULL,
              password_reset_expires = NULL,
              updated_at = NOW()
          WHERE id = ?
      `;
      const [updateResult] = await pool.query(updatePasswordSql, [hashedPassword, userId]);

      if (updateResult.affectedRows === 0) {
           // Should not happen if user was found, but safety check
           console.error(`Failed to update password for user ${userId} after token validation.`);
           return res.status(500).json({ message: "Error resetting password." });
      }

      console.log(` Password successfully reset for user ID: ${userId}`);

      // Optional: Log the user in immediately by generating a new JWT? Or just confirm success.
      res.json({ message: "Password has been reset successfully. You can now log in with your new password." });

  } catch (err) {
      console.error(" Error during password reset process:", err);
      res.status(500).json({ message: "An error occurred while resetting your password." });
  }
};



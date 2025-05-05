// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  // --- THIS IS LOGGING ---
  console.log('--- Auth Middleware ---');
  console.log('Received Headers:', JSON.stringify(req.headers, null, 2)); // Log all headers
  console.log('Attempting to read:', req.headers.authorization); // Log the specific header
  // --- END LOGGING ---

  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
  console.log('Extracted Token:', token); // Log what was extracted

  if (!token) {
    console.log(' Token extraction failed!'); // Log failure reason
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(' Token Verified. Decoded Payload:', decoded);
    req.user = decoded; // Attach decoded user info to request object
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error(' Token Verification Error:', error.message); // Log verification error
    return res.status(401).json({ message: "Invalid token. Authentication failed." });
  }
};

export default authMiddleware;
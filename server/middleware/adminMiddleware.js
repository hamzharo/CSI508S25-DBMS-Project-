// server/middleware/adminMiddleware.js
import db from "../config/db.js"; // Optional: needed if you fetch fresh user data

/*
 * Middleware to check if the authenticated user has the 'admin' role.
 * Assumes that the authMiddleware has already run and attached user info
 * (including role) to req.user.
 */
const adminMiddleware = (req, res, next) => {
  // Check if user info is attached and if the role is 'admin'
  if (req.user && req.user.role === 'admin') {
    // User is an admin, allow access to the next middleware/route handler
    next();
  } else {
    // User is not logged in, not an admin, or role info is missing
    console.warn(` Forbidden access attempt to admin route by user ID: ${req.user?.id} with role: ${req.user?.role}`);
    res.status(403).json({ message: 'Access forbidden. Admin privileges required.' });
  }

  // Optional: Fetch fresh user data from DB for extra security
  // This prevents using an old token if the user's role was changed AFTER the token was issued.
  /*
  if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Authentication required.' });
  }
  const userId = req.user.id;
  const sql = "SELECT role FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
      if (err) {
          console.error(" Database error checking admin role:", err);
          return res.status(500).json({ message: 'Error verifying user role.' });
      }
      if (results.length === 0 || results[0].role !== 'admin') {
          console.warn(` Forbidden access attempt to admin route by user ID: ${userId}. Role in DB: ${results[0]?.role}`);
          return res.status(403).json({ message: 'Access forbidden. Admin privileges required.' });
      }
      // Role verified from DB, proceed
      next();
  });
  */
};

export default adminMiddleware;
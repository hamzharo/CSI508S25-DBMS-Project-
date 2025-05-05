// server/controllers/userController.js
import pool from "../config/db.js"; // Import the pool

// Get User Profile (Including basic account info)
export const getUserProfile = async (req, res) => { // Added async
  const userId = req.user.id; // Assumes authMiddleware adds req.user

  try {
    // Fetch user details and JOIN with accounts to get balance (assuming one primary account for simplicity)
    // Adjust JOIN or add separate queries if user can have multiple accounts and you need specific ones
    const sql = `
        SELECT
            u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.phone, u.address, u.dob, u.created_at,
            a.id as account_id, a.account_number, a.account_type, a.balance, a.status as account_status
        FROM users u
        LEFT JOIN accounts a ON u.id = a.user_id
        WHERE u.id = ?
        LIMIT 1; -- Assuming we fetch info related to one account, adjust if needed
        `;
    // Using LEFT JOIN ensures user profile is returned even if they have no accounts yet

    const [results] = await pool.query(sql, [userId]); // <-- Use pool.query

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Structure the response (separating user and account info might be cleaner)
    const userProfile = results[0];
    const response = {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role,
        status: userProfile.status,
        phone: userProfile.phone,
        address: userProfile.address,
        dob: userProfile.dob,
        createdAt: userProfile.created_at,
        account: userProfile.account_id ? { // Check if account info exists
            id: userProfile.account_id,
            accountNumber: userProfile.account_number,
            accountType: userProfile.account_type,
            balance: userProfile.balance,
            status: userProfile.account_status
        } : null // Return null if no account found
    };

    res.json(response);

  } catch (err) {
    console.error(" Database error getting user profile:", err);
    res.status(500).json({ message: "Error fetching user profile." });
  }
};

// Update User Profile (Basic Fields - Add more as needed)
export const updateUserProfile = async (req, res) => { // Added async
  const userId = req.user.id;
  // Destructure fields allowed for update from req.body
  const { firstName, lastName, phone, address, dob, citizenship, ssn, street, apt, city, country, zip } = req.body;

  // Basic check - could add more validation
  if (!firstName && !lastName && !phone && !address && !dob && !citizenship && !ssn && !street && !apt && !city && !country && !zip) {
      return res.status(400).json({ message: "No update information provided." });
  }

  // Build the SET part of the query dynamically (careful with SQL injection if not using prepared statements properly)
  // Using mysql2's built-in escaping handles this safely when values are passed separately
  const fieldsToUpdate = {};
  if (firstName) fieldsToUpdate.first_name = firstName;
  if (lastName) fieldsToUpdate.last_name = lastName;
  if (phone) fieldsToUpdate.phone = phone;
  if (address) fieldsToUpdate.address = address;
  if (dob) fieldsToUpdate.dob = dob;
  if (citizenship) fieldsToUpdate.citizenship = citizenship;
  if (ssn) fieldsToUpdate.ssn = ssn; // Consider security implications of updating SSN
  if (street) fieldsToUpdate.street = street;
  if (apt) fieldsToUpdate.apt = apt;
  if (city) fieldsToUpdate.city = city;
  if (country) fieldsToUpdate.country = country;
  if (zip) fieldsToUpdate.zip = zip;
  // Add other updatable fields here

  if (Object.keys(fieldsToUpdate).length === 0) {
     return res.status(400).json({ message: "No valid fields provided for update." });
  }

  // Add updated_at timestamp
  fieldsToUpdate.updated_at = new Date();

  try {
    const sql = "UPDATE users SET ? WHERE id = ?"; // Use object notation for SET
    const [result] = await pool.query(sql, [fieldsToUpdate, userId]); // Pass object and ID

    if (result.affectedRows === 0) {
        // This could happen if the userId derived from the token doesn't exist anymore
        return res.status(404).json({ message: "User not found for update." });
    }

    res.json({ message: "Profile updated successfully." });

  } catch (err) {
    console.error(" Database error updating user profile:", err);
    // Check for specific errors like duplicate entries if constraints exist (e.g., unique phone)
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "Update failed. Duplicate value detected (e.g., email or phone)." });
    }
    res.status(500).json({ message: "Error updating profile." });
  }
};
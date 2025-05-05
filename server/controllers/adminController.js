// // server/controllers/adminController.js
// import pool from "../config/db.js"; // Import the pool
// import { generateAccountNumber } from "../utils/accountUtils.js"; // Import the account number generator

// // --- Get Pending Users ---
// export const getPendingUsers = async (req, res) => { // Added async
//   try {  
//     // Select users waiting for approval, showing relevant details
//     const sql = `
//             SELECT id, email, first_name, last_name, created_at, is_email_verified
//             FROM users
//             WHERE status = 'pending_approval'
//             ORDER BY created_at ASC
//         `;
//     const [pendingUsers] = await pool.query(sql); // <-- Use pool.query
//     res.json(pendingUsers);
//   } catch (err) {
//     console.error(" Database error getting pending users:", err);
//     res.status(500).json({ message: "Error fetching pending users." });
//   }
// };


// // Get All Users (Selecting relevant fields) - WITH FILTERING BY BRANCH
// export const getAllUsers = async (req, res) => { // Added async
//   try {
//     // --- Filtering Logic ---
//     const { branchId } = req.query; // Get optional branchId filter

//     let sql = `
//         SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.created_at, u.is_email_verified, u.branch_id, b.name as branch_name
//         FROM users u
//         LEFT JOIN branches b ON u.branch_id = b.id
//         `; // Select relevant columns and join to get branch name
//     const queryParams = [];

//     if (branchId) {
//         const branchIdInt = parseInt(branchId);
//         if (!isNaN(branchIdInt)) {
//             sql += " WHERE u.branch_id = ?";
//             queryParams.push(branchIdInt);
//         } else if (branchId.toLowerCase() === 'null' || branchId.toLowerCase() === 'unassigned') {
//              sql += " WHERE u.branch_id IS NULL";
//              // No parameter needed for IS NULL
//         } else {
//             console.warn(`Invalid branchId filter ignored: ${branchId}`);
//             // Ignore invalid filter, return all users
//         }
//     }

//     sql += " ORDER BY u.created_at DESC"; // Add ordering

//     console.log("Executing SQL:", pool.format(sql, queryParams));
//     const [results] = await pool.query(sql, queryParams); // <-- Use pool.query
//     res.json(results);

//   } catch (err) {
//     console.error(" Database error getting all users:", err);
//     res.status(500).json({ message: "Error fetching users." });
//   }
// };




// // Approve User and Create Account ---
// export const approveUser = async (req, res) => { // Added async
//   const { userId } = req.params; // Get userId from route parameter

//   if (!userId || isNaN(parseInt(userId))) {
//       return res.status(400).json({ message: "Invalid User ID provided." });
//   }
//   const userIdInt = parseInt(userId);

//   let connection; // For database transaction

//   try {
//     connection = await pool.getConnection(); // Get connection for transaction
//     await connection.beginTransaction();   // Start transaction

//     // 1. Check current user status (ensure they are pending approval)
//     const checkStatusSql = "SELECT status FROM users WHERE id = ?";
//     const [users] = await connection.query(checkStatusSql, [userIdInt]);

//     if (users.length === 0) {
//          await connection.rollback();
//          connection.release();
//          return res.status(404).json({ message: "User not found." });
//     }
//     if (users[0].status !== 'pending_approval') {
//          await connection.rollback();
//          connection.release();
//          return res.status(400).json({ message: `User is not pending approval (Status: ${users[0].status}).` });
//     }

//     // 2. Update user status to 'active'
//     const updateUserSql = "UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ?";
//     const [updateResult] = await connection.query(updateUserSql, [userIdInt]);

//     if (updateResult.affectedRows === 0) {
//         // Should not happen if check above passed, but safety check
//         throw new Error(`Failed to update status for user ${userIdInt}.`);
//     }

//     // 3. Generate a unique account number
//     // IMPORTANT: In production, add retry logic or a robust unique generation
//     // strategy to handle potential account number collisions.
//     let accountNumber;
//     let accountExists = true;
//     let attempts = 0;
//     const maxAttempts = 5; // Limit attempts to prevent infinite loop

//     while (accountExists && attempts < maxAttempts) {
//         attempts++;
//         accountNumber = generateAccountNumber();
//         const checkAccountSql = "SELECT id FROM accounts WHERE account_number = ?";
//         const [existingAccounts] = await connection.query(checkAccountSql, [accountNumber]);
//         if (existingAccounts.length === 0) {
//             accountExists = false;
//         } else {
//              console.warn(`Account number collision attempt ${attempts}: ${accountNumber}`);
//         }
//     }

//     if (accountExists) { // Failed to generate unique number after several attempts
//         throw new Error(`Could not generate a unique account number for user ${userIdInt} after ${maxAttempts} attempts.`);
//     }


//     // 4. Create a default 'Checking' account for the user
//     const createAccountSql = `
//             INSERT INTO accounts (user_id, account_number, account_type, balance, status)
//             VALUES (?, ?, ?, ?, ?)
//         `;
//     await connection.query(createAccountSql, [
//         userIdInt,          // user_id
//         accountNumber,      // generated account_number
//         'Checking',         // default account_type
//         0.00,               // initial balance
//         'active'            // account status
//     ]);

//     // 5. Commit the transaction
//     await connection.commit();

//     console.log(`Admin approved User ID: ${userIdInt}. Status set to active. Account ${accountNumber} created.`);
//     res.json({ message: "User approved successfully and initial account created.", accountNumber: accountNumber });

//   } catch (err) {
//     console.error(` Error approving user ${userIdInt}:`, err);
//     // Rollback transaction if an error occurs
//     if (connection) {
//       await connection.rollback();
//     }
//     res.status(500).json({ message: "Failed to approve user.", error: err.message });
//   } finally {
//     // Always release the connection
//     if (connection) {
//       connection.release();
//       console.log("DB Connection Released after approval attempt.");
//     }
//   }
// };




// // =============================================
// //  Update User Details (Admin - including branch assignment)
// // =============================================
// export const updateUserAdmin = async (req, res) => {
//     // Admin performing the action (from token)
//     // const performingAdminId = req.user.id;

//     // User being updated (from URL param)
//     const { userId } = req.params;
//     const userIdInt = parseInt(userId);

//     // Fields that can be updated by admin (from request body)
//     // For now, focusing on branch_id. Can add role, status later.
//     const { branchId } = req.body; // Expecting 'branchId' (can be number or null)

//     // --- Validation ---
//     if (isNaN(userIdInt)) {
//         return res.status(400).json({ message: "Invalid User ID provided in URL." });
//     }

//     // Validate branchId format if provided
//     let branchIdValue = null; // Default to null if not provided or explicitly set to null
//     if (branchId !== undefined) {
//         if (branchId === null) {
//             branchIdValue = null; // Allow unassigning
//         } else {
//             branchIdValue = parseInt(branchId);
//             if (isNaN(branchIdValue)) {
//                 return res.status(400).json({ message: "Invalid Branch ID format provided in body. Must be a number or null." });
//             }
//         }
//     } else {
//         // If branchId wasn't sent in the body at all
//          return res.status(400).json({ message: "No update information provided (expected 'branchId')." });
//     }

//     try {
//         // --- Pre-checks (Optional but Recommended) ---
//         // 1. Verify the target user exists
//         const [userCheck] = await pool.query("SELECT id FROM users WHERE id = ?", [userIdInt]);
//         if (userCheck.length === 0) {
//             return res.status(404).json({ message: `User with ID ${userIdInt} not found.` });
//         }

//         // 2. If assigning a branch (branchIdValue is not null), verify the branch exists
//         if (branchIdValue !== null) {
//             const [branchCheck] = await pool.query("SELECT id FROM branches WHERE id = ?", [branchIdValue]);
//             if (branchCheck.length === 0) {
//                 return res.status(404).json({ message: `Branch with ID ${branchIdValue} not found. Cannot assign user.` });
//             }
//         }
//         // --- End Pre-checks ---


//         // --- Prepare Update ---
//         const updateFields = {
//             branch_id: branchIdValue, // Set to the validated number or null
//             updated_at: new Date()
//         };
//         // Add other fields here later if needed (e.g., status, role)
//         // if (status) updateFields.status = status;
//         // if (role) updateFields.role = role;


//         // --- Execute Update ---
//         const sql = "UPDATE users SET ? WHERE id = ?";
//         const [result] = await pool.query(sql, [updateFields, userIdInt]);

//         if (result.affectedRows === 0) {
//             // Should have been caught by userCheck, but safety net
//             return res.status(404).json({ message: `User with ID ${userIdInt} not found during update.` });
//         }

//         console.log(` Admin updated details for User ID: ${userIdInt}. Branch ID set to: ${branchIdValue}`);

//         // Fetch updated user data (excluding sensitive info) to return
//         const [updatedUser] = await pool.query(
//             "SELECT id, email, first_name, last_name, role, status, branch_id, updated_at FROM users WHERE id = ?",
//              [userIdInt]
//         );
//         res.json({ message: "User details updated successfully.", user: updatedUser[0] });

//     } catch (err) {
//         console.error(` Database error updating user ${userIdInt} (admin):`, err);
//         // Handle potential foreign key constraint errors if pre-check fails somehow
//         if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk_user_branch')) {
//              return res.status(400).json({ message: "Invalid Branch ID provided." });
//         }
//         res.status(500).json({ message: "Error updating user details.", error: err.message });
//     }
// };


// // Update User Balance (OBSOLETE - Balance is on accounts table)
// // Keeping the function structure refactored but commenting out the core logic
// // This endpoint should likely be removed or repurposed for other admin actions on users.
// export const updateUserBalance = async (req, res) => { // Added async
//     console.warn(" WARNING: updateUserBalance controller called - this function is obsolete as balance resides in the 'accounts' table.");
//     // const { userId, balance } = req.body;

//     return res.status(400).json({ message: "This function (updateUserBalance) is obsolete and should not be used. Balance is managed in the 'accounts' table." });

//     /* // Original logic commented out - DO NOT USE
//     try {
//         const sql = "UPDATE users SET balance = ? WHERE id = ?"; // This won't work - no 'balance' column
//         const [result] = await pool.query(sql, [balance, userId]);

//         if (result.affectedRows === 0) {
//              return res.status(404).json({ message: "User not found for balance update." });
//         }
//         res.json({ message: "User balance update attempted (OBSOLETE FUNCTION)." });

//     } catch (err) {
//         console.error(" Database error attempting obsolete balance update:", err);
//         res.status(500).json({ message: "Error attempting obsolete balance update." });
//     }
//     */


// };

// // --- ADD NEW ADMIN CONTROLLER FUNCTIONS HERE LATER ---
// // e.g., getPendingUsers, approveUser, blockUser, etc.



// server/controllers/adminController.js
import pool from "../config/db.js"; // Import the pool
import { generateAccountNumber } from "../utils/accountUtils.js"; // Import the account number generator

// --- Get Pending Users ---
export const getPendingUsers = async (req, res) => { // Added async
  try {
    // Select users waiting for approval, showing relevant details
    const sql = `
            SELECT id, email, first_name, last_name, created_at, is_email_verified
            FROM users
            WHERE status = 'pending_approval'
            ORDER BY created_at ASC
        `;
    const [pendingUsers] = await pool.query(sql); // <-- Use pool.query
    res.json(pendingUsers);
  } catch (err) {
    console.error(" Database error getting pending users:", err);
    res.status(500).json({ message: "Error fetching pending users." });
  }
};


// Get All Users (Selecting relevant fields) - WITH FILTERING BY BRANCH
export const getAllUsers = async (req, res) => { // Added async
  try {
    // --- Filtering Logic ---
    const { branchId } = req.query; // Get optional branchId filter

    let sql = `
        SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.created_at, u.is_email_verified, u.branch_id, b.name as branch_name
        FROM users u
        LEFT JOIN branches b ON u.branch_id = b.id
        `; // Select relevant columns and join to get branch name
    const queryParams = [];

    if (branchId) {
        const branchIdInt = parseInt(branchId);
        if (!isNaN(branchIdInt)) {
            sql += " WHERE u.branch_id = ?";
            queryParams.push(branchIdInt);
        } else if (branchId.toLowerCase() === 'null' || branchId.toLowerCase() === 'unassigned') {
             sql += " WHERE u.branch_id IS NULL";
             // No parameter needed for IS NULL
        } else {
            console.warn(`Invalid branchId filter ignored: ${branchId}`);
            // Ignore invalid filter, return all users
        }
    }

    sql += " ORDER BY u.created_at DESC"; // Add ordering

    console.log("Executing SQL:", pool.format(sql, queryParams));
    const [results] = await pool.query(sql, queryParams); // <-- Use pool.query
    res.json(results);

  } catch (err) {
    console.error(" Database error getting all users:", err);
    res.status(500).json({ message: "Error fetching users." });
  }
};


// Approve User and Create Account ---
export const approveUser = async (req, res) => { // Added async

  // =============================================
  // === START DIAGNOSTIC LOGGING (STEP 1) ===
  // =============================================
  console.log('--- Entering approveUser ---');
  console.log('req.user (from middleware):', req.user); // Check if req.user exists and has an 'id'
  // =============================================

  const { userId } = req.params; // Get userId from route parameter
  const performingAdminId = req.user?.id; // Use optional chaining ?. just in case req.user is missing

  // =============================================
  // === START DIAGNOSTIC LOGGING (STEP 2) ===
  // =============================================
  console.log('Extracted performingAdminId:', performingAdminId); // Check the extracted ID
  // =============================================


  if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ message: "Invalid User ID provided." });
  }
  const userIdInt = parseInt(userId);

  // =============================================
  // === START DIAGNOSTIC LOGGING (STEP 3) ===
  // =============================================
  console.log('Parsed customer ID (userIdInt):', userIdInt); // Check the parsed customer ID
  // =============================================

  let connection; // For database transaction

  try {
    connection = await pool.getConnection(); // Get connection for transaction
    await connection.beginTransaction();   // Start transaction

    // 1. Check current user status (ensure they are pending approval)
    const checkStatusSql = "SELECT status FROM users WHERE id = ?";
    const [users] = await connection.query(checkStatusSql, [userIdInt]);

    if (users.length === 0) {
         await connection.rollback();
         connection.release();
         return res.status(404).json({ message: "User not found." });
    }
    if (users[0].status !== 'pending_approval') {
         await connection.rollback();
         connection.release();
         return res.status(400).json({ message: `User is not pending approval (Status: ${users[0].status}).` });
    }

    // 2. Update user status to 'active'
    const updateUserSql = "UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ?";
    const [updateResult] = await connection.query(updateUserSql, [userIdInt]);

    if (updateResult.affectedRows === 0) {
        // Should not happen if check above passed, but safety check
        throw new Error(`Failed to update status for user ${userIdInt}.`);
    }

    // 3. Generate a unique account number
    let accountNumber;
    let accountExists = true;
    let attempts = 0;
    const maxAttempts = 5; // Limit attempts to prevent infinite loop
    while (accountExists && attempts < maxAttempts) {
        attempts++;
        accountNumber = generateAccountNumber();
        const checkAccountSql = "SELECT id FROM accounts WHERE account_number = ?";
        const [existingAccounts] = await connection.query(checkAccountSql, [accountNumber]);
        if (existingAccounts.length === 0) {
            accountExists = false;
        } else {
             console.warn(`Account number collision attempt ${attempts}: ${accountNumber}`);
        }
    }
    if (accountExists) { // Failed to generate unique number after several attempts
        throw new Error(`Could not generate a unique account number for user ${userIdInt} after ${maxAttempts} attempts.`);
    }


    // 4. Create a default 'Checking' account for the user
    const createAccountSql = `
            INSERT INTO accounts (user_id, account_number, account_type, balance, status)
            VALUES (?, ?, ?, ?, ?)
        `;
    await connection.query(createAccountSql, [
        userIdInt,          // user_id
        accountNumber,      // generated account_number
        'Checking',         // default account_type
        0.00,               // initial balance
        'active'            // account status
    ]);

    // ================================================
    // --- START: Populate Approve table ---
    // ================================================
    try {
        // =============================================
        // === START DIAGNOSTIC LOGGING (STEP 4) ===
        // =============================================
        console.log('--- Attempting to Populate Approve Table ---');
        console.log('Admin ID for Approve:', performingAdminId);
        console.log('Customer ID for Approve:', userIdInt);
        // =============================================

        const populateApproveSql = `
            INSERT INTO Approve (admin_user_id, customer_user_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE approval_timestamp = NOW() -- Handle rare case if called again
        `;
        await connection.query(populateApproveSql, [
            performingAdminId, // admin_user_id (who did the action)
            userIdInt          // customer_user_id (who got approved)
        ]);
        console.log(` Approve table populated for Customer ID: ${userIdInt} by Admin ID: ${performingAdminId}`); // Success log
    } catch (approveErr) {
        console.error(` Failed to populate Approve table for User ID ${userIdInt}:`, approveErr); // Error log
        // Decide if this failure should cause rollback. For now, just log.
        // If critical, uncomment the line below to force rollback:
        // throw new Error("Failed to record approval action.");
    }
    // ================================================
    // --- END: Populate Approve table ---
    // ================================================

    // 5. Commit the transaction
    await connection.commit();

    console.log(`Admin ${performingAdminId} approved User ID: ${userIdInt}. Status set to active. Account ${accountNumber} created.`);
    res.json({ message: "User approved successfully and initial account created.", accountNumber: accountNumber });

  } catch (err) {
    console.error(` Error approving user ${userIdInt}:`, err);
    // Rollback transaction if an error occurs
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ message: "Failed to approve user.", error: err.message });
  } finally {
    // Always release the connection
    if (connection) {
      connection.release();
      console.log("DB Connection Released after approval attempt.");
    }
  }
};


// =============================================
//  Update User Details (Admin - including branch assignment)
// =============================================
export const updateUserAdmin = async (req, res) => {
    // Admin performing the action (from token)
    // const performingAdminId = req.user.id;

    // User being updated (from URL param)
    const { userId } = req.params;
    const userIdInt = parseInt(userId);

    // Fields that can be updated by admin (from request body)
    // For now, focusing on branch_id. Can add role, status later.
    const { branchId } = req.body; // Expecting 'branchId' (can be number or null)

    // --- Validation ---
    if (isNaN(userIdInt)) {
        return res.status(400).json({ message: "Invalid User ID provided in URL." });
    }

    // Validate branchId format if provided
    let branchIdValue = null; // Default to null if not provided or explicitly set to null
    if (branchId !== undefined) {
        if (branchId === null) {
            branchIdValue = null; // Allow unassigning
        } else {
            branchIdValue = parseInt(branchId);
            if (isNaN(branchIdValue)) {
                return res.status(400).json({ message: "Invalid Branch ID format provided in body. Must be a number or null." });
            }
        }
    } else {
        // If branchId wasn't sent in the body at all
         return res.status(400).json({ message: "No update information provided (expected 'branchId')." });
    }

    try {
        // --- Pre-checks (Optional but Recommended) ---
        // 1. Verify the target user exists
        const [userCheck] = await pool.query("SELECT id FROM users WHERE id = ?", [userIdInt]);
        if (userCheck.length === 0) {
            return res.status(404).json({ message: `User with ID ${userIdInt} not found.` });
        }

        // 2. If assigning a branch (branchIdValue is not null), verify the branch exists
        if (branchIdValue !== null) {
            const [branchCheck] = await pool.query("SELECT id FROM branches WHERE id = ?", [branchIdValue]);
            if (branchCheck.length === 0) {
                return res.status(404).json({ message: `Branch with ID ${branchIdValue} not found. Cannot assign user.` });
            }
        }
        // --- End Pre-checks ---


        // --- Prepare Update ---
        const updateFields = {
            branch_id: branchIdValue, // Set to the validated number or null
            updated_at: new Date()
        };
        // Add other fields here later if needed (e.g., status, role)
        // if (status) updateFields.status = status;
        // if (role) updateFields.role = role;


        // --- Execute Update ---
        const sql = "UPDATE users SET ? WHERE id = ?";
        const [result] = await pool.query(sql, [updateFields, userIdInt]);

        if (result.affectedRows === 0) {
            // Should have been caught by userCheck, but safety net
            return res.status(404).json({ message: `User with ID ${userIdInt} not found during update.` });
        }

        console.log(` Admin updated details for User ID: ${userIdInt}. Branch ID set to: ${branchIdValue}`);

        // Fetch updated user data (excluding sensitive info) to return
        const [updatedUser] = await pool.query(
            "SELECT id, email, first_name, last_name, role, status, branch_id, updated_at FROM users WHERE id = ?",
             [userIdInt]
        );
        res.json({ message: "User details updated successfully.", user: updatedUser[0] });

    } catch (err) {
        console.error(` Database error updating user ${userIdInt} (admin):`, err);
        // Handle potential foreign key constraint errors if pre-check fails somehow
        if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.message.includes('fk_user_branch')) {
             return res.status(400).json({ message: "Invalid Branch ID provided." });
        }
        res.status(500).json({ message: "Error updating user details.", error: err.message });
    }
};


// Update User Balance (OBSOLETE - Balance is on accounts table)
// Keeping the function structure refactored but commenting out the core logic
// This endpoint should likely be removed or repurposed for other admin actions on users.
export const updateUserBalance = async (req, res) => { // Added async
    console.warn(" WARNING: updateUserBalance controller called - this function is obsolete as balance resides in the 'accounts' table.");
    // const { userId, balance } = req.body;

    return res.status(400).json({ message: "This function (updateUserBalance) is obsolete and should not be used. Balance is managed in the 'accounts' table." });

    /* // Original logic commented out - DO NOT USE
    try {
        const sql = "UPDATE users SET balance = ? WHERE id = ?"; // This won't work - no 'balance' column
        const [result] = await pool.query(sql, [balance, userId]);

        if (result.affectedRows === 0) {
             return res.status(404).json({ message: "User not found for balance update." });
        }
        res.json({ message: "User balance update attempted (OBSOLETE FUNCTION)." });

    } catch (err) {
        console.error(" Database error attempting obsolete balance update:", err);
        res.status(500).json({ message: "Error attempting obsolete balance update." });
    }
    */
};
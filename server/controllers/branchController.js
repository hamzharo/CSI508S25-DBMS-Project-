// server/controllers/branchController.js
import pool from "../config/db.js";

/**
 * @desc    Create a new branch
 * @route   POST /api/branches
 * @access  Private (Admin Only)
 */
export const createBranch = async (req, res) => {
    const { name, location, manager_id } = req.body;

    // Basic validation
    if (!name) {
        return res.status(400).json({ message: "Branch name is required." });
    }

    // Optional: Validate manager_id if provided (check if it's a valid admin user ID)
    // For simplicity, we'll rely on foreign key constraint for now,
    // but a pre-check is better for user experience.

    try {
        const sql = `
            INSERT INTO branches (name, location, manager_id)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            name,
            location || null, // Allow null location
            manager_id || null // Allow null manager initially
        ]);

        const newBranchId = result.insertId;
        console.log(` Branch created successfully with ID: ${newBranchId}`);

        // Fetch the created branch to return it
        const [newBranch] = await pool.query("SELECT * FROM branches WHERE id = ?", [newBranchId]);

        res.status(201).json(newBranch[0]);

    } catch (err) {
        console.error(" Database error creating branch:", err);
        // Handle potential foreign key errors for manager_id more gracefully
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: "Invalid manager ID provided. User does not exist." });
        }
        res.status(500).json({ message: "Error creating branch.", error: err.message });
    }
};

/**
 * @desc    Get all branches
 * @route   GET /api/branches
 * @access  Private (Admin Only - or adjust access later)
 */
export const getAllBranches = async (req, res) => {
    try {
        // Join with users table to get manager's name
        const sql = `
            SELECT
                b.id, b.name, b.location, b.manager_id, b.created_at, b.updated_at,
                CONCAT(u.first_name, ' ', u.last_name) AS manager_name
            FROM branches b
            LEFT JOIN users u ON b.manager_id = u.id AND u.role = 'admin'
            ORDER BY b.name ASC;
        `;
        const [branches] = await pool.query(sql);
        res.json(branches);
    } catch (err) {
        console.error(" Database error getting all branches:", err);
        res.status(500).json({ message: "Error fetching branches." });
    }
};

/**
 * @desc    Get a single branch by ID
 * @route   GET /api/branches/:id
 * @access  Private (Admin Only - or adjust access later)
 */
export const getBranchById = async (req, res) => {
    const { id } = req.params;
    const branchId = parseInt(id);

    if (isNaN(branchId)) {
        return res.status(400).json({ message: "Invalid branch ID." });
    }

    try {
        const sql = `
            SELECT
                b.id, b.name, b.location, b.manager_id, b.created_at, b.updated_at,
                CONCAT(u.first_name, ' ', u.last_name) AS manager_name
            FROM branches b
            LEFT JOIN users u ON b.manager_id = u.id AND u.role = 'admin'
            WHERE b.id = ?;
        `;
        const [branches] = await pool.query(sql, [branchId]);

        if (branches.length === 0) {
            return res.status(404).json({ message: "Branch not found." });
        }
        res.json(branches[0]);
    } catch (err) {
        console.error(` Database error getting branch ${branchId}:`, err);
        res.status(500).json({ message: "Error fetching branch details." });
    }
};

/**
 * @desc    Update a branch (name, location, manager)
 * @route   PUT /api/branches/:id
 * @access  Private (Admin Only)
 */
export const updateBranch = async (req, res) => {
    const { id } = req.params;
    const branchId = parseInt(id);
    const { name, location, manager_id } = req.body;

    if (isNaN(branchId)) {
        return res.status(400).json({ message: "Invalid branch ID." });
    }

    // Need at least one field to update
    if (name === undefined && location === undefined && manager_id === undefined) {
        return res.status(400).json({ message: "No update information provided (name, location, manager_id)." });
    }

    // Build SET clause dynamically
    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (location !== undefined) fieldsToUpdate.location = location;
    // Allow setting manager to null or a specific ID
    if (manager_id !== undefined) fieldsToUpdate.manager_id = manager_id === null ? null : parseInt(manager_id);

    // Pre-check if the manager_id (if provided and not null) is a valid admin user
    if (fieldsToUpdate.manager_id !== null && fieldsToUpdate.manager_id !== undefined) {
        if (isNaN(fieldsToUpdate.manager_id)) {
             return res.status(400).json({ message: "Invalid manager ID provided." });
        }
        try {
            const [managerCheck] = await pool.query(
                "SELECT role FROM users WHERE id = ?",
                [fieldsToUpdate.manager_id]
            );
            if (managerCheck.length === 0 || managerCheck[0].role !== 'admin') {
                 return res.status(400).json({ message: "Invalid manager ID provided. User is not an admin or does not exist." });
            }
        } catch (checkErr) {
             console.error(" Error checking manager ID:", checkErr);
             return res.status(500).json({ message: "Error verifying manager ID." });
        }
    }


    fieldsToUpdate.updated_at = new Date(); // Update timestamp

    try {
        const sql = "UPDATE branches SET ? WHERE id = ?";
        const [result] = await pool.query(sql, [fieldsToUpdate, branchId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Branch not found or no changes made." });
        }

        console.log(` Branch updated successfully for ID: ${branchId}`);
        // Fetch updated branch data to return
        const [updatedBranch] = await pool.query("SELECT * FROM branches WHERE id = ?", [branchId]);
        res.json(updatedBranch[0]);

    } catch (err) {
        console.error(` Database error updating branch ${branchId}:`, err);
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: "Update failed. Invalid manager ID provided." });
        }
        res.status(500).json({ message: "Error updating branch.", error: err.message });
    }
};

// Optional: Delete Branch (Consider implications before implementing - maybe deactivate?)
// export const deleteBranch = async (req, res) => { ... };
// server/controllers/fraudReportController.js
import pool from "../config/db.js";

/**
 * @desc    Create a new fraud report
 * @route   POST /api/fraud/reports
 * @access  Private (Customer Only)
 */
export const createFraudReport = async (req, res) => {
    // Get ID of customer making the report
    const customerId = req.user.id; // From authMiddleware (customer_user_id for Report table)
    // Get details from request body
    const { description, reported_account_id, related_transaction_id } = req.body;

    // Validation
    if (!description) {
        return res.status(400).json({ message: "A description of the suspected fraud is required." });
    }

    // Main try/catch for the original operation
    try {
        // --- This is the ORIGINAL code to Create Main Fraud Report ---
        const sql = `
            INSERT INTO fraud_reports
                (reporting_customer_id, description, reported_account_id, related_transaction_id, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            customerId, // This is reporting_customer_id in fraud_reports table
            description,
            reported_account_id || null,
            related_transaction_id || null,
            'reported' // Initial status
        ]);

        const newReportId = result.insertId; // Get the ID of the report just created (fraud_report_id for Report table)
        console.log(` Fraud report created by User ${customerId} with ID: ${newReportId}`);
        // --- End of ORIGINAL code block for fraud report creation ---


        // ================================================
        // --- START: Populate Report table (NEW CODE ADDED HERE) ---
        // ================================================
        // This block is added without changing the code above or below significantly
        try {
            const populateReportSql = `
                INSERT INTO Report (customer_user_id, fraud_report_id)
                VALUES (?, ?)
                 -- No ON DUPLICATE KEY needed typically
            `;
            // Use customerId (from req.user.id) and newReportId (from the result above)
            await pool.query(populateReportSql, [customerId, newReportId]);
            console.log(` Report table populated for Customer ID: ${customerId} and FraudReport ID: ${newReportId}`);
        } catch (reportErr) {
            // Log specific error for Report table insert
             console.error(` Failed to populate Report table for Customer ID ${customerId} and FraudReport ID ${newReportId}:`, reportErr);
             // Continue without failing the main operation for now
        }
        // ================================================
        // --- END: Populate Report table ---
        // ================================================


        // --- This is the ORIGINAL code to fetch and return the created report ---
        const [newReport] = await pool.query("SELECT * FROM fraud_reports WHERE id = ?", [newReportId]);
        res.status(201).json(newReport[0]);
        // --- End of ORIGINAL code block ---

    // This original error handling remains the same
    } catch (err) {
        console.error(" Database error creating fraud report:", err);
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: "Invalid related account or transaction ID provided." });
        }
        res.status(500).json({ message: "Error creating fraud report.", error: err.message });
    }
}; // End of createFraudReport function

// ==========================================================================
// === ALL OTHER FUNCTIONS in this file (getMyFraudReports, Admin functions) ===
// === remain completely unchanged from your original code.                  ===
// ==========================================================================

/**
 * @desc    Get fraud reports submitted by the logged-in customer
 * @route   GET /api/fraud/reports/my-reports
 * @access  Private (Customer Only)
 */
export const getMyFraudReports = async (req, res) => {
    const customerId = req.user.id;

    try {
        // Join to get admin name if assigned
        const sql = `
            SELECT fr.*, CONCAT(u.first_name, ' ', u.last_name) as assigned_admin_name
            FROM fraud_reports fr
            LEFT JOIN users u ON fr.assigned_admin_id = u.id
            WHERE fr.reporting_customer_id = ?
            ORDER BY fr.updated_at DESC, fr.created_at DESC
        `;
        const [reports] = await pool.query(sql, [customerId]);
        res.json(reports);
    } catch (err) {
        console.error(" Database error getting customer fraud reports:", err);
        res.status(500).json({ message: "Error fetching fraud reports." });
    }
};


// --- Admin Functions ---

/**
 * @desc    Get all fraud reports (for Admin view)
 * @route   GET /api/admin/fraud/reports
 * @access  Private (Admin Only)
 */
export const getAllFraudReportsAdmin = async (req, res) => {
    // Add filtering/pagination later
    try {
        const sql = `
            SELECT
                fr.*,
                CONCAT(reporter.first_name, ' ', reporter.last_name) as reporter_name, reporter.email as reporter_email,
                CONCAT(adm.first_name, ' ', adm.last_name) as assigned_admin_name
            FROM fraud_reports fr
            JOIN users reporter ON fr.reporting_customer_id = reporter.id
            LEFT JOIN users adm ON fr.assigned_admin_id = adm.id
            ORDER BY
                CASE fr.status
                    WHEN 'reported' THEN 1
                    WHEN 'investigating' THEN 2
                    WHEN 'action_taken' THEN 3
                    WHEN 'resolved' THEN 4
                    WHEN 'dismissed' THEN 5
                    ELSE 6
                END,
                fr.updated_at DESC, fr.created_at DESC
        `;
        const [reports] = await pool.query(sql);
        res.json(reports);
    } catch (err) {
        console.error("Database error getting all fraud reports (admin):", err);
        res.status(500).json({ message: "Error fetching fraud reports." });
    }
};

/**
 * @desc    Get a single fraud report by ID (for Admin view)
 * @route   GET /api/admin/fraud/reports/:id
 * @access  Private (Admin Only)
 */
export const getFraudReportByIdAdmin = async (req, res) => {
    const { id } = req.params;
    const reportId = parseInt(id);

    if (isNaN(reportId)) {
        return res.status(400).json({ message: "Invalid report ID." });
    }

    try {
         const sql = `
            SELECT
                fr.*,
                CONCAT(reporter.first_name, ' ', reporter.last_name) as reporter_name, reporter.email as reporter_email,
                CONCAT(adm.first_name, ' ', adm.last_name) as assigned_admin_name
            FROM fraud_reports fr
            JOIN users reporter ON fr.reporting_customer_id = reporter.id
            LEFT JOIN users adm ON fr.assigned_admin_id = adm.id
            WHERE fr.id = ?
        `;
        const [reports] = await pool.query(sql, [reportId]);

        if (reports.length === 0) {
            return res.status(404).json({ message: "Fraud report not found." });
        }
        res.json(reports[0]);
    } catch (err) {
        console.error(` Database error getting fraud report ${reportId} (admin):`, err);
        res.status(500).json({ message: "Error fetching fraud report details." });
    }
};


/**
 * @desc    Update a fraud report (status, assignment, evidence - Admin)
 * @route   PUT /api/admin/fraud/reports/:id
 * @access  Private (Admin Only)
 */
export const updateFraudReportAdmin = async (req, res) => {
    const { id } = req.params;
    const reportId = parseInt(id);
    const adminUserId = req.user.id; // Admin making the update
    // Fields allowed to be updated by admin
    const { status, assigned_admin_id, evidence_details } = req.body;

    if (isNaN(reportId)) {
        return res.status(400).json({ message: "Invalid report ID." });
    }

    // Validate inputs if necessary (e.g., check status enum)
    // ...

    // Build SET clause dynamically
    const fieldsToUpdate = {};
    if (status) fieldsToUpdate.status = status;
    if (assigned_admin_id !== undefined) fieldsToUpdate.assigned_admin_id = assigned_admin_id === null ? null : parseInt(assigned_admin_id);
    if (evidence_details) fieldsToUpdate.evidence_details = evidence_details;

    // Update timestamps based on status change
    if (status === 'resolved' || status === 'dismissed' || status === 'action_taken') {
        fieldsToUpdate.resolved_at = new Date();
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: "No update information provided (status, assigned_admin_id, evidence_details)." });
    }

    // Add updated_at timestamp
    fieldsToUpdate.updated_at = new Date();

     // Optional: Pre-check if assigned_admin_id is valid admin
     if (fieldsToUpdate.assigned_admin_id !== null && fieldsToUpdate.assigned_admin_id !== undefined) {
        if (isNaN(fieldsToUpdate.assigned_admin_id)) {
            return res.status(400).json({ message: "Invalid assigned admin ID provided." });
        }
        try {
            const [adminCheck] = await pool.query("SELECT role FROM users WHERE id = ? AND role = 'admin'", [fieldsToUpdate.assigned_admin_id]);
            if (adminCheck.length === 0) {
                return res.status(400).json({ message: "Assigned user is not a valid admin."});
            }
        } catch (checkErr) {
            console.error("Error verifying assigned admin ID for fraud report:", checkErr);
            return res.status(500).json({ message: "Error validating assigned admin." });
        }
   }

    try {
        const sql = "UPDATE fraud_reports SET ? WHERE id = ?";
        const [result] = await pool.query(sql, [fieldsToUpdate, reportId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Fraud report not found or no changes made." });
        }

        console.log(` Fraud report ${reportId} updated by Admin ${adminUserId}`);
        // Fetch updated report data to return
        const [updatedReport] = await pool.query("SELECT * FROM fraud_reports WHERE id = ?", [reportId]);
        res.json(updatedReport[0]);

    } catch (err) {
        console.error(` Database error updating fraud report ${reportId} (admin):`, err);
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: "Update failed. Invalid assigned admin ID provided." });
        }
        res.status(500).json({ message: "Error updating fraud report.", error: err.message });
    }
};
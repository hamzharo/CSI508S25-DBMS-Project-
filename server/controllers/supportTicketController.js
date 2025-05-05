// server/controllers/supportTicketController.js
import pool from "../config/db.js";

/**
 * @desc    Create a new support ticket
 * @route   POST /api/support/tickets
 * @access  Private (Customer Only)
 */
export const createSupportTicket = async (req, res) => {
    // This part is standard for getting data
    const customerId = req.user.id; // From authMiddleware (customer_user_id for Submit table)
    const { subject, description, priority, related_account_id, related_transaction_id } = req.body;

    // This validation was likely already here
    if (!subject || !description) {
        return res.status(400).json({ message: "Subject and description are required." });
    }

    // This main try/catch block handles the original operation
    try {
        // --- This is the ORIGINAL code to Create Main Support Ticket ---
        const sql = `
            INSERT INTO support_tickets
                (customer_id, subject, description, priority, related_account_id, related_transaction_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [
            customerId,
            subject,
            description,
            priority || 'medium',
            related_account_id || null,
            related_transaction_id || null,
            'open'
        ]);

        const newTicketId = result.insertId; // Get the ID of the ticket just created
        console.log(` Support ticket created by User ${customerId} with ID: ${newTicketId}`);
        // --- End of ORIGINAL code block for ticket creation ---


        // // ================================================
        // // --- START: Populate Submit table (NEW CODE ADDED HERE) ---
        // // ================================================
        // // This block is added without changing the code above or below significantly
        // try {
        //     const populateSubmitSql = `
        //         INSERT INTO Submit (customer_user_id, support_ticket_id)
        //         VALUES (?, ?)
        //     `;
        //     // Use customerId (from req.user.id) and newTicketId (from the result above)
        //     await pool.query(populateSubmitSql, [customerId, newTicketId]);
        //     console.log(` Submit table populated for Customer ID: ${customerId} and SupportTicket ID: ${newTicketId}`);
        // } catch (submitErr) {
        //      // Log specific error for Submit table insert
        //      console.error(` Failed to populate Submit table for Customer ID ${customerId} and SupportTicket ID ${newTicketId}:`, submitErr);
        //      // Continue without failing the main operation for now
        // }
        // // ================================================
        // // --- END: Populate Submit table ---
        // // ================================================


        // --- This is the ORIGINAL code to fetch and return the created ticket ---
        const [newTicket] = await pool.query("SELECT * FROM support_tickets WHERE id = ?", [newTicketId]);
        res.status(201).json(newTicket[0]);
        // --- End of ORIGINAL code block ---

    // This original error handling remains the same
    } catch (err) {
        console.error(" Database error creating support ticket:", err);
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: "Invalid related account or transaction ID provided." });
        }
        res.status(500).json({ message: "Error creating support ticket.", error: err.message });
    }
}; // End of createSupportTicket function

// ==========================================================================
// === ALL OTHER FUNCTIONS in this file (getMySupportTickets, Admin functions) ===
// === remain completely unchanged from your original code.                 ===
// ==========================================================================

/**
 * @desc    Get support tickets for the logged-in customer
 * @route   GET /api/support/tickets/my-tickets
 * @access  Private (Customer Only)
 */
export const getMySupportTickets = async (req, res) => {
    const customerId = req.user.id;

    try {
        const sql = `
            SELECT st.*, CONCAT(u.first_name, ' ', u.last_name) as assigned_admin_name
            FROM support_tickets st
            LEFT JOIN users u ON st.assigned_admin_id = u.id
            WHERE st.customer_id = ?
            ORDER BY st.updated_at DESC, st.created_at DESC
        `;
        const [tickets] = await pool.query(sql, [customerId]);
        res.json(tickets);
    } catch (err) {
        console.error(" Database error getting customer support tickets:", err);
        res.status(500).json({ message: "Error fetching support tickets." });
    }
};


// --- Admin Functions ---

/**
 * @desc    Get all support tickets (for Admin view) - WITH FILTERING
 * @route   GET /api/admin/support/tickets
 * @access  Private (Admin Only)
 */
export const getAllSupportTicketsAdmin = async (req, res) => {
    // --- Filtering Logic ---
    const { status, priority } = req.query; // Get potential filters from query string ?status=open&priority=high

    let baseSql = `
        SELECT
            st.id, st.subject, st.description, st.status, st.priority, st.created_at, st.updated_at, st.resolved_at, st.closed_at,
            CONCAT(cust.first_name, ' ', cust.last_name) as customer_name, cust.email as customer_email,
            st.assigned_admin_id, CONCAT(adm.first_name, ' ', adm.last_name) as assigned_admin_name
        FROM support_tickets st
        JOIN users cust ON st.customer_id = cust.id
        LEFT JOIN users adm ON st.assigned_admin_id = adm.id
    `; // Select specific fields

    const whereClauses = [];
    const queryParams = [];

    if (status) {
        // Basic validation for status enum (optional but good practice)
        const validStatuses = ['open', 'in_progress', 'resolved', 'closed', 'reopened'];
        if (validStatuses.includes(status.toLowerCase())) {
            whereClauses.push("st.status = ?");
            queryParams.push(status.toLowerCase());
        } else {
             console.warn(`Invalid status filter provided: ${status}`);
             // Optionally return an error or just ignore the invalid filter
        }
    }

    if (priority) {
         // Basic validation for priority enum
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
         if (validPriorities.includes(priority.toLowerCase())) {
            whereClauses.push("st.priority = ?");
            queryParams.push(priority.toLowerCase());
        } else {
             console.warn(`Invalid priority filter provided: ${priority}`);
        }
    }

    if (whereClauses.length > 0) {
        baseSql += " WHERE " + whereClauses.join(" AND ");
    }

    // --- Ordering Logic ---
    baseSql += `
        ORDER BY
            CASE st.status
                WHEN 'open' THEN 1
                WHEN 'reopened' THEN 2
                WHEN 'in_progress' THEN 3
                WHEN 'resolved' THEN 4
                WHEN 'closed' THEN 5
                ELSE 6
            END,
            CASE st.priority
                WHEN 'urgent' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
                ELSE 5
            END,
            st.updated_at DESC, st.created_at DESC
    `; // Enhanced Ordering

    try {
        console.log("Executing SQL:", pool.format(baseSql, queryParams)); // Log the final query for debugging
        const [tickets] = await pool.query(baseSql, queryParams);
        res.json(tickets);
    } catch (err) {
        console.error(" Database error getting all support tickets (admin):", err);
        res.status(500).json({ message: "Error fetching support tickets." });
    }
}; // <-- End of getAllSupportTicketsAdmin function


/**
 * @desc    Get a single support ticket by ID (for Admin view)
 * @route   GET /api/admin/support/tickets/:id
 * @access  Private (Admin Only)
 */
export const getSupportTicketByIdAdmin = async (req, res) => {
    const { id } = req.params;
    const ticketId = parseInt(id);

    if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID." });
    }

    try {
         const sql = `
            SELECT
                st.*,
                CONCAT(cust.first_name, ' ', cust.last_name) as customer_name, cust.email as customer_email,
                CONCAT(adm.first_name, ' ', adm.last_name) as assigned_admin_name
            FROM support_tickets st
            JOIN users cust ON st.customer_id = cust.id
            LEFT JOIN users adm ON st.assigned_admin_id = adm.id
            WHERE st.id = ?
        `;
        const [tickets] = await pool.query(sql, [ticketId]);

        if (tickets.length === 0) {
            return res.status(404).json({ message: "Support ticket not found." });
        }
        res.json(tickets[0]);
    } catch (err) {
        console.error(` Database error getting support ticket ${ticketId} (admin):`, err);
        res.status(500).json({ message: "Error fetching support ticket details." });
    }
};


/**
 * @desc    Update a support ticket (status, priority, assignment - Admin)
 * @route   PUT /api/admin/support/tickets/:id
 * @access  Private (Admin Only)
 */
export const updateSupportTicketAdmin = async (req, res) => {
    const { id } = req.params;
    const ticketId = parseInt(id);
    // Admin performing the update
    const adminUserId = req.user.id;
    // Fields allowed to be updated by admin
    const { status, priority, assigned_admin_id } = req.body;

    if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID." });
    }

    // Validate input values if necessary (e.g., check if status/priority are valid enum values)
    // ... validation logic ...

    // Build SET clause dynamically
    const fieldsToUpdate = {};
    if (status) fieldsToUpdate.status = status;
    if (priority) fieldsToUpdate.priority = priority;
    // Allow assigning to null or a specific admin ID
    if (assigned_admin_id !== undefined) fieldsToUpdate.assigned_admin_id = assigned_admin_id === null ? null : parseInt(assigned_admin_id);

    // Update timestamps based on status change
    if (status === 'resolved') fieldsToUpdate.resolved_at = new Date();
    if (status === 'closed') fieldsToUpdate.closed_at = new Date();

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: "No update information provided (status, priority, assigned_admin_id)." });
    }

    // Add updated_at timestamp
    fieldsToUpdate.updated_at = new Date();

    // Optional: Pre-check if assigned_admin_id is valid admin
    if (fieldsToUpdate.assigned_admin_id !== null && fieldsToUpdate.assigned_admin_id !== undefined) {
         if (isNaN(fieldsToUpdate.assigned_admin_id)) {
             return res.status(400).json({ message: "Invalid assigned admin ID provided." });
         }
         // Add check here to ensure the ID belongs to an actual admin user
         try {
             const [adminCheck] = await pool.query("SELECT role FROM users WHERE id = ? AND role = 'admin'", [fieldsToUpdate.assigned_admin_id]);
             if (adminCheck.length === 0) {
                 return res.status(400).json({ message: "Assigned user is not a valid admin."});
             }
         } catch (checkErr) {
             console.error("Error verifying assigned admin ID:", checkErr);
             return res.status(500).json({ message: "Error validating assigned admin." });
         }
    }


    try {
        const sql = "UPDATE support_tickets SET ? WHERE id = ?";
        const [result] = await pool.query(sql, [fieldsToUpdate, ticketId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Support ticket not found or no changes made." });
        }

        console.log(`Support ticket ${ticketId} updated by Admin ${adminUserId}`);
        // Fetch updated ticket data to return
        const [updatedTicket] = await pool.query("SELECT * FROM support_tickets WHERE id = ?", [ticketId]);
        res.json(updatedTicket[0]);

    } catch (err) {
        console.error(`Database error updating support ticket ${ticketId} (admin):`, err);
         if (err.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ message: "Update failed. Invalid assigned admin ID provided." });
        }
        res.status(500).json({ message: "Error updating support ticket.", error: err.message });
    }
};

/**
 * @desc    Delete a support ticket (Admin)
 * @route   DELETE /api/admin/support/tickets/:id
 * @access  Private (Admin Only)
 */
export const deleteSupportTicketAdmin = async (req, res) => {
    const { id } = req.params;
    const ticketId = parseInt(id);
    const adminUserId = req.user.id;

    if (isNaN(ticketId)) {
        return res.status(400).json({ message: "Invalid ticket ID." });
    }

    // NOTE: Because Submit table has ON DELETE CASCADE for support_ticket_id,
    // deleting the ticket here will automatically delete the corresponding row in Submit.
    // No extra delete needed for the Submit table.

    try {
        // Optional: Check if ticket exists first
        const checkSql = "SELECT id FROM support_tickets WHERE id = ?";
        const [tickets] = await pool.query(checkSql, [ticketId]);

        if (tickets.length === 0) {
            return res.status(404).json({ message: "Support ticket not found." });
        }

        // Perform delete operation
        const deleteSql = "DELETE FROM support_tickets WHERE id = ?";
        const [result] = await pool.query(deleteSql, [ticketId]);

        if (result.affectedRows === 0) {
            // Should have been caught by the check above, but safety net
            return res.status(404).json({ message: "Support ticket not found during delete attempt." });
        }

        console.log(` Support ticket ${ticketId} deleted by Admin ${adminUserId}`);
        res.status(200).json({ message: "Support ticket deleted successfully." });

    } catch (err) {
        console.error(` Database error deleting support ticket ${ticketId} (admin):`, err);
        res.status(500).json({ message: "Error deleting support ticket.", error: err.message });
    }
};
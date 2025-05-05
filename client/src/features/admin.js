// src/features/admin.js
import api from '@/utils/api';
import { toast } from 'react-hot-toast';

// --- User Management Functions ---

/**
 * Fetches all users (Admin). Optionally filters by branchId.
 * @param {string|number|null} [branchId] - Optional branch ID to filter by.
 * @returns {Promise<Array<object>>} List of users.
 */
export const adminGetAllUsers = async (branchId = null) => {
    try {
        console.log(`API Call: Fetching all users (Admin)${branchId ? ` for branch ${branchId}` : ''}...`);
        const params = branchId ? { branchId } : {};
        // Backend route: GET /api/admin/users
        const response = await api.get('/admin/users', { params });
        console.log("API Response from /admin/users:", response); // Log the raw response
        // Ensure response.data is the array
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch all users (Admin):", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to load users.';
        toast.error(message);
        return []; // Return empty array on error
    }
};

/**
 * Fetches users with 'pending_approval' status (Admin).
 * @returns {Promise<Array<object>>} List of pending users.
 */
export const adminGetPendingUsers = async () => {
    try {
        console.log("API Call: Fetching pending users (Admin)...");
        // Backend route: GET /api/admin/users/pending
        const response = await api.get('/admin/users/pending');
        console.log("API Response: Pending users fetched (Admin).", response.data);
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch pending users (Admin):", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to load pending users.';
        toast.error(message);
        return []; // Return empty array on error
    }
};

/**
 * Approves a pending user and creates their initial account (Admin).
 * @param {number} userId - The ID of the user to approve.
 * @returns {Promise<object>} Success message and potentially account details.
 */
export const adminApproveUser = async (userId) => {
    try {
        console.log(`API Call: Approving user ${userId} (Admin)...`);
        // Backend route: POST /api/admin/users/:userId/approve
        const response = await api.post(`/admin/users/${userId}/approve`);
        console.log(`API Response: User ${userId} approved (Admin).`, response.data);
        toast.success(response.data?.message || 'User approved successfully!');
        return response.data; // Return response data for potential use
    } catch (error) {
        console.error(`API Error: Failed to approve user ${userId} (Admin):`, error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to approve user.';
        toast.error(message);
        throw new Error(message); // Re-throw error so component knows it failed
    }
};

// --- Support Ticket Management Functions ---

/**
 * Fetches all support tickets for Admin view.
 * @param {object} [filters] - Optional filters like { status: 'open', priority: 'high' }
 * @returns {Promise<Array<object>>} List of support tickets.
 */
export const adminGetAllSupportTickets = async (filters = {}) => {
    try {
        console.log("API Call: Fetching all support tickets (Admin) with filters:", filters);
        // Backend route: GET /api/admin/support/tickets
        const response = await api.get('/admin/support/tickets', { params: filters });
        console.log("API Response: All support tickets fetched (Admin).", response.data);
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch support tickets (Admin):", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to load support tickets.';
        toast.error(message);
        return []; // Return empty array on error
    }
};

/**
 * Updates a specific support ticket (Admin).
 * @param {number} ticketId - The ID of the ticket to update.
 * @param {object} updateData - The data to update (e.g., { status: 'closed', assigned_admin_id: 5 }).
 * @returns {Promise<object>} The updated ticket data.
 */
export const adminUpdateSupportTicket = async (ticketId, updateData) => {
    try {
        console.log(`API Call: Updating support ticket ${ticketId} (Admin) with data:`, updateData);
        // Backend route: PUT /api/admin/support/tickets/:id
        const response = await api.put(`/admin/support/tickets/${ticketId}`, updateData);
        console.log(`API Response: Support ticket ${ticketId} updated (Admin).`, response.data);
        toast.success(response.data?.message || 'Ticket updated successfully!');
        return response.data;
    } catch (error) {
        console.error(`API Error: Failed to update ticket ${ticketId} (Admin):`, error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to update ticket.';
        toast.error(message);
        throw new Error(message); // Re-throw error
    }
};


// --- Fraud Report Management Functions ---
// Added these here as well for consistency, assuming they weren't added elsewhere

/**
 * Fetches all fraud reports for Admin view.
 * @param {object} [filters] - Optional filters.
 * @returns {Promise<Array<object>>} List of fraud reports.
 */
export const adminGetAllFraudReports = async (filters = {}) => {
    try {
        console.log("API Call: Fetching all fraud reports (Admin) with filters:", filters);
        // Backend route: GET /api/admin/fraud/reports
        const response = await api.get('/admin/fraud/reports', { params: filters });
        console.log("API Response: All fraud reports fetched (Admin).", response.data);
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch fraud reports (Admin):", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to load fraud reports.';
        toast.error(message);
        return []; // Return empty array on error
    }
};

/**
 * Updates a specific fraud report (Admin).
 * @param {number} reportId - The ID of the report to update.
 * @param {object} updateData - The data to update.
 * @returns {Promise<object>} The updated report data.
 */
export const adminUpdateFraudReport = async (reportId, updateData) => {
    try {
        console.log(`API Call: Updating fraud report ${reportId} (Admin) with data:`, updateData);
        // Backend route: PUT /api/admin/fraud/reports/:id
        const response = await api.put(`/admin/fraud/reports/${reportId}`, updateData);
        console.log(`API Response: Fraud report ${reportId} updated (Admin).`, response.data);
        toast.success(response.data?.message || 'Report updated successfully!');
        return response.data;
    } catch (error) {
        console.error(`API Error: Failed to update report ${reportId} (Admin):`, error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to update report.';
        toast.error(message);
        throw new Error(message); // Re-throw error
    }
};

export const adminGetAllBranches = async () => {
   try {
       console.log("API Call: Fetching all branches (Admin)...");
       // Check backend mounting: is it /branches or /admin/branches?
       const response = await api.get('/branches'); // Or '/admin/branches'
       console.log("API Response: All branches fetched (Admin).", response.data);
       return Array.isArray(response?.data) ? response.data : [];
   } catch (error) {
       console.error("API Error: Failed to fetch branches (Admin):", error.response?.data || error.message);
       const message = error.response?.data?.message || 'Failed to load branches.';
       toast.error(message);
       return [];
   }
};

/**
* Fetches users with the 'admin' role (for manager dropdown).
* @returns {Promise<Array<object>>} List of admin users.
*/
export const adminGetAllAdminUsers = async () => {
   try {
       console.log("API Call: Fetching admin users...");
       const response = await api.get('/admin/users', { params: { role: 'admin' } }); // Adjust if filter is different
       console.log("API Response: Admin users fetched.", response.data);
       return Array.isArray(response?.data) ? response.data : [];
   } catch (error) {
       console.error("API Error: Failed to fetch admin users:", error.response?.data || error.message);
       toast.error('Failed to load potential managers.');
       return [];
   }
};


/**
* Creates a new branch (Admin).
* @param {object} branchData - Data for the new branch { name, location?, manager_id? }.
* @returns {Promise<object>} The created branch data.
*/
// --- ENSURE THIS IS EXPORTED ---
export const adminCreateBranch = async (branchData) => {
   try {
       console.log("API Call: Creating branch (Admin) with data:", branchData);
       // Check backend mounting: is it /branches or /admin/branches?
       const response = await api.post('/branches', branchData); // Or '/admin/branches'
       console.log("API Response: Branch created (Admin).", response.data);
       toast.success('Branch created successfully!');
       return response.data;
   } catch (error) {
       console.error("API Error: Failed to create branch (Admin):", error.response?.data || error.message);
       const message = error.response?.data?.message || 'Failed to create branch.';
       toast.error(message);
       throw new Error(message);
   }
};

/**
* Updates an existing branch (Admin).
* @param {number} branchId - The ID of the branch to update.
* @param {object} updateData - Data to update { name?, location?, manager_id? }.
* @returns {Promise<object>} The updated branch data.
*/
// --- ENSURE THIS IS EXPORTED ---
export const adminUpdateBranch = async (branchId, updateData) => {
   try {
       console.log(`API Call: Updating branch ${branchId} (Admin) with data:`, updateData);
        // Check backend mounting: is it /branches/:id or /admin/branches/:id?
       const response = await api.put(`/branches/${branchId}`, updateData); // Or `/admin/branches/${branchId}`
       console.log(`API Response: Branch ${branchId} updated (Admin).`, response.data);
       toast.success(response.data?.message || 'Branch updated successfully!');
       return response.data;
   } catch (error) {
       console.error(`API Error: Failed to update branch ${branchId} (Admin):`, error.response?.data || error.message);
       const message = error.response?.data?.message || 'Failed to update branch.';
       toast.error(message);
       throw new Error(message);
   }
};

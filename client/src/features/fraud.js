// // src/features/fraud.js
// import api from '@/utils/api'; // Assuming your configured Axios instance is here

// /**
//  * Creates a new fraud report.
//  * @param {object} reportData - The report data.
//  * @param {string} reportData.description - The description of the suspected fraud.
//  * @param {number|null} [reportData.reported_account_id] - Optional ID of the account involved.
//  * @param {number|null} [reportData.related_transaction_id] - Optional ID of the transaction involved.
//  * @returns {Promise<object>} - The response data from the API (usually the created report).
//  */
// export const createFraudReport = async (reportData) => {
//     try {
//         console.log("API Call: Creating fraud report with data:", reportData);
//         // Backend route is POST /api/fraud/reports
//         const response = await api.post('/fraud/reports', reportData);
//         console.log("API Response: Fraud report created.", response.data);
//         return response.data;
//     } catch (error) {
//         console.error("API Error: Failed to create fraud report:", error.response?.data || error.message);
//         throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to submit fraud report');
//     }
// };

// /**
//  * Fetches the user's submitted fraud reports.
//  * @returns {Promise<Array<object>>} - An array of the user's reports.
//  */
// export const getMyFraudReports = async () => {
//     try {
//         console.log("API Call: Fetching user's fraud reports...");
//         // Backend route is GET /api/fraud/reports/my-reports
//         const response = await api.get('/fraud/reports/my-reports');
//         console.log("API Response: Fraud reports fetched.", response.data);
//         return Array.isArray(response.data) ? response.data : [];
//     } catch (error) {
//         console.error("API Error: Failed to fetch fraud reports:", error.response?.data || error.message);
//         throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to load existing fraud reports');
//     }
// };

// // --- ADD FRAUD REPORT MANAGEMENT FUNCTIONS ---

// /**
//  * Fetches all fraud reports for Admin view.
//  * @param {object} [filters] - Optional filters (not implemented in backend yet).
//  * @returns {Promise<Array<object>>} List of fraud reports.
//  */
// export const adminGetAllFraudReports = async (filters = {}) => {
//     try {
//         console.log("API Call: Fetching all fraud reports (Admin) with filters:", filters);
//         // Backend route: GET /api/admin/fraud/reports
//         const response = await api.get('/admin/fraud/reports', { params: filters });
//         console.log("API Response: All fraud reports fetched (Admin).", response.data);
//         return Array.isArray(response.data) ? response.data : [];
//     } catch (error) {
//         console.error("API Error: Failed to fetch fraud reports (Admin):", error.response?.data || error.message);
//         const message = error.response?.data?.message || 'Failed to load fraud reports.';
//         toast.error(message);
//         throw new Error(message);
//     }
// };

// /**
//  * Updates a specific fraud report (Admin).
//  * @param {number} reportId - The ID of the report to update.
//  * @param {object} updateData - The data to update (e.g., { status: 'investigating', evidence_details: '...' }).
//  * @returns {Promise<object>} The updated report data.
//  */
// export const adminUpdateFraudReport = async (reportId, updateData) => {
//     try {
//         console.log(`API Call: Updating fraud report ${reportId} (Admin) with data:`, updateData);
//         // Backend route: PUT /api/admin/fraud/reports/:id
//         const response = await api.put(`/admin/fraud/reports/${reportId}`, updateData);
//         console.log(`API Response: Fraud report ${reportId} updated (Admin).`, response.data);
//         toast.success(response.data?.message || 'Report updated successfully!');
//         return response.data;
//     } catch (error) {
//         console.error(`API Error: Failed to update report ${reportId} (Admin):`, error.response?.data || error.message);
//         const message = error.response?.data?.message || 'Failed to update report.';
//         toast.error(message);
//         throw new Error(message);
//     }
// };

// // --- END ADDED FUNCTIONS ---


// src/features/fraud.js
import api from '@/utils/api';
// --- ADD THIS IMPORT ---
import { toast } from 'react-hot-toast';
// --- END ADD ---

/**
 * Creates a new fraud report.
 * @param {object} reportData - The report data.
 * @param {string} reportData.description - The description of the suspected fraud.
 * @param {number|null} [reportData.reported_account_id] - Optional ID of the account involved.
 * @param {number|null} [reportData.related_transaction_id] - Optional ID of the transaction involved.
 * @returns {Promise<object>} - The response data from the API (usually the created report).
 */
export const createFraudReport = async (reportData) => {
    try {
        console.log("API Call: Creating fraud report with data:", reportData);
        const response = await api.post('/fraud/reports', reportData);
        console.log("API Response: Fraud report created.", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error: Failed to create fraud report:", error.response?.data || error.message);
        // toast.error might be nice here too if called from UI
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to submit fraud report');
    }
};

/**
 * Fetches the user's submitted fraud reports.
 * @returns {Promise<Array<object>>} - An array of the user's reports.
 */
export const getMyFraudReports = async () => {
    try {
        console.log("API Call: Fetching user's fraud reports...");
        const response = await api.get('/fraud/reports/my-reports');
        console.log("API Response: Fraud reports fetched.", response.data);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch fraud reports:", error.response?.data || error.message);
        // toast.error might be nice here too if called from UI
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to load existing fraud reports');
    }
};


/**
 * Fetches all fraud reports for Admin view.
 * @param {object} [filters] - Optional filters (not implemented in backend yet).
 * @returns {Promise<Array<object>>} List of fraud reports.
 */
export const adminGetAllFraudReports = async (filters = {}) => {
    try {
        console.log("API Call: Fetching all fraud reports (Admin) with filters:", filters);
        const response = await api.get('/admin/fraud/reports', { params: filters });
        console.log("API Response: All fraud reports fetched (Admin).", response.data);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch fraud reports (Admin):", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to load fraud reports.';
        toast.error(message); // Uses toast
        throw new Error(message);
    }
};

/**
 * Updates a specific fraud report (Admin).
 * @param {number} reportId - The ID of the report to update.
 * @param {object} updateData - The data to update (e.g., { status: 'investigating', evidence_details: '...' }).
 * @returns {Promise<object>} The updated report data.
 */
export const adminUpdateFraudReport = async (reportId, updateData) => {
    try {
        console.log(`API Call: Updating fraud report ${reportId} (Admin) with data:`, updateData);
        const response = await api.put(`/admin/fraud/reports/${reportId}`, updateData);
        console.log(`API Response: Fraud report ${reportId} updated (Admin).`, response.data);
        toast.success(response.data?.message || 'Report updated successfully!'); // Uses toast
        return response.data;
    } catch (error) {
        console.error(`API Error: Failed to update report ${reportId} (Admin):`, error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to update report.';
        toast.error(message); // Uses toast (Likely line 79)
        throw new Error(message);
    }
};
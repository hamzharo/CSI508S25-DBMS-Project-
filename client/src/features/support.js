// src/features/support.js
import api from '@/utils/api'; // Assuming your configured Axios instance is here

/**
 * Creates a new support ticket.
 * @param {object} ticketData - The ticket data.
 * @param {string} ticketData.subject - The subject of the ticket.
 * @param {string} ticketData.category - The category of the ticket (make sure backend expects this)
 * @param {string} ticketData.description - The detailed description.
 * @returns {Promise<object>} - The response data from the API (usually the created ticket).
 */
// --- Ensure 'export const' is used ---
export const createSupportTicket = async (ticketData) => {
    try {
        console.log("API Call: Creating support ticket with data:", ticketData);
        // Ensure the backend route is '/support/tickets' for POST
        const response = await api.post('/support/tickets', ticketData);
        console.log("API Response: Support ticket created.", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error: Failed to create support ticket:", error.response?.data || error.message);
        // Provide a user-friendly error message
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to submit support ticket');
    }
};

/**
 * Fetches the user's support tickets.
 * @returns {Promise<Array<object>>} - An array of the user's tickets.
 */
// --- Ensure 'export const' is used ---
export const getSupportTickets = async () => {
    try {
        console.log("API Call: Fetching user's support tickets...");
        // --- Use the correct endpoint for fetching user's tickets ---
        const response = await api.get('/support/tickets/my-tickets');
        console.log("API Response: Support tickets fetched.", response.data);
        // Ensure it always returns an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch support tickets:", error.response?.data || error.message);
        // Provide a user-friendly error message
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to load existing tickets');
    }
};

// --- No default export needed if only using named exports ---
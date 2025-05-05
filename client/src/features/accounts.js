// src/features/accounts.js
import api from '../utils/api'; // Your configured Axios instance

/**
 * Fetches the accounts for the currently logged-in user.
 * Assumes the auth token is handled by the api instance (interceptors).
 * @returns {Promise<Array<object>>} A promise that resolves to an array of account objects.
 */
export const getUserAccounts = async () => {
    try {
        console.log("API Call: Fetching user accounts...");
        const response = await api.get('/accounts'); // Make sure endpoint is correct (/api/accounts)
        console.log("API Response: User accounts fetched.", response.data);
        // Assuming the backend directly returns the array of accounts
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            // Handle cases where data might be nested, e.g., response.data.accounts
            console.warn("API Response format unexpected for accounts:", response.data);
            // Attempt to find array if nested (example)
            if(response.data && Array.isArray(response.data.accounts)) {
                 return response.data.accounts;
            }
            return []; // Return empty array if format is wrong
        }
    } catch (error) {
        console.error("API Error: Failed to fetch user accounts", error.response?.data || error.message);
        // Re-throw the error so the component can catch it and show a message
        throw error;
    }
};

// Add other account-related API functions here later (e.g., getAccountDetails)
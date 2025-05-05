// // src/features/transactions.js
// import api from '@/utils/api';
// import { toast } from 'react-hot-toast';

// /**
//  * Fetches transactions, potentially filtered.
//  * @param {object} [filters] - Optional filters like { accountId, type, dateRange }
//  * @returns {Promise<Array<object>>} List of transactions.
//  */
// export const getTransactions = async (filters = {}) => {
//     try {
//         console.log("API Call: Fetching transactions with filters:", filters);
//         const response = await api.get('/transactions', { params: filters }); // Assuming GET /api/transactions endpoint
//         console.log("API Response: Transactions fetched.", response.data);
//         return Array.isArray(response?.data) ? response.data : [];
//     } catch (error) {
//         console.error("API Error: Failed to fetch transactions:", error.response?.data || error.message);
//         const message = error.response?.data?.message || 'Failed to load transactions.';
//         toast.error(message);
//         return []; // Return empty array on error
//     }
// };


// // --- UPDATED DEPOSIT FUNCTION ---
// /**
//  * Creates a simulated deposit transaction by sending Account Number.
//  * @param {string} accountNumber - The ACCOUNT NUMBER to deposit into. <-- CHANGED
//  * @param {number} amount - The amount to deposit.
//  * @param {string} [description] - Optional description.
//  * @returns {Promise<object>} The created transaction data or success message.
//  */
// export const makeDeposit = async (accountNumber, amount, description = 'Customer deposit') => { // <-- CHANGED first parameter name
//     try {
//         console.log(`API Call: Making deposit - Account#: ${accountNumber}, Amount: ${amount}`); // <-- Updated log
//         // Backend route: POST /api/transactions/deposit
//         // Send accountNumber as expected by the backend controller
//         const response = await api.post('/transactions/deposit', {
//             accountNumber, // <-- SEND accountNumber
//             amount,
//             description
//         });
//         console.log("API Response: Deposit successful.", response.data);
//         toast.success(response.data?.message || 'Deposit successful!');
//         return response.data;
//     } catch (error) {
//         console.error("API Error: Failed to make deposit:", error.response?.data || error.message);
//         const message = error.response?.data?.message || 'Deposit failed.';
//         toast.error(message);
//         throw new Error(message); // Re-throw error for component handling
//     }
// };


// /**
//  * Initiates a fund transfer between accounts.
//  * @param {string} receiverAccountNumber - The account number to transfer funds to.
//  * @param {number} amount - The amount to transfer.
//  * @returns {Promise<object>} Success message or response data.
//  */
// export const transferFunds = async (receiverAccountNumber, amount) => {
//   try {
//       console.log(`API Call: Transferring funds - To Account#: ${receiverAccountNumber}, Amount: ${amount}`);
//       // Backend route: POST /api/transactions/transfer
//       // Backend controller expects { receiverAccountNumber, amount }
//       const response = await api.post('/transactions/transfer', {
//           receiverAccountNumber,
//           amount
//       });
//       console.log("API Response: Transfer successful.", response.data);
//       toast.success(response.data?.message || 'Transfer successful!');
//       return response.data; // Return response data
//   } catch (error) {
//       console.error("API Error: Failed to transfer funds:", error.response?.data || error.message);
//       const message = error.response?.data?.message || 'Transfer failed.';
//       toast.error(message);
//       throw new Error(message); // Re-throw error for component handling
//   }
// };
// // --- END ADDED FUNCTION ---



// src/features/transactions.js
import api from '@/utils/api'; // Assuming this is your configured Axios instance or similar
import { toast } from 'react-hot-toast';

/**
 * Fetches transactions, potentially filtered.
 * (No changes needed here based on the problem description)
 * @param {object} [filters] - Optional filters like { accountId, type, dateRange }
 * @returns {Promise<Array<object>>} List of transactions.
 */
export const getTransactions = async (filters = {}) => {
    try {
        console.log("API Call: Fetching transactions with filters:", filters);
        const response = await api.get('/transactions', { params: filters }); // Assuming GET /api/transactions endpoint
        console.log("API Response: Transactions fetched.", response.data);
        // Assuming components using this expect the array directly
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        console.error("API Error: Failed to fetch transactions:", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Failed to load transactions.';
        toast.error(message);
        return []; // Return empty array on error, as component might expect an iterable
    }
};


// --- UPDATED DEPOSIT FUNCTION (Optional but recommended for consistency) ---
/**
 * Creates a simulated deposit transaction by sending Account Number.
 * NOW RETURNS { success: boolean, message: string, ...data }
 * @param {string} accountNumber - The ACCOUNT NUMBER to deposit into.
 * @param {number} amount - The amount to deposit.
 * @param {string} [description] - Optional description.
 * @returns {Promise<{success: boolean, message: string, [key: string]: any}>} Result object.
 */
export const makeDeposit = async (accountNumber, amount, description = 'Customer deposit') => {
    try {
        console.log(`API Call: Making deposit - Account#: ${accountNumber}, Amount: ${amount}`);
        const response = await api.post('/transactions/deposit', {
            accountNumber,
            amount,
            description
        });
        console.log("API Response: Deposit successful.", response.data);
        const successMessage = response.data?.message || 'Deposit successful!';
        toast.success(successMessage);
        // Return the success structure expected by components
        return {
            success: true,
            message: successMessage,
            ...response.data // Include any other data returned (like newBalance)
        };
    } catch (error) {
        console.error("API Error: Failed to make deposit:", error.response?.data || error.message);
        const message = error.response?.data?.message || 'Deposit failed.';
        toast.error(message);
        // Return the failure structure
        return {
            success: false,
            message: message
        };
        // Removed: throw new Error(message); // Don't throw if component handles return object
    }
};


// --- *** MODIFIED transferFunds FUNCTION *** ---
/**
 * Initiates a fund transfer between accounts.
 * NOW RETURNS { success: boolean, message: string }
 * @param {string} receiverAccountNumber - The account number to transfer funds to.
 * @param {number} amount - The amount to transfer.
 * @returns {Promise<{success: boolean, message: string}>} Result object.
 */
export const transferFunds = async (receiverAccountNumber, amount) => {
  try {
      console.log(`API Call: Transferring funds - To Account#: ${receiverAccountNumber}, Amount: ${amount}`);
      const response = await api.post('/transactions/transfer', {
          receiverAccountNumber,
          amount
      });
      console.log("API Response: Transfer successful.", response.data);
      const successMessage = response.data?.message || 'Transfer successful!';
      toast.success(successMessage); // Keep toast if desired

      // *** CHANGE: Return the object structure the component expects ***
      return {
          success: true,
          message: successMessage
      };
      // Removed: return response.data;

  } catch (error) {
      console.error("API Error: Failed to transfer funds:", error.response?.data || error.message);
      const message = error.response?.data?.message || 'Transfer failed.';
      toast.error(message); // Keep toast if desired

      // *** CHANGE: Return the error structure the component expects ***
      return {
          success: false,
          message: message
      };
      // Removed: throw new Error(message); // Don't throw if component checks response.success
  }
};

// You might want to modify withdrawal in a similar way if you have it here.
// client/src/features/user.js
import api from '../utils/api'; // Import your configured instance

// Fetch User Profile
export const getUserProfile = async () => {
  try {
    const response = await api.get(`/user/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    return null;
  }
};

// Update User Profile (For Name, Email etc.)
export const updateUserProfile = async (updatedData) => {
  try {
    const response = await api.put(`/user/profile`, updatedData);
    return { success: true, message: response.data.message };
  } catch (error) {
     console.error("Error updating user profile:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Update failed" };
  }
};

// Change Password
export const changePassword = async (currentPassword, newPassword) => {
  try {
      // Assuming backend route is POST /api/user/change-password
      const response = await api.post('/user/change-password', { currentPassword, newPassword });
      return response.data; // May include a success message
  } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      // Re-throw a more specific error for the component to catch
      throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to change password');
  }
};

// Get User Preferences
export const getUserPreferences = async () => {
    try {
        // Assuming backend route is GET /api/user/preferences
        const response = await api.get('/user/preferences');
        return response.data;
    } catch (error) {
        console.error("Error fetching preferences:", error.response?.data || error.message);
        // Maybe return a default or throw
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to load preferences');
        // Or return {}; // Return empty object if fetching fails? Decide on handling.
    }
};


// --- ADD THIS FUNCTION ---
/**
 * Updates the user's notification preferences.
 * @param {object} preferences - The preferences object to save.
 * @returns {Promise<object>} - The response data from the API.
 */
export const updateUserPreferences = async (preferences) => {
    try {
        // Assuming backend route is PUT /api/user/preferences
        const response = await api.put('/user/preferences', preferences);
        return response.data; // May include updated preferences or success message
    } catch (error) {
        console.error("Error updating preferences:", error.response?.data || error.message);
        throw new Error(typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || 'Failed to save preferences');
    }
};
// --- END OF ADDED FUNCTION ---
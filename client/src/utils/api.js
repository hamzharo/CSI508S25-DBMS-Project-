// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base API URL (WITHOUT /auth)
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  INTERCEPTORS allows you to run code on requests or responses globally.
*/

// Request Interceptor: Attaches JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Log only during development to verify token is attached
      // console.log('Attaching token:', token.substring(0, 15) + '...');
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // console.log('No token found, sending request without Authorization header.');
    }
    return config; // Must return config for the request to proceed
  },
  (error) => {
    // Handle request configuration errors
    console.error("Axios request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor: Handles common responses like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx cause this function to trigger
    return response; // Return the successful response
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    const originalRequest = error.config; // Get the original request configuration

    // Specifically handle 401 errors (Unauthorized - often due to expired/invalid token)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // The _retry flag prevents infinite loops if the refresh token logic itself fails
      originalRequest._retry = true; // Mark that we've attempted a retry (or action)

      console.error("Unauthorized (401) response detected. Token may be invalid or expired.");

      // Force logout: Clear token and redirect to login page
      localStorage.removeItem('token');

      // Use window.location for a simple redirect.
      // If using react-router, you might need a more sophisticated way
      // to access history/navigation outside of components, or handle this within the context.
      if (window.location.pathname !== '/login') { // Avoid redirect loop if already on login
         console.log("Redirecting to login page.");
         window.location.href = '/login';
      }

      // Alternatively, you could try implementing token refresh logic here if you have refresh tokens

      // Return a specific error message or reject the promise
      return Promise.reject(new Error("Session expired or invalid. Please log in again."));
    }

    // For other errors, just pass them along
    return Promise.reject(error);
  }
);

// --- ADD THIS FUNCTION ---
// Function to call the backend endpoint for resending the verification email
export const sendVerificationEmail = async (email) => {
  try {
    console.log(`API: Attempting to resend verification email for ${email}`);
    // *** IMPORTANT: Replace '/auth/resend-verification' below with your actual backend endpoint path ***
    const response = await api.post('/auth/resend-verification', { email }); // Send email in the request body
    console.log('API: Resend verification email request successful', response.data);
    return response.data; // Return data (e.g., a success message) from the backend
  } catch (error) {
    // Log the detailed error from the backend if available, otherwise the general error message
    console.error('API: Failed to resend verification email:', error.response?.data?.message || error.message);
    // Re-throw the error so the calling component (EmailVerificationForm) can catch it and display a message
    throw error;
  }
};

// ... other code ...

export const registerUser = async (userData) => {
  try {
    console.log('API: Attempting registration...');
    // Ensure '/auth/register' is your correct backend endpoint
    const response = await api.post('/auth/register', userData);
    console.log('API: Registration successful', response.data);
    return response.data; // Or just return success indicator
  } catch (error) {
    console.error('API: Registration failed:', error.response?.data?.message || error.message);
    throw error; // Re-throw to be handled by the caller
  }
};
// --- END OF ADDED FUNCTION ---


export default api;
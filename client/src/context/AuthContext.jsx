// src/context/AuthContext.jsx
// import React from 'react';
// import { createContext } from 'react';
// import { useState } from 'react';
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api'; // Import the configured Axios instance

export const AuthContext = createContext(null);

export default function AuthProvider( {children} ) {
    const [user, setUser] = useState(null); // Stores { id, email, firstName, role } or null
    const [token, setToken] = useState(() => localStorage.getItem("token")); // Load initial token from localStorage
    const [loading, setLoading] = useState(true); // To track initial auth check

    // Effect to handle token changes and fetch user data on load/token update
    useEffect(() => {
        const verifyTokenAndFetchUser = async () => {
            if (token) {
                // Store token whenever it changes and is valid
                localStorage.setItem("token", token);
                // No need to manually set header here, interceptor handles it
                try {
                    console.log("AuthContext: Token found, attempting to fetch user profile...");
                    // Fetch user profile to verify token and get user details
                    const response = await api.get('/user/profile'); // Axios instance knows base URL and adds token
                    console.log("AuthContext: User profile fetched successfully.", response.data);
                    setUser(response.data); // Store fetched user data
                } catch (error) {
                    // Axios interceptor might handle 401 automatically,
                    // but we catch other errors or if interceptor fails
                    console.error("AuthContext: Failed to fetch user profile:", error.response?.data?.message || error.message);
                    localStorage.removeItem("token");
                    setToken(null); // Clear invalid token
                    setUser(null);  // Clear user state
                } finally {
                    setLoading(false);
                }
            } else {
                // No token exists, ensure local storage and state are clear
                localStorage.removeItem("token");
                setUser(null);
                setLoading(false); // Finished initial check (no user)
            }
        };

        verifyTokenAndFetchUser();
    }, [token]); // This effect depends ONLY on the token state

    // --- Login Function ---
    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            console.log("AuthContext: Attempting login...");
            const response = await api.post("/auth/login", { email, password });
            const { token: receivedToken, user: loggedInUser } = response.data;
            console.log("AuthContext: Login successful.");
            setToken(receivedToken); // Update token state -> triggers useEffect -> stores in localStorage & fetches profile again (good verification)
            setUser(loggedInUser);    // Update user state immediately for responsiveness
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error("AuthContext: Login failed", error);
            setLoading(false);
            return { success: false, message: error.response?.data?.message || "Login error" };
        }
    }, []);

    // --- Register Function ---
    // Takes the full user data object required by your backend
    const register = useCallback(async (userData) => {
        setLoading(true);
        try {
            console.log("AuthContext: Attempting registration...");
            // Use the full userData object matching your backend requirements
            await api.post("/auth/register", userData);
            console.log("AuthContext: Registration API call successful.");
            setLoading(false);
            return { success: true }; // Inform component of success
        } catch (error) {
            console.error("AuthContext: Registration failed", error);
            setLoading(false);
            return { success: false, message: error.response?.data?.message || "Registration error" };
        }
    }, []);

     // --- Verify Email Token Function ---
     // Typically called from the VerifyEmail page component
     const verifyUserEmail = useCallback(async (verificationToken) => {
        setLoading(true);
        try {
            console.log("AuthContext: Attempting email verification...");
            const response = await api.post("/auth/verify-token", { token: verificationToken });
            console.log("AuthContext: Email verification successful.");
            setLoading(false);
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error("AuthContext: Email verification failed", error);
            setLoading(false);
            return { success: false, message: error.response?.data?.message || "Email verification failed" };
        }
    }, []);


    // --- Logout Function ---
    const logout = useCallback(() => {
        console.log("AuthContext: Logging out.");
        setToken(null); // Setting token to null triggers useEffect to clear localStorage and user state
    }, []);

    // Memoize context value
    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated: !!user, // True if user object exists
        isAdmin: user?.role === 'admin', // Safely check role
        login,
        register,
      //  verifyUserEmail, // Expose email verification function
        logout,
        loading  // Let components know if initial auth check is happening
    }), [user,/* token,*/ loading, login, register, /*verifyUserEmail,*/ logout]);

    return (
        <AuthContext.Provider value={value}>
            {/* Render children only after initial loading is potentially complete, or handle loading state in consuming components */}
            {children}
        </AuthContext.Provider>
    );
}
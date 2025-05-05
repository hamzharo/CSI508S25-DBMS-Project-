
// src/pages/Home.jsx - MODIFIED

// import React, { useContext, useEffect } from 'react';
import  { useContext, useEffect } from 'react';

import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    // Optional: Show loading state while auth context initializes
    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    // If user is authenticated, redirect them from the home page
    if (isAuthenticated) {
        const targetDashboard = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
        console.log(`Home: User is authenticated (Role: ${user?.role}), redirecting to ${targetDashboard}`);
        return <Navigate to={targetDashboard} replace />;
    }

    // If user is not authenticated, show the normal public Home page content
    console.log("Home: User not authenticated, showing public content.");
    return (
        <div>
            <h1>Welcome to the Online Bank!</h1>
            <p>This is the public home page.</p>
            {/* Add links to Login/Register maybe */}
            {/* <Link to="/login">Login</Link> */}
            {/* <Link to="/register">Register</Link> */}
        </div>
    );
};

export default Home;
// client/src/pages/VerifyEmail.jsx
// import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// Optional: Import an API utility function if you have one
// import { verifyUserEmail } from '../utils/api';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Verifying your email, please wait...');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setMessage('Invalid verification link: No token provided.');
            setError(true);
            setIsLoading(false);
            return;
        }

        const verifyToken = async () => {
            setIsLoading(true);
            setError(false);
            try {
                // Construct the full API URL
                // Ensure VITE_API_BASE_URL is set in your .env file for the frontend
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/verify-email?token=${encodeURIComponent(token)}`;

                const response = await fetch(apiUrl, { method: 'GET' }); // Use GET
                const data = await response.json();

                if (!response.ok) {
                    // Use the message from the backend response if available
                    throw new Error(data.message || `Verification failed (Status: ${response.status})`);
                }

                // Success
                setMessage(data.message || 'Email successfully verified!'); // Use backend success message

            } catch (err) {
                console.error("Verification error:", err);
                setMessage(err.message || 'An error occurred during verification.');
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();

    }, [token]); // Re-run effect if token changes (though it shouldn't on this page)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                {isLoading && (
                    <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <span>{message}</span>
                    </div>
                )}
                {!isLoading && (
                    <div>
                        <p className={`text-lg ${error ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                        {!error && (
                            <p className="mt-4 text-gray-700">
                                An administrator will review your account shortly. You will be notified once it's approved.
                            </p>
                        )}
                        {error && (
                            <p className="mt-4 text-gray-700">
                                If you believe this is an error, please contact support or try requesting a new verification link if available.
                                {/* TODO: Add link/button to request new link if implemented */}
                            </p>
                        )}
                         <Link
                            to="/login" // Link back to login page
                            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                         >
                           Go to Login
                         </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
// src/layouts/UserLayout.jsx
import { Outlet } from 'react-router-dom';

// --- IMPORT YOUR LAYOUT COMPONENTS ---
// Adjust these paths if Sidebar/Header are located elsewhere (e.g., ../components/)
import Sidebar from './Sidebar'; // Assuming Sidebar.jsx is in the same /layouts folder
import Header from './Header';   // Assuming Header.jsx is in the same /layouts folder
// Remove the Navbar import if it's not needed or if Header serves that purpose
// import Navbar from '../components/Navbar';

const UserLayout = () => {
    // --- ADD THIS LOG ---
    console.log("[UserLayout] Rendering...");
    // --- END OF LOG ---

    return (
        // Main container: Positions Sidebar and Content side-by-side, fills viewport height
        <div className="flex h-screen bg-gray-100"> {/* Use h-screen for full height */}

            {/* --- Sidebar --- */}
            {/* Takes its fixed width from its own component styling */}
            <Sidebar />

            {/* --- Main Content Area (Header + Page Content) --- */}
            {/* Takes remaining width (flex-1), arranges Header and main vertically (flex-col) */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* --- Header (for the main content area) --- */}
                {/* This header is positioned ABOVE the scrollable content, within the right-side area */}
                <Header />

                {/* --- Scrollable Page Content --- */}
                {/* Grows to fill space (flex-1), enables vertical scrolling ONLY for content (overflow-y-auto) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6"> {/* Add padding */}
                    {/* The matched child route component (e.g., UserDashboard) renders here */}
                    <Outlet />
                </main>

            </div> {/* End Main Content Area */}

        </div> // End Main Layout Container
    );
};

export default UserLayout;
// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import the Toaster
// Assuming you might want a different Sidebar/Navbar for Admin later
// import AdminSidebar from '../components/admin/AdminSidebar'; // Example path
import Sidebar from './Sidebar'; // Or your specific Admin Sidebar if you create one
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
             {/* Use an Admin-specific Sidebar if available, otherwise fallback */}
             <AdminSidebar /> {/* Or <AdminSidebar /> */}

            <main className="flex-grow p-6 md:p-8">
                {/* Content of nested admin routes will render here */}
                <Outlet />
            </main>

            {/* Add the Toaster component here */}
            <Toaster
                position="top-right" // Or your preferred position
                reverseOrder={false} // Keep default order
                toastOptions={{
                    duration: 5000, // Default duration
                }}
            />
        </div>
    );
};

export default AdminLayout;
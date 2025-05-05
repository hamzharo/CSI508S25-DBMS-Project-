// src/layouts/Sidebar.jsx
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext'; // Ensure this path is correct relative to Sidebar.jsx
import Button from '@/components/ui/Button'; // Ensure this path is correct

// --- IMPORT NEEDED ICONS ---
import {
    LayoutDashboard,
    ArrowLeftRight,
    History,
    User,
    Settings,
    LogOut,
    Ticket,
    FileWarning,
    Download
} from 'lucide-react';

// --- STYLING CLASSES ---
const commonLinkClass = "flex items-center px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700";
const activeLinkClass = "bg-gray-600 font-semibold text-white";

export default function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- ADD CONSOLE LOG ---
    console.log("[Sidebar] Rendering...");
    // --- END CONSOLE LOG ---

    // --- VERIFY CONTEXT ---
    if (!user) {
         console.log("[Sidebar] No user found in context yet.");
         // Optionally return null or a loading state if user is required immediately
         // return null;
    } else {
         console.log("[Sidebar] User context:", user);
    }
    // --- END VERIFY CONTEXT ---


    const handleLogout = () => {
        if (logout) { // Check if logout function exists before calling
           logout();
           navigate('/login');
        } else {
            console.error("[Sidebar] Logout function not found in AuthContext!");
        }
    };

    // --- DEFINE CUSTOMER NAVIGATION LINKS ---
     // --- DEFINE CUSTOMER NAVIGATION LINKS ---
     const customerLinks = [
        { path: '/dashboard', label: 'Accounts', icon: LayoutDashboard },
        { path: '/transactions', label: 'Transactions', icon: History },
        { path: '/transfer', label: 'Transfer Funds', icon: ArrowLeftRight },
        { path: '/deposit', label: 'Deposit', icon: Download }, 
        { path: '/support', label: 'Support Tickets', icon: Ticket },
        { path: '/report-fraud', label: 'Report Fraud', icon: FileWarning },
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];
    // If this Sidebar is *only* for customers, you don't need adminLinks/isAdmin check here
    const links = customerLinks;

    return (
        // Sidebar container
        <aside className="w-60 min-h-screen bg-gray-800 text-gray-300 p-4 flex flex-col shadow-lg flex-shrink-0"> {/* Added flex-shrink-0 */}
            {/* User Info Area */}
             <div className="mb-8 text-center">
                 {user ? ( // Check if user exists before trying to access properties
                     <div className='mt-4 p-3 bg-gray-700 rounded-lg shadow-sm'>
                         <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-2 text-xl font-semibold">
                             {user.firstName?.charAt(0).toUpperCase() || '?'}
                         </div>
                         <p className="text-sm font-semibold text-white">
                             {user.firstName} {user.lastName}
                         </p>
                         <p className="text-xs text-gray-400">{user.email}</p>
                          <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'}`}>
                             {user.role}
                         </span>
                     </div>
                 ) : (
                    <div className='mt-4 p-3 text-center text-gray-400'>Loading user...</div> // Placeholder
                 )}
             </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-1">
                {links.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `${commonLinkClass} ${isActive ? activeLinkClass : ''}`
                        }
                    >
                        {Icon && <Icon className="mr-3 h-5 w-5" />} {/* Check if Icon exists */}
                        {label}
                    </NavLink>
                 ))}
            </nav>

            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-gray-700">
                 <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center text-gray-300 hover:bg-red-700 hover:text-white"
                    onClick={handleLogout}
                    disabled={!logout} // Disable if logout function isn't available
                 >
                     <LogOut className="mr-2 h-5 w-5" /> Logout
                 </Button>
            </div>
        </aside>
    );
}
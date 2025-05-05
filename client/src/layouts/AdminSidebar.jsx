// src/layouts/AdminSidebar.jsx
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import Button from "@/components/ui/Button"; // Correct case if needed
import {
    LayoutDashboard, Users, UserCheck, Building, Ticket, ShieldAlert, LogOut
} from 'lucide-react';

const commonLinkClass = "flex items-center px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700";
const activeLinkClass = "bg-gray-600 font-semibold text-white";

export default function AdminSidebar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    console.log("[AdminSidebar] Rendering..."); // Log rendering

    const handleLogout = () => {
        if (logout) {
            logout();
            navigate('/login');
        } else {
            console.error("[AdminSidebar] Logout function not found in context!");
        }
    };

    // --- DEFINE ADMIN NAVIGATION LINKS ---
    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/users', label: 'All Users', icon: Users },
        { path: '/admin/users/pending', label: 'Pending Users', icon: UserCheck },
        { path: '/admin/support', label: 'Support Tickets', icon: Ticket },
        { path: '/admin/fraud', label: 'Fraud Reports', icon: ShieldAlert },
        { path: '/admin/branches', label: 'Branches', icon: Building },
    ];

    return (
        <aside className="w-60 min-h-screen bg-gray-800 text-gray-300 p-4 flex flex-col shadow-lg flex-shrink-0">
             <div className="mb-8 text-center">
                {user ? (
                 <div className='mt-4 p-3 bg-gray-700 rounded-lg shadow-sm'>
                     <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto mb-2 text-xl font-semibold">
                         {user.firstName?.charAt(0).toUpperCase() || 'A'}
                     </div>
                     <p className="text-sm font-semibold text-white">{user.firstName} {user.lastName}</p>
                     <p className="text-xs text-gray-400">{user.email}</p>
                     <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-200 text-red-900`}>
                         {user.role}
                     </span>
                 </div>
                ) : (
                    <div className='mt-4 p-3 text-center text-gray-400'>Loading admin...</div>
                )}
             </div>
            <nav className="flex-grow space-y-1">
                {adminLinks.map(({ path, label, icon: Icon }) => (
                    <NavLink key={path} to={path}
                        className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}
                    >
                        {Icon && <Icon className="mr-3 h-5 w-5" />} {label}
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-gray-700">
                 <Button variant="ghost" className="w-full flex items-center justify-center text-gray-300 hover:bg-red-700 hover:text-white" onClick={handleLogout} disabled={!logout}>
                     <LogOut className="mr-2 h-5 w-5" /> Logout
                 </Button>
            </div>
        </aside>
    );
}
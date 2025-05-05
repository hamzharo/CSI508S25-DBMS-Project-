// src/components/layout/Header.jsx
import { Link } from 'react-router-dom';
import { Bell, UserCircle } from 'lucide-react'; // Example icons
import Button from '@/components/ui/Button'; // Assuming you use shadcn Button

export default function Header() {
    // Placeholder - Replace with actual logo path or component
    const logoUrl = '/path/to/your/logo.png'; // CHANGE THIS

    return (
        <header className="bg-blue-700 text-white shadow-md sticky top-0 z-10"> {/* Adjust color e.g., bg-blue-800 */}
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left Side: Logo and Title */}
                <div className="flex items-center space-x-4">
                    {/* Placeholder for Logo */}
                    <Link to="/dashboard" className="flex items-center">
                       {/* If using an img tag: */}
                       {/* <img src={logoUrl} alt="Bank Logo" className="h-8 w-auto mr-2" /> */}
                       {/* If using text/icon placeholder: */}
                       <div className="h-8 w-8 bg-yellow-400 rounded-full mr-2"></div> {/* Placeholder circle */}
                        <span className="text-xl font-semibold">Online Banking</span>
                    </Link>
                </div>

                {/* Right Side: Icons */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600">
                        <UserCircle className="h-6 w-6" /> {/* Or User icon */}
                        <span className="sr-only">User Menu</span>
                        {/* Dropdown menu functionality to be added later */}
                    </Button>
                     {/* You might want a simple user initial circle like in sidebar */}
                     {/* <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold cursor-pointer">
                        J {/* Placeholder for user initial * /}
                     </div> */}
                </div>
            </div>
        </header>
    );
}


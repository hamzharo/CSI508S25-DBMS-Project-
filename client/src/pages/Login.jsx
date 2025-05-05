// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// --- Import Shadcn UI and Icons using requested format ---
// WARNING: This is non-standard for default Shadcn UI.
// Ensure Button.jsx/Input.jsx use 'export default' and Label.jsx exists with named export.
import Button from "@/components/ui/Button"; // Default import, Capital path
import Input from "@/components/ui/Input";   // Default import, Capital path
import { Label } from "@/components/ui/Label";   // Named import, Capital path
// --- End requested format ---
import { Checkbox } from "@/components/ui/checkbox"; // Standard import for Checkbox
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Standard import for Alert
import { Loader2, Terminal } from "lucide-react"; // Icons

// Updated Company Logo placeholder
const CompanyLogo = () => (
    // --- UPDATED TEXT and SIZE ---
    <div className="text-white font-bold text-3xl lg:text-4xl tracking-wider mb-8 leading-tight"> {/* Increased size, added line-height */}
        ONLINE BANK<br/>MANAGEMENT SYSTEM {/* Added line break */}
        {/* Or use an actual logo image: <img src="/logo.png" alt="Online Bank Management System" className="h-10 w-auto" /> */}
    </div>
    // --- END UPDATE ---
);


export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading: authLoading } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        console.log("Remember me:", rememberMe);
        const result = await login(formData.email, formData.password);

        if (result.success) {
            const from = location.state?.from?.pathname || '/dashboard';
            console.log(`Login success, navigating to: ${from}`);
            navigate(from, { replace: true });
        } else {
            setError(result.message || "Login failed. Please check credentials.");
        }
    };

    return (
        // --- Main container: Split screen ---
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen font-sans">

            {/* --- Left Column (Blue Gradient Info) --- */}
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-cyan-400 to-blue-600 p-8 lg:p-16 text-white">
                {/* Top: Logo */}
                <div className="flex-shrink-0">
                    <CompanyLogo /> {/* Renders the updated text/size */}
                </div>
                {/* Middle: Welcome Text */}
                <div className="flex-grow flex items-center">
                     <div className="w-full max-w-md">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome to SecureBank</h1> {/* Example Name */}
                        <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
                            Manage your accounts securely, transfer funds with ease, and access your financial overview anytime, anywhere.
                        </p>
                    </div>
                </div>

                
                {/* Bottom: Footer Text */}
                <div className="flex-shrink-0">
                    <p className="text-sm text-blue-200">Your trusted partner in digital banking.</p>
                </div>
            </div>
            {/* --- End Left Column --- */}


            {/* --- Right Column (Login Form) --- */}
            <div className="flex items-center justify-center bg-white p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-sm space-y-8">
                    {/* Login Header */}
                    <p>
                            <Link to="/" className="text-gray-500 hover:text-blue-500 hover:underline">
                                ← Back to Home
                            </Link>
                         </p>
                    <div>
                        <h2 className="text-3xl font-bold text-blue-600 mb-1">Login</h2>
                        <p className="text-sm text-gray-500">Welcome! Login to get amazing discounts and offers only for you.</p>
                    </div>
                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && ( <Alert variant="destructive">...</Alert> )}
                        {/* Email/User Name Input */}
                        <div>
                             <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">User Name</Label>
                             <Input id="email" type="email" autoComplete="username" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                        </div>
                        {/* Password Input */}
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
                            <Input id="password" type="password" autoComplete="current-password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                        </div>
                        {/* Remember Me --- REMOVED Forgot Password Link --- */}
                        <div className="flex items-center justify-start text-sm"> {/* Changed justify-between to justify-start */}
                            <div className="flex items-center space-x-2">
                                 <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={setRememberMe} className="border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"/>
                                <Label htmlFor="rememberMe" className="font-medium text-gray-600 cursor-pointer select-none">Remember me</Label>
                            </div>
                            {/* --- Removed Forgot Password Link ---
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                Forgot your password?
                            </Link>
                            */}
                        </div>
                         {/* --- END REMOVAL --- */}
                        {/* Submit Button */}
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white py-2.5 px-6 text-sm font-semibold tracking-wide rounded-md shadow-sm transition duration-150 ease-in-out uppercase" disabled={authLoading}>
                            {authLoading ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging In...</> ) : ( "Login" )}
                        </Button>
                    </form>
                    {/* Footer Link */}
                    <div className="text-center text-sm text-gray-600 pt-6">
                        New User?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">Signup</Link>
                    </div>
                </div>
                
                    </div>

            </div>

        
    );
}
// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button'; // Using your specific import style
// Import required icons
import {
    Banknote, ShieldCheck, Smartphone, Mail, Phone, MapPin,
    LayoutDashboard, History, ArrowLeftRight, Download, Ticket, FileWarning, User, Settings as SettingsIcon // Renamed Settings icon import
} from 'lucide-react';

// Placeholder Logo - REPLACE WITH YOUR ACTUAL LOGO
const CompanyLogo = ({ className = "text-gray-800" }) => (
    <div className={`font-bold text-xl tracking-wider ${className}`}>
        ONLINE BANK MANAGEMENT SYSTEM
    </div>
);

// Placeholder Illustration - REPLACE WITH YOUR ACTUAL IMAGE/SVG
const HeroIllustration = () => (
     <div className="w-full max-w-md p-4 mx-auto">
        {/* Example: <img src="/img/banking-hero.svg" alt="Online Banking Illustration" className="w-full h-auto"/> */}
         <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center">
             <Banknote className="w-24 h-24 text-blue-600 opacity-80" />
         </div>
    </div>
);

export default function HomePage() {

    // --- Helper function for smooth scrolling ---
    const scrollToSection = (event, sectionId) => {
        event.preventDefault(); // Prevent the default anchor link behavior (jumping)
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
            {/* --- Header --- */}
            <header className="sticky top-0 z-50 bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/">
                        <CompanyLogo />
                    </Link>
                    <nav className="hidden md:flex space-x-6 items-center">
                         {/* --- UPDATED: Use <a> tags and onClick for smooth scroll --- */}
                         <a
                            href="#features"
                            onClick={(e) => scrollToSection(e, 'features')}
                            className="text-gray-600 hover:text-blue-600 cursor-pointer"
                         >
                            Features
                         </a>
                         <a
                            href="#about"
                            onClick={(e) => scrollToSection(e, 'about')}
                            className="text-gray-600 hover:text-blue-600 cursor-pointer"
                         >
                            About Us
                         </a>
                         <a
                            href="#contact"
                            onClick={(e) => scrollToSection(e, 'contact')}
                            className="text-gray-600 hover:text-blue-600 cursor-pointer"
                         >
                            Contact
                         </a>
                         {/* --- END OF UPDATES --- */}

                         {/* Keep Login/Register as React Router Links */}
                         <Button variant="outline" size="sm" asChild>
                            <Link to="/login">Login</Link>
                         </Button>
                         <Button size="sm" asChild>
                             <Link to="/register">Register</Link>
                         </Button>
                    </nav>
                     {/* --- Optional: Add basic mobile navigation (Example) --- */}
                     {/* You might need a state to toggle this */}
                     {/* <div className="md:hidden"> ... Mobile Menu Button ... </div> */}
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="flex-grow">
                {/* --- Hero Section --- */}
                <section className="bg-gradient-to-r from-cyan-50 to-blue-100 py-20 lg:py-32">
                    {/* ... Existing Hero Section Code ... */}
                    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                         <div className="text-center md:text-left">
                             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">Banking Made <span className="text-blue-600">Simple & Secure</span>.</h1>
                             <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">Take control of your finances with our intuitive online platform. Manage accounts, pay bills, transfer funds, and more – all from one place.</p>
                             <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                                 <Button size="lg" asChild><Link to="/register">Get Started</Link></Button>
                                 <Button size="lg" variant="secondary" asChild><Link to="/login">Member Login</Link></Button>
                             </div>
                         </div>
                         <div className="hidden md:block"><HeroIllustration /></div>
                     </div>
                </section>

                {/* --- Features Section (Ensure id="features") --- */}
                <section id="features" className="py-16 lg:py-24 bg-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">🌟 Features</h2>
                        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Explore the tools designed to simplify your banking experience.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Feature 1: Account Overview */}
                            <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <LayoutDashboard className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Account Overview</h3>
                                <p className="text-gray-600 text-sm">Easily view and manage all your bank accounts in one secure dashboard.</p>
                            </div>
                            {/* Feature 2: Transactions */}
                             <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <History className="h-10 w-10 text-teal-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Transactions</h3>
                                <p className="text-gray-600 text-sm">Access your full transaction history with advanced filtering and sorting options.</p>
                            </div>
                            {/* Feature 3: Transfer Funds */}
                             <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <ArrowLeftRight className="h-10 w-10 text-indigo-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Transfer Funds</h3>
                                <p className="text-gray-600 text-sm">Send money between your accounts or to other users with quick and secure fund transfers.</p>
                            </div>
                            {/* Feature 4: Deposit */}
                            <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <Download className="h-10 w-10 text-green-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Deposit</h3>
                                <p className="text-gray-600 text-sm">Add funds to your account through multiple supported deposit methods.</p>
                            </div>
                             {/* Feature 5: Support Tickets */}
                             <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <Ticket className="h-10 w-10 text-orange-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Support Tickets</h3>
                                <p className="text-gray-600 text-sm">Need help? Submit support tickets directly through the platform and track their resolution.</p>
                            </div>
                              {/* Feature 6: Report Fraud */}
                             <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <FileWarning className="h-10 w-10 text-red-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Report Fraud</h3>
                                <p className="text-gray-600 text-sm">Immediately report suspicious activity or unauthorized transactions to keep your account safe.</p>
                            </div>
                             {/* Feature 7: Profile Management */}
                             <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <User className="h-10 w-10 text-purple-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Profile Management</h3>
                                <p className="text-gray-600 text-sm">Manage your personal details, contact info, and account preferences.</p>
                            </div>
                             {/* Feature 8: Settings */}
                             <div className="p-6 border rounded-lg shadow-sm transition-shadow">
                                <SettingsIcon className="h-10 w-10 text-gray-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold mb-2">Settings</h3>
                                <p className="text-gray-600 text-sm">Customize your account settings, enable security features, and manage notifications.</p>
                            </div>
                        </div>
                    </div>
                </section>

                 {/* --- About Us Section (Ensure id="about") --- */}
                <section id="about" className="py-16 lg:py-24 bg-gray-50">
                    <div className="container mx-auto px-4 text-center">
                         <h2 className="text-3xl font-bold mb-4 text-gray-800">📘 About Us</h2>
                         <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
                             Welcome to SecureNet Bank, a modern online banking platform created to empower users with a secure, flexible, and seamless banking experience.
                         </p>
                          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
                             We strive to provide banking tools that are not only easy to use but also meet the highest standards of security and reliability. Whether you're checking your balance, transferring money, or reporting a concern — SecureNet Bank puts you in control.
                         </p>

                         <div className="max-w-3xl mx-auto text-left md:text-center space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-blue-700">Our Mission:</h3>
                                <p className="text-gray-700">To offer a complete digital banking solution that's safe, user-friendly, and accessible to everyone.</p>
                            </div>
                             <div>
                                <h3 className="text-xl font-semibold mb-3 text-blue-700">Our Values:</h3>
                                <ul className="list-none space-y-2 text-center md:text-left"> {/* Adjusted alignment */}
                                     <li className="flex items-center justify-center md:justify-start"><ShieldCheck className="h-5 w-5 text-green-600 mr-2"/>Security First</li>
                                     <li className="flex items-center justify-center md:justify-start"><Banknote className="h-5 w-5 text-blue-600 mr-2"/>Transparency Always</li>
                                     <li className="flex items-center justify-center md:justify-start"><Smartphone className="h-5 w-5 text-purple-600 mr-2"/>Customer-Centered Innovation</li>
                                 </ul>
                             </div>
                         </div>
                    </div>
                </section>

                 {/* --- Contact Section (Ensure id="contact") --- */}
                <section id="contact" className="py-16 lg:py-24 bg-white">
                    <div className="container mx-auto px-4 text-center">
                         <h2 className="text-3xl font-bold mb-4 text-gray-800">📞 Contact Us</h2>
                         <p className="text-gray-600 mb-10">Have questions? Our support team is ready to help.</p>
                         <div className="max-w-4xl mx-auto space-y-8">
                            <p className="font-semibold">SecureNet Bank – Customer Service</p>
                             <div className="grid md:grid-cols-3 gap-8">
                                 <div className="flex items-center justify-center md:justify-start space-x-3">
                                     <Phone className="h-6 w-6 text-blue-600 flex-shrink-0"/>
                                     <div>
                                         <h4 className="font-semibold text-left">Phone</h4>
                                         <a href="tel:+18884567890" className="text-blue-600 hover:underline">+1 (888) 456-7890</a>
                                     </div>
                                 </div>
                                 <div className="flex items-center justify-center md:justify-start space-x-3">
                                     <Mail className="h-6 w-6 text-blue-600 flex-shrink-0"/>
                                      <div>
                                         <h4 className="font-semibold text-left">Email</h4>
                                         <a href="mailto:contact@securenetbank.com" className="text-blue-600 hover:underline">contact@securenetbank.com</a>
                                     </div>
                                 </div>
                                 <div className="flex items-center justify-center md:justify-start space-x-3">
                                      <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0"/>
                                      <div>
                                         <h4 className="font-semibold text-left">Address</h4>
                                         <p className="text-gray-600 text-left">456 Digital Way, Cloud City, NY 11223</p>
                                     </div>
                                 </div>
                             </div>
                             <div className="pt-6 border-t mt-8 text-gray-600">
                                <p className="mb-2"><span className="font-semibold">Live Chat:</span> Available in your dashboard during business hours</p>
                                <p><span className="font-semibold">Support Hours:</span> Monday to Friday: 9 AM – 5 PM (EST)</p>
                             </div>
                              <div className="mt-8">
                                 <p className="text-gray-500">Follow us: <span className="text-blue-600">Facebook | Twitter | Instagram</span></p> {/* Replace with actual links */}
                             </div>
                         </div>
                    </div>
                </section>

            </main>

            {/* --- Footer --- */}
             <footer className="bg-gray-800 text-gray-400 p-8 text-center text-sm">
                <div className="container mx-auto">
                     <p>© {new Date().getFullYear()} ONLINE BANK MANAGEMENT SYSTEM. All rights reserved.</p>
                     <div className="mt-2 space-x-4">
                        {/* These should likely remain React Router Links if they go to separate pages */}
                        <Link to="/terms" className="hover:underline hover:text-white">Terms of Service</Link>
                        <Link to="/privacy" className="hover:underline hover:text-white">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
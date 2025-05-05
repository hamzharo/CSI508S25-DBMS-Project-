// src/App.jsx
import AuthProvider from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";

// --- Layouts ---
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// --- Components ---
import ProtectedRoute from "./components/ProtectedRoute";

// --- Public Pages ---
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Terms from "./pages/Terms";

// --- Customer Pages ---
import UserDashboard from "./pages/UserDashboard";
import TransactionHistory from "./pages/Transactions";
import TransferFunds from "./pages/TransferFunds";
import SupportTickets from "./pages/SupportTickets";
import ReportFraud from "./pages/ReportFraud";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import HomePage from "./pages/HomePage";

// --- Admin Pages ---
import AdminDashboard from "./pages/AdminDashboard"; 
import AdminUserList from "./pages/admin/AdminUserList";
import AdminPendingUserList from "./pages/admin/AdminPendingUserList";
import AdminSupportTicketList from "./pages/admin/AdminSupportTicketList"; // Placeholder component
import AdminBranchManagement from "./pages/admin/AdminBranchManagement";   // Placeholder component
import AdminFraudReportList from "./pages/admin/AdminFraudReportList"; // Placeholder component
import DepositPage from "./pages/DepositPage";

// import NotFound from "./pages/NotFound"; // Optional

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />

                {/* Customer Routes */}
                <Route element={<ProtectedRoute requiredRole="customer"><UserLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/transactions" element={<TransactionHistory />} />
                    <Route path="/transfer" element={<TransferFunds />} />
                    <Route path="/support" element={<SupportTickets />} />
                    <Route path="/report-fraud" element={<ReportFraud />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/deposit" element={<DepositPage />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>} >
                    {/* Ensure AdminDashboard is directly inside the protected route if it's the main landing page */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    {/* Specific Admin Management Pages */}
                    <Route path="/admin/users" element={<AdminUserList />} />
                    <Route path="/admin/users/pending" element={<AdminPendingUserList />} />
                    <Route path="/admin/support" element={<AdminSupportTicketList />} />
                    <Route path="/admin/branches" element={<AdminBranchManagement />} />
                    <Route path="/admin/fraud" element={<AdminFraudReportList />} />

                    {/* Add routes for specific edit/view pages if needed, e.g., /admin/users/edit/:userId */}
                </Route>

                {/* Optional: Not Found Route */}
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </AuthProvider>
    );
}

export default App;
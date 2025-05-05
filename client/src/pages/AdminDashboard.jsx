// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming ShadCN UI Card
import Button from '@/components/ui/Button'; // Assuming your custom Button or ShadCN Button
import { Users, UserCheck, Building, Ticket, ShieldAlert, Loader2, AlertTriangle } from 'lucide-react';
import api from '../utils/api'; // Your configured Axios instance
import { toast } from 'react-hot-toast'; // Optional: for error notifications


const AdminDashboard = () => {
    const [summaryData, setSummaryData] = useState({
        pendingApprovals: 0,
        totalUsers: 0,
        openSupportTickets: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
<Headers />

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            setError(null);
            console.log("AdminDashboard: Fetching summary..."); // Log start
            try {
                const response = await api.get('/admin/summary');
                console.log("AdminDashboard: Summary data received:", response.data); // Log response
                setSummaryData(response.data);
            } catch (err) {
                console.error("AdminDashboard: Error fetching admin summary:", err); // Log error
                const errorMessage = err.response?.data?.message || "Failed to load dashboard data. Please ensure the summary endpoint exists and the server is running.";
                setError(errorMessage);
                toast.error(errorMessage); // Show toast notification
                // Set defaults or 'N/A' on error
                setSummaryData({ pendingApprovals: 'N/A', totalUsers: 'N/A', openSupportTickets: 'N/A' });
            } finally {
                setLoading(false);
                console.log("AdminDashboard: Fetching summary finished."); // Log end
            }
        };

        fetchSummary();
    }, []); // Runs once on mount

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center p-6 bg-white rounded-lg shadow">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-lg text-gray-600">Loading Dashboard Data...</span>
                </div>
            )}

             {/* Error State */}
            {error && !loading && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow" role="alert">
                    <div className="flex items-center">
                         <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
                        <div>
                            <p className="font-bold">Error Loading Dashboard</p>
                            <p>{error}</p>
                        </div>
                    </div>
                 </div>
            )}

            {/* Content - Only show if not loading and no initial error */}
            {!loading && !error && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
                                <UserCheck className="h-5 w-5 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-orange-600">{summaryData.pendingApprovals}</div>
                                <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1 text-blue-600 hover:text-blue-800" asChild>
                                    <Link to="/admin/users/pending">View Pending</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                                <Users className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600">{summaryData.totalUsers}</div>
                                <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1 text-blue-600 hover:text-blue-800" asChild>
                                    <Link to="/admin/users">Manage Users</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Open Support Tickets</CardTitle>
                                <Ticket className="h-5 w-5 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-indigo-600">{summaryData.openSupportTickets}</div>
                                <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1 text-blue-600 hover:text-blue-800" asChild>
                                    <Link to="/admin/support">View Tickets</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Action Links/Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">User Management</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start text-base py-3" asChild>
                                    <Link to="/admin/users"><Users className="mr-3 h-5 w-5" />View All Users</Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-base py-3" asChild>
                                    <Link to="/admin/users/pending"><UserCheck className="mr-3 h-5 w-5" />Approve Pending Users</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">System Management</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start text-base py-3" asChild>
                                    <Link to="/admin/branches"><Building className="mr-3 h-5 w-5" />Manage Branches</Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-base py-3" asChild>
                                    <Link to="/admin/support"><Ticket className="mr-3 h-5 w-5" />Manage Support Tickets</Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-base py-3" asChild>
                                    <Link to="/admin/fraud"><ShieldAlert className="mr-3 h-5 w-5" />Manage Fraud Reports</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
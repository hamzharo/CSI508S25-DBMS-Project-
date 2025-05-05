// src/pages/admin/AdminPendingUserList.jsx
import { useState, useEffect } from 'react';
import { adminGetPendingUsers, adminApproveUser } from '@/features/admin'; // API functions

// Shadcn UI imports
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import  Button  from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Terminal, CheckCircle, UserCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge"; // For status/verified badges

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return dateString; }
};

export default function AdminPendingUserList() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvingUserId, setApprovingUserId] = useState(null); // Track which user is being approved

    // Fetch pending users function
    const fetchPending = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminGetPendingUsers();
            setPendingUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchPending();
    }, []);

    // Handle user approval
    const handleApprove = async (userId) => {
        setApprovingUserId(userId); // Set loading state for this specific user
        setError(null); // Clear previous errors
        try {
            await adminApproveUser(userId);
            // Refresh the list after successful approval
            fetchPending(); // Re-fetches the list, approved user will be gone
        } catch (err) {
            setError(`Failed to approve user ${userId}: ${err.message}`);
            // Error toast is handled in the API function, but set local error too
        } finally {
            setApprovingUserId(null); // Clear loading state for this user
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-6 h-6" />
                    Pending User Approvals
                </CardTitle>
                <CardDescription>Review and approve newly registered users.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                )}
                {error && !isLoading && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error Loading Pending Users</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {!isLoading && !error && pendingUsers.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No users are currently pending approval.</p>
                )}
                {!isLoading && !error && pendingUsers.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead>Email Verified</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>
                                    <TableCell>
                                        {user.is_email_verified ? (
                                            <Badge variant="success" className="bg-green-100 text-green-800">Verified</Badge>
                                        ) : (
                                            <Badge variant="destructive" className="bg-red-100 text-red-800">Not Verified</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="default" // Or "outline" or "secondary"
                                            size="sm"
                                            onClick={() => handleApprove(user.id)}
                                            disabled={approvingUserId === user.id} // Disable button while processing this user
                                        >
                                            {approvingUserId === user.id ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                            )}
                                            Approve
                                        </Button>
                                        {/* Add Reject button later */}
                                        {/* <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleReject(user.id)}>Reject</Button> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
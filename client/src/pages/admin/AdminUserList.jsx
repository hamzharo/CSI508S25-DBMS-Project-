// // src/pages/admin/AdminUserList.jsx
// import { useState, useEffect } from 'react';
// import { adminGetAllUsers } from '@/features/admin'; // API function

// // Shadcn UI imports
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// // Import Button if needed for actions later
// // import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Terminal, Users, UserCog } from 'lucide-react'; // Icons
// import { Badge } from "@/components/ui/badge"; // For status/role badges

// // Helper to format date
// const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//         return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
//     } catch { return dateString; }
// };

// export default function AdminUserList() {
//     const [users, setUsers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
    

//     // Fetch users function
//     const fetchUsers = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             // Fetches all non-admin users by default based on controller logic
//             const data = await adminGetAllUsers();
//             // setUsers(data);
//             setUsers(Array.isArray(data) ? data : []);
//         } catch (err) {
//             setError(err.message);
//             setUsers([]); 
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Fetch on mount
//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Users className="w-6 h-6" />
//                     All Users
//                 </CardTitle>
//                 <CardDescription>View and manage all registered users.</CardDescription>
//                 {/* Add Filtering options here later */}
//             </CardHeader>
//             <CardContent>
//                 {isLoading && (
//                     <div className="space-y-2">
//                         {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
//                     </div>
//                 )}
//                 {error && !isLoading && (
//                     <Alert variant="destructive">
//                         <Terminal className="h-4 w-4" />
//                         <AlertTitle>Error Loading Users</AlertTitle>
//                         <AlertDescription>{error}</AlertDescription>
//                     </Alert>
//                 )}
//                 {!isLoading && !error && users.length === 0 && (
//                     <p className="text-center text-gray-500 py-4">No users found.</p>
//                 )}
//                 {!isLoading && !error && users.length > 0 && (
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>ID</TableHead>
//                                 <TableHead>Name</TableHead>
//                                 <TableHead>Email</TableHead>
//                                 <TableHead>Role</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead>Registered</TableHead>
//                                 {/* Add other columns like Branch */}
//                                 {/* <TableHead>Branch</TableHead> */}
//                                 {/* <TableHead className="text-right">Actions</TableHead> */}
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {users.map((user) => (
//                                 <TableRow key={user.id}>
//                                     <TableCell>{user.id}</TableCell>
//                                     <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
//                                     <TableCell>{user.email}</TableCell>
//                                     <TableCell>
//                                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
//                                              {user.role}
//                                          </Badge>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge variant={user.status === 'active' ? 'success' : (user.status === 'pending_approval' ? 'warning' : 'outline')}>
//                                             {user.status?.replace('_', ' ') || 'Unknown'}
//                                          </Badge>
//                                     </TableCell>
//                                     <TableCell>{formatDate(user.created_at)}</TableCell>
//                                     {/* <TableCell>{user.branch_name || 'Unassigned'}</TableCell> */}
//                                     {/* <TableCell className="text-right"> */}
//                                         {/* Add View/Edit/Block Buttons later */}
//                                         {/* <Button variant="ghost" size="icon"><UserCog className="h-4 w-4" /></Button> */}
//                                     {/* </TableCell> */}
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }


// src/pages/admin/AdminUserList.jsx
import { useState, useEffect } from 'react';
import { adminGetAllUsers } from "@/features/admin"; // API function

// Shadcn UI imports (ensure table, badge are added via CLI)
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Terminal, Users } from 'lucide-react'; // Icons
import { Badge } from "@/components/ui/badge";

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return dateString; }
};

export default function AdminUserList() {
    const [users, setUsers] = useState([]); // Initialize as empty array
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users function
    const fetchUsers = async () => {
        // --- LOGGING ---
        console.log("[AdminUserList] useEffect triggered. Starting fetchUsers...");
        setIsLoading(true);
        setError(null);
        try {
            // --- LOGGING ---
            console.log("[AdminUserList] Calling adminGetAllUsers API function...");
            const data = await adminGetAllUsers(); // Call the API function from admin.js
            // --- LOGGING ---
            console.log("[AdminUserList] Data received from adminGetAllUsers API:", data);

            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                // --- LOGGING ---
                console.log(`[AdminUserList] Received ${data.length} users. Setting state.`);
                setUsers(data);
            } else {
                // --- LOGGING ---
                console.warn("[AdminUserList] Received non-array data, setting users to empty array. Data type:", typeof data, "Data:", data);
                setUsers([]);
                setError("Received unexpected data format for users."); // Set an error message
            }
        } catch (err) {
            // --- LOGGING ---
            console.error("[AdminUserList] Error caught in fetchUsers:", err);
            setError(err.message || "Failed to load users."); // Use error message from API function
            setUsers([]); // Set to empty array on catch
        } finally {
             // --- LOGGING ---
            console.log("[AdminUserList] fetchUsers finished. Setting loading to false.");
            setIsLoading(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs only once

    // --- LOGGING ---
    console.log("[AdminUserList] Rendering component. isLoading:", isLoading, "error:", error, "users array length:", users?.length);

    return (
        <Card>
             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                     <Users className="w-6 h-6" />
                     All Users
                 </CardTitle>
                 <CardDescription>View and manage all registered users.</CardDescription>
             </CardHeader>
             <CardContent>
                 {isLoading && (
                     <div className="space-y-2">
                         {/* Use skeleton for loading state */}
                         {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                     </div>
                 )}
                 {!isLoading && error && ( // Display error only when not loading
                     <Alert variant="destructive">
                         <Terminal className="h-4 w-4" />
                         <AlertTitle>Error Loading Users</AlertTitle>
                         <AlertDescription>{error}</AlertDescription>
                     </Alert>
                 )}
                 {/* Display "No users found" only if NOT loading, NO error, and users array IS empty */}
                 {!isLoading && !error && users.length === 0 && (
                     <p className="text-center text-gray-500 py-4">No users found.</p>
                 )}
                 {/* Display table only if NOT loading, NO error, and users array has items */}
                 {!isLoading && !error && users.length > 0 && (
                     <Table>
                         <TableHeader>
                             <TableRow>
                                 <TableHead>ID</TableHead>
                                 <TableHead>Name</TableHead>
                                 <TableHead>Email</TableHead>
                                 <TableHead>Role</TableHead>
                                 <TableHead>Status</TableHead>
                                 <TableHead>Registered</TableHead>
                                 {/* Add Branch if needed */}
                                 {/* <TableHead>Branch</TableHead> */}
                             </TableRow>
                         </TableHeader>
                         <TableBody>
                             {users.map((user) => (
                                 <TableRow key={user.id}>
                                     <TableCell>{user.id}</TableCell>
                                     <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                                     <TableCell>{user.email}</TableCell>
                                     <TableCell>
                                          <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                              {user.role}
                                          </Badge>
                                     </TableCell>
                                     <TableCell>
                                         <Badge variant={user.status === 'active' ? 'success' : (user.status === 'pending_approval' ? 'warning' : 'outline')}>
                                             {user.status?.replace('_', ' ') || 'Unknown'}
                                          </Badge>
                                     </TableCell>
                                     <TableCell>{formatDate(user.created_at)}</TableCell>
                                     {/* <TableCell>{user.branch_name || 'Unassigned'}</TableCell> */}
                                 </TableRow>
                             ))}
                         </TableBody>
                     </Table>
                 )}
             </CardContent>
         </Card>
    );
}
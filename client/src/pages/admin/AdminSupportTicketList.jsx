// src/pages/admin/AdminSupportTicketList.jsx // <-- Use your existing filename
import { useState, useEffect } from 'react';
import { adminGetAllSupportTickets, adminUpdateSupportTicket } from '@/features/admin'; // API functions

// Shadcn UI imports (ensure these are added via CLI: table, select, badge, etc.)
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Terminal, Ticket } from 'lucide-react';
import { adminGetAllUsers } from '@/features/admin';
// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return dateString; }
};

// Possible statuses for the dropdown
const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed', 'reopened'];

// --- RENAME THE FUNCTION ---

export default function AdminSupportTicketList() { // <-- Match your filename
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingTicketId, setUpdatingTicketId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    console.log("TICKET_STATUSES array:", TICKET_STATUSES);

    // Fetch tickets function
    const fetchTickets = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const filters = {};
            if (statusFilter && statusFilter !== 'all') filters.status = statusFilter;
            const data = await adminGetAllSupportTickets(filters);
            setTickets(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    // Handle status update from dropdown
    const handleStatusChange = async (ticketId, newStatus) => {
        setUpdatingTicketId(ticketId);
        setError(null);
        try {
            await adminUpdateSupportTicket(ticketId, { status: newStatus });
            fetchTickets();
        } catch (err) {
            setError(`Failed to update status for ticket ${ticketId}: ${err.message}`);
        } finally {
            setUpdatingTicketId(null);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-6 h-6" />
                    Manage Support Tickets
                </CardTitle>
                <CardDescription>View, update status, and manage customer support requests.</CardDescription>
                 <div className="pt-4 flex gap-4 items-end">
                     <div>
                         <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status:</label>
                         {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                             <SelectTrigger id="statusFilter" className="w-[180px]">
                                 <SelectValue placeholder="All Statuses" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="">All Statuses</SelectItem>
                                 {TICKET_STATUSES.map(status => (
                                     <SelectItem key={status} value={status}>
                                         {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                     </SelectItem>
                                 ))}
                             </SelectContent>
                         </Select> */}
                     </div>
                 </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                )}
                {error && !isLoading && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error Loading Tickets</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {!isLoading && !error && tickets.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                        {statusFilter ? `No tickets found with status "${statusFilter}".` : "No support tickets found."}
                    </p>
                )}
                {!isLoading && !error && tickets.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{ticket.id}</TableCell>
                                    <TableCell className="font-medium max-w-xs truncate">{ticket.subject}</TableCell>
                                    <TableCell>{ticket.customer_name || 'N/A'}<br/><span className="text-xs text-gray-500">{ticket.customer_email || ''}</span></TableCell>
                                    <TableCell>{formatDate(ticket.created_at)}</TableCell>
                                    <TableCell>{formatDate(ticket.updated_at)}</TableCell>
                                    <TableCell>
                                        {updatingTicketId === ticket.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Select
                                                value={ticket.status}
                                                onValueChange={(newStatus) => handleStatusChange(ticket.id, newStatus)}
                                                disabled={updatingTicketId === ticket.id}
                                            >
                                                <SelectTrigger className="h-8 text-xs w-[130px]">
                                                    <SelectValue placeholder="Set status..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TICKET_STATUSES.map(status => (
                                                         <SelectItem key={status} value={status} className="text-xs">
                                                            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
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
// --- Ensure export default matches filename ---
// export default AdminSupportTicketList; // Already matching
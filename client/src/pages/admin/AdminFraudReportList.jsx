// src/pages/admin/AdminFraudReportList.jsx
import { useState, useEffect } from 'react';
import { adminGetAllFraudReports, adminUpdateFraudReport } from "@/features/fraud";

// Shadcn UI imports (add table, select, badge, etc. via CLI)
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Terminal, ShieldAlert } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return dateString; }
};

// Possible statuses (match backend/controller logic)
const REPORT_STATUSES = ['reported', 'investigating', 'action_taken', 'resolved', 'dismissed'];

export default function AdminFraudReportList() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingReportId, setUpdatingReportId] = useState(null);
    const [statusFilter, setStatusFilter] = useState(''); // For potential future filtering

    // Fetch reports function
    const fetchReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const filters = {};
            if (statusFilter) filters.status = statusFilter; // Filtering not implemented in backend yet

            const data = await adminGetAllFraudReports(filters);
            setReports(data); // Backend controller already sorts
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchReports();
    }, [statusFilter]);

    // Handle status update
    const handleStatusChange = async (reportId, newStatus) => {
        setUpdatingReportId(reportId);
        setError(null);
        try {
            // You might need to send more than just status later (e.g., evidence)
            await adminUpdateFraudReport(reportId, { status: newStatus });
            fetchReports(); // Refetch to get updated list/timestamps
        } catch (err) {
            setError(`Failed to update status for report ${reportId}: ${err.message}`);
        } finally {
            setUpdatingReportId(null);
        }
    };

    // Helper function to get badge variant based on status
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'reported': return 'warning'; // Use warning variant (often yellow/orange)
            case 'investigating': return 'info'; // Use a custom 'info' variant or default (blue)
            case 'action_taken': return 'secondary'; // Use secondary (purple maybe?)
            case 'resolved': return 'outline'; // Use outline (gray)
            case 'dismissed': return 'destructive'; // Use destructive (red)
            default: return 'secondary';
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6" />
                    Manage Fraud Reports
                </CardTitle>
                <CardDescription>Review and manage submitted fraud reports.</CardDescription>
                {/* Add Filter UI Here later if needed */}
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
                        <AlertTitle>Error Loading Reports</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {!isLoading && !error && reports.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No fraud reports found.</p>
                )}
                {!isLoading && !error && reports.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Reporter</TableHead>
                                <TableHead>Reported</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead>Status</TableHead>
                                {/* <TableHead>Assigned To</TableHead> */}
                                {/* <TableHead className="text-right">Actions</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>{report.id}</TableCell>
                                    <TableCell className="max-w-sm truncate">{report.description}</TableCell>
                                    <TableCell>{report.reporter_name || 'N/A'}<br/><span className="text-xs text-gray-500">{report.reporter_email || ''}</span></TableCell>
                                    <TableCell>{formatDate(report.created_at)}</TableCell>
                                    <TableCell>{formatDate(report.updated_at)}</TableCell>
                                    <TableCell>
                                        {updatingReportId === report.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Select
                                                value={report.status}
                                                onValueChange={(newStatus) => handleStatusChange(report.id, newStatus)}
                                                disabled={updatingReportId === report.id}
                                            >
                                                <SelectTrigger className="h-8 text-xs w-[130px]">
                                                     {/* Display current status using a badge inside trigger for visual consistency */}
                                                     <Badge variant={getStatusBadgeVariant(report.status)} className="mr-1">
                                                         {report.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                     </Badge>
                                                     <SelectValue placeholder="Change..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {REPORT_STATUSES.map(status => (
                                                         <SelectItem key={status} value={status} className="text-xs">
                                                            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </TableCell>
                                    {/* <TableCell>{report.assigned_admin_name || 'Unassigned'}</TableCell> */}
                                    {/* <TableCell className="text-right"> */}
                                        {/* Add View Details Button Later */}
                                    {/* </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
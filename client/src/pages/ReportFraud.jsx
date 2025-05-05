// src/pages/ReportFraud.jsx
import { useState, useEffect } from 'react';
// --- Import API functions ---
import { createFraudReport, getMyFraudReports } from '@/features/fraud';

// Import Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import  Button  from "@/components/ui/Button";
import  Input  from "@/components/ui/Input";
import  {Label}  from "@/components/ui/Label";
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, CheckCircle, CircleAlert, FileWarning } from 'lucide-react'; // Icons
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch {
        return dateString;
    }
};

const ReportFraud = () => {
    // --- State for the creation form ---
    const [description, setDescription] = useState('');
    const [reportedAccountId, setReportedAccountId] = useState(''); // Use string for input, convert later if needed
    const [relatedTransactionId, setRelatedTransactionId] = useState(''); // Use string for input
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    // --- State for displaying existing reports ---
    const [reports, setReports] = useState([]);
    const [isLoadingReports, setIsLoadingReports] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // --- Fetch existing reports ---
    const fetchReports = async () => {
        setIsLoadingReports(true);
        setFetchError(null);
        try {
            const fetchedReports = await getMyFraudReports();
            setReports(fetchedReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); // Sort newest first
        } catch (err) {
            console.error("Fetch Reports Error in Component:", err);
            setFetchError(err.message || "Failed to load existing reports.");
        } finally {
            setIsLoadingReports(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // --- Form Submission Handler ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(null);
        setSubmitError(null);

        try {
            // Prepare data, converting optional IDs to numbers or null
            const reportData = {
                description,
                reported_account_id: reportedAccountId ? parseInt(reportedAccountId, 10) : null,
                related_transaction_id: relatedTransactionId ? parseInt(relatedTransactionId, 10) : null,
            };

            // Optional: Add basic validation for IDs if needed (e.g., isNaN after parseInt)
             if (reportedAccountId && isNaN(reportData.reported_account_id)) {
                throw new Error("Invalid Account ID provided. Please enter numbers only.");
            }
             if (relatedTransactionId && isNaN(reportData.related_transaction_id)) {
                throw new Error("Invalid Transaction ID provided. Please enter numbers only.");
            }


            await createFraudReport(reportData);
            setSubmitSuccess('Your fraud report has been submitted successfully!');
            // Clear the form
            setDescription('');
            setReportedAccountId('');
            setRelatedTransactionId('');
            // Refresh the list
            fetchReports();
        } catch (err) {
            console.error("Submit Report Error in Component:", err);
            setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* --- Card for Reporting Fraud --- */}
            <Card>
                <CardHeader>
                    <CardTitle>Report Suspected Fraud</CardTitle>
                    <CardDescription>
                        If you suspect fraudulent activity related to your accounts or transactions, please provide the details below.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Description Field (Required) */}
                        <div>
                            <Label htmlFor="description">Description of Suspicious Activity</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what happened, including dates, times, amounts, and why you believe it's fraudulent..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={6}
                                disabled={isSubmitting}
                                className="mt-1"
                            />
                        </div>

                        {/* Related Account ID Field (Optional) */}
                        <div>
                            <Label htmlFor="reportedAccountId">Related Account ID (Optional)</Label>
                            <Input
                                id="reportedAccountId"
                                type="text" // Use text initially to allow empty string
                                inputMode="numeric" // Hint for mobile numeric keyboard
                                pattern="[0-9]*" // Allow only numbers via pattern
                                placeholder="Enter account ID if applicable"
                                value={reportedAccountId}
                                onChange={(e) => setReportedAccountId(e.target.value.replace(/[^0-9]/g, ''))} // Allow only digits
                                disabled={isSubmitting}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">The internal ID of the account involved, if known.</p>
                        </div>

                        {/* Related Transaction ID Field (Optional) */}
                        <div>
                            <Label htmlFor="relatedTransactionId">Related Transaction ID (Optional)</Label>
                            <Input
                                id="relatedTransactionId"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Enter transaction ID if applicable"
                                value={relatedTransactionId}
                                onChange={(e) => setRelatedTransactionId(e.target.value.replace(/[^0-9]/g, ''))}
                                disabled={isSubmitting}
                                className="mt-1"
                            />
                             <p className="text-xs text-gray-500 mt-1">The internal ID of the transaction involved, if known.</p>
                        </div>

                        {/* Submission Feedback */}
                        {submitSuccess && (
                            <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Success!</AlertTitle>
                                <AlertDescription>{submitSuccess}</AlertDescription>
                            </Alert>
                        )}
                        {submitError && (
                            <Alert variant="destructive">
                                <CircleAlert className="h-4 w-4" />
                                <AlertTitle>Submission Failed</AlertTitle>
                                <AlertDescription>{submitError}</AlertDescription>
                            </Alert>
                        )}

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting Report...
                                </>
                            ) : (
                                'Submit Fraud Report'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* --- Card for Displaying Existing Reports --- */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Submitted Fraud Reports</CardTitle>
                    <CardDescription>History of your fraud reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Loading State */}
                    {isLoadingReports && (
                         <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                         </div>
                    )}

                    {/* Error State */}
                    {!isLoadingReports && fetchError && (
                         <Alert variant="destructive">
                             <Terminal className="h-4 w-4" />
                             <AlertTitle>Error Loading Reports</AlertTitle>
                             <AlertDescription>{fetchError}</AlertDescription>
                         </Alert>
                    )}

                    {/* Empty State */}
                    {!isLoadingReports && !fetchError && reports.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            <FileWarning className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            You haven't submitted any fraud reports yet.
                        </div>
                    )}

                    {/* Report List */}
                    {!isLoadingReports && !fetchError && reports.length > 0 && (
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                                         <p className="text-sm text-gray-700 flex-grow line-clamp-3"> {/* Show description preview */}
                                            <span className="font-semibold">Details:</span> {report.description || 'N/A'}
                                        </p>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                                            report.status === 'reported' ? 'bg-orange-100 text-orange-800' :
                                            report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                                            report.status === 'action_taken' ? 'bg-purple-100 text-purple-800' :
                                            report.status === 'resolved' ? 'bg-gray-200 text-gray-800' :
                                            report.status === 'dismissed' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {report.status?.replace('_', ' ') || 'Unknown'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Reported: {formatDate(report.created_at)}
                                        {report.reported_account_id && ` | Account ID: ${report.reported_account_id}`}
                                        {report.related_transaction_id && ` | Transaction ID: ${report.related_transaction_id}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportFraud;
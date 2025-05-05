// src/pages/SupportTickets.jsx
import { useState, useEffect } from 'react';
import { createSupportTicket, getSupportTickets } from '@/features/support';

// Import Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import  Button  from '@/components/ui/Button';
// --- CORRECT THESE IMPORTS ---
import  Input  from '@/components/ui/Input';   // Use named import { Input } and lowercase file 'input'
import { Label } from '@/components/ui/Label';   // Use named import { Label } and lowercase file 'label'
import { Textarea } from '@/components/ui/textarea'; // Use named import { Textarea } and lowercase file 'textarea'
// --- END CORRECTIONS ---
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, CheckCircle, CircleAlert, Ticket } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

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


const SupportTickets = () => {
    // State for the creation form
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    // State for displaying existing tickets
    const [tickets, setTickets] = useState([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Ticket Categories
    const ticketCategories = [
        { value: 'billing', label: 'Billing Inquiry' },
        { value: 'technical', label: 'Technical Issue' },
        { value: 'account_access', label: 'Account Access Problem' },
        { value: 'general', label: 'General Question' },
        { value: 'feedback', label: 'Feedback/Suggestion' },
        { value: 'fraud_report', label: 'Fraud Report Follow-up' },
    ];

    // Fetch existing tickets function
    const fetchTickets = async () => {
        setIsLoadingTickets(true);
        setFetchError(null); // Clear previous fetch error
        try {
            const fetchedTickets = await getSupportTickets();
            setTickets(fetchedTickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (err) {
             console.error("Fetch Tickets Error in Component:", err); // Log the error here too
             setFetchError(err.message || "Failed to load existing tickets.");
        } finally {
            setIsLoadingTickets(false);
        }
    };

    // Fetch tickets on mount
    useEffect(() => {
        fetchTickets();
    }, []);

    // Form Submission Handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(null);
        setSubmitError(null);

        try {
            // Pass category in ticketData if backend expects it
            const ticketData = { subject, category, description };
            await createSupportTicket(ticketData);
            setSubmitSuccess('Your support ticket has been submitted successfully!');
            setSubject('');
            setCategory('');
            setDescription('');
            fetchTickets(); // Refresh the list after successful submission
        } catch (err) {
             console.error("Submit Ticket Error in Component:", err); // Log the error
             setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Card for Creating a New Ticket */}
            <Card>
                <CardHeader>
                    <CardTitle>Create New Support Ticket</CardTitle>
                    <CardDescription>Describe the issue you are facing.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Subject */}
                        <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                type="text"
                                placeholder="e.g., Issue with recent transfer"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                                required
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {ticketCategories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Please provide detailed information about the issue..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={5}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Submission Feedback */}
                        {submitSuccess && (
                            <Alert variant="success" className="bg-green-50 border-green-200 text-green-800"> {/* Example success variant styling */}
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
                                    Submitting...
                                </>
                            ) : (
                                'Submit Ticket'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Card for Displaying Existing Tickets */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Support Tickets</CardTitle>
                    <CardDescription>History of your submitted support requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Loading State */}
                    {isLoadingTickets && (
                         <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                         </div>
                    )}

                    {/* Error State */}
                    {!isLoadingTickets && fetchError && (
                         <Alert variant="destructive">
                             <Terminal className="h-4 w-4" />
                             <AlertTitle>Error Loading Tickets</AlertTitle>
                             <AlertDescription>{fetchError}</AlertDescription>
                         </Alert>
                    )}

                    {/* Empty State */}
                    {!isLoadingTickets && !fetchError && tickets.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            You haven't submitted any support tickets yet.
                        </div>
                    )}

                    {/* Ticket List */}
                    {!isLoadingTickets && !fetchError && tickets.length > 0 && (
                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1 flex-wrap gap-2"> {/* Allow wrapping */}
                                        <h4 className="font-semibold text-sm md:text-base flex-grow">{ticket.subject || 'No Subject'}</h4>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${ // Prevent status wrap
                                            ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                            ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                            ticket.status === 'resolved' ? 'bg-gray-200 text-gray-800' : // Adjusted resolved color
                                            ticket.status === 'closed' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {ticket.status?.replace('_', ' ') || 'Unknown'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Category: {ticket.category || 'N/A'} | Submitted: {formatDate(ticket.created_at)}
                                    </p>
                                     {/* You might want to show a snippet of the description here */}
                                     {/* <p className="text-sm text-gray-700 mt-1 line-clamp-2">{ticket.description}</p> */}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SupportTickets;
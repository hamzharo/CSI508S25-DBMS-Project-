import { useState, useEffect } from 'react';
import { getTransactions } from '@/features/transactions'; // API function

// Shadcn UI Components
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from "lucide-react"; // Icon

// Helper function to format currency display
const formatCurrency = (amount, type) => {
    const num = Number(amount);
    if (isNaN(num)) return '$--.--';
    const sign = type === 'deposit' ? '+' : '-'; // Show + or - sign
    // Format absolute value as currency
    return `${sign} ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(num))}`;
};

// Helper function to format date display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Format like: Jan 1, 2024, 03:45 PM
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

// Component to display the transaction history page
export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]); // State for storing transactions
    const [isLoading, setIsLoading] = useState(true);    // State for loading status
    const [error, setError] = useState(null);         // State for storing errors

    // useEffect hook runs once when the component mounts to fetch data
    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true); // Start loading
            setError(null);     // Clear previous errors
            try {
                // Call the API function from features/transactions.js
                const data = await getTransactions();
                // Ensure data is an array before setting state
                setTransactions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Transaction Page Error:", err);
                setError(err.response?.data?.message || err.message || "Failed to load transactions.");
                setTransactions([]); // Clear data on error
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchTransactions(); // Call the function to fetch data
    }, []); // Empty dependency array means run only once on mount

    // Function to determine how to display each transaction row
    // Note: Simplified - doesn't need account context for basic display
    const getDisplayData = (txn) => {
        let description = txn.description || 'Transaction';
        let type = txn.type || 'Unknown';
        let amount = Number(txn.amount) || 0;
        let date = txn.timestamp;

        // Basic type formatting
        if (type === 'deposit') {
             description = txn.description || 'Deposit Received';
             amount = Math.abs(amount); // Show as positive
        } else if (type === 'withdrawal') {
            description = txn.description || 'Withdrawal Made';
            amount = -Math.abs(amount); // Show as negative
        } else if (type === 'transfer') {
            // Simple description for transfers
            description = txn.description || `Transfer involving ${txn.senderAccountNumber || '?'} / ${txn.receiverAccountNumber || '?'}`;
            // Keep original amount sign for transfers (positive if received, negative if sent)
        }

        return {
            id: txn._id || txn.id, // Use unique ID for table key
            date: formatDate(date),
            description: description,
            type: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize type
            amountFormatted: formatCurrency(amount, type),
            amountRaw: amount // Keep raw number for styling
        };
    };


    // JSX for the component
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Transaction History</CardTitle>
                {/* Can add filtering options here later */}
            </CardHeader>
            <CardContent>
                {/* Display error if fetch failed */}
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error Loading Transactions</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Shadcn Table component */}
                <Table>
                    <TableCaption className="mt-4">
                        {isLoading ? "Loading transactions..." :
                         transactions.length === 0 ? "No transactions found." :
                         "A list of your recent transactions."}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead className="text-right w-[150px]">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Show skeleton rows while loading */}
                        {isLoading && (
                            [...Array(5)].map((_, i) => ( // Show 5 skeleton rows
                                <TableRow key={`skeleton-${i}`}>
                                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        )}
                        {/* Map over fetched transactions and display if not loading */}
                        {!isLoading && transactions.map((txn) => {
                            const display = getDisplayData(txn); // Get formatted data
                            return (
                                <TableRow key={display.id}>
                                    <TableCell className="font-medium text-xs">{display.date}</TableCell>
                                    <TableCell>{display.description}</TableCell>
                                    <TableCell className="text-xs uppercase">{display.type}</TableCell>
                                    <TableCell className={`text-right font-semibold ${display.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {display.amountFormatted}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                         {/* Show message if no transactions found after loading */}
                         {!isLoading && transactions.length === 0 && !error && (
                             <TableRow>
                                 <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                                    No transactions to display.
                                 </TableCell>
                             </TableRow>
                         )}
                    </TableBody>
                </Table>
                 {/* Can add Pagination controls here later */}
            </CardContent>
        </Card>
    );
}
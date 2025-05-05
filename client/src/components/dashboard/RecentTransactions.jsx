// src/components/dashboard/RecentTransactions.jsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/Button"; // Assuming Button uses ui/button definition
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from 'lucide-react'; // Icon for link

// Helper to format currency (could be moved to a utils file)
const formatCurrency = (amount) => {
     const num = Number(amount);
     if (isNaN(num)) return '$--.--';
     // Ensure we format the absolute value, as the sign is handled separately
     return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(num));
};

 // Helper to format date (could be moved to a utils file)
 const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
         return 'Invalid Date';
    }
 };


const RecentTransactions = ({ transactions = [], isLoading, limit = 5 }) => {
    const displayedTransactions = transactions.slice(0, limit);

    // Determine transaction type/description (adapt based on your actual transaction data structure)
    // --- THIS FUNCTION REMAINS UNCHANGED AS REQUESTED ---
    const getTransactionDetails = (txn) => {
        console.group("txn is: ", txn); // Note: console.group needs console.groupEnd() usually
        let description = txn.description || 'Transaction';
        let amount = Number(txn.amount) || 0;
        let date = txn.timestamp;
        let type = txn.type; // Keep type for potential internal logic
        let isPositive = false; // This variable is calculated but not used outside this function in the final rendering logic below

        if (txn.type === 'deposit') {
             description = txn.description || 'Deposit';
             isPositive = true;
        } else if (txn.type === 'withdrawal') {
             description = txn.description || 'Withdrawal';
             isPositive = false;
             amount = -amount; // Show as negative - IMPORTANT: This might affect the amount value used later
        } else if (txn.type === 'transfer') {
            description = txn.description || `Transfer ${txn.senderAccountNumber ? 'to '+txn.receiverAccountNumber : 'from '+txn.senderAccountNumber}`;
            // isPositive remains false by default
        }
        console.groupEnd(); // Added to close the group

         // Return the details including the original amount which might be negative
         return { description, amount, date, type, isPositive };
    };


    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
                 {/* Using shadcn/ui Button style */}
                 <Button variant="ghost" size="sm" asChild className="h-auto p-0 text-blue-600 hover:bg-transparent hover:text-blue-800 hover:underline">
                     <Link to="/transactions">
                        View All <ArrowRight className="ml-1 h-4 w-4 inline" />
                     </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-4">
                        {[...Array(limit)].map((_, i) => (
                             <div key={i} className="flex justify-between items-center">
                                 <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-5 w-20" />
                             </div>
                        ))}
                    </div>
                )}
                {!isLoading && transactions.length === 0 && (
                     <p className="text-sm text-gray-500 text-center py-4">No recent transactions found.</p>
                )}
                {!isLoading && transactions.length > 0 && (
                    <ul className="space-y-4">
                        {displayedTransactions.map((txn) => {
                            // Get details from the unchanged function
                            const { description, amount, date } = getTransactionDetails(txn);

                            // --- MODIFIED CONDITION LOGIC ---
                            // Check if the description string (case-insensitive) contains "deposit"
                            const isDepositBasedOnDescription = description.toLowerCase().includes('deposit');

                            // Determine color based on the description check
                            const amountColor = isDepositBasedOnDescription ? 'text-green-600' : 'text-red-600';

                            // Determine sign prefix based on the description check
                            // Use formatCurrency helper which now includes Math.abs()
                            const formattedAmount = `${isDepositBasedOnDescription ? '+' : '-'}${formatCurrency(amount)}`;
                            // --- END OF MODIFIED CONDITION LOGIC ---

                             return (
                                <li key={txn._id || txn.id} className="flex justify-between items-center">
                                     <div>
                                        {/* Use capitalize utility or CSS if needed, or leave as is */}
                                        <p className="text-sm font-medium">{description}</p>
                                        <p className="text-xs text-gray-500">{formatDate(date)}</p>
                                    </div>
                                     <span className={`text-sm font-semibold ${amountColor}`}>
                                        {formattedAmount}
                                    </span>
                                </li>
                             );
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;
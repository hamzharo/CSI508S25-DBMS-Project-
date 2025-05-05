// src/pages/DepositPage.jsx
import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { AuthContext } from '@/context/AuthContext'; // Potentially needed if accounts depend on context user
import { getUserAccounts } from '@/features/accounts'; // To fetch accounts for dropdown
import { makeDeposit } from '@/features/transactions'; // API function for depositing

// Import Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import  Button  from "@/components/ui/Button";
import  Input  from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For account selection
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, CheckCircle, CircleAlert } from 'lucide-react'; // Icons
import { Skeleton } from "@/components/ui/skeleton";

// Helper to format currency
const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '$--.--';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};


const DepositPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Hook for navigation
    const passedAccountId = searchParams.get('accountId'); // Get ID from URL if present

    // State for the form
    const [accounts, setAccounts] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(passedAccountId || ''); // Use passed ID or empty string
    const [amount, setAmount] = useState('');
    const [isDepositing, setIsDepositing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch user accounts IF no account ID was passed via URL params
    useEffect(() => {
        const fetchAccounts = async () => {
            // Only fetch if an account wasn't pre-selected via the URL
            if (!passedAccountId) {
                setIsLoadingAccounts(true);
                try {
                    const userAccounts = await getUserAccounts();
                    setAccounts(userAccounts || []);
                    // Optionally default selection if accounts load
                    // if (userAccounts?.length > 0) {
                    //     setSelectedAccountId(String(userAccounts[0].id));
                    // }
                } catch (fetchError) {
                    setError("Could not load your accounts for selection.");
                    console.error("Error fetching accounts for deposit:", fetchError);
                } finally {
                    setIsLoadingAccounts(false);
                }
            } else {
                // If account ID is passed, we might still want account details to display name/number,
                // but for simplicity now, we'll assume we only need the ID if it's passed.
                // OR fetch all accounts anyway to get the number needed for the API call.
                // Let's fetch all accounts regardless for now to get the number easily.
                 setIsLoadingAccounts(true);
                 getUserAccounts()
                     .then(data => setAccounts(data || []))
                     .catch(err => console.error("Error fetching accounts:", err))
                     .finally(() => setIsLoadingAccounts(false));
            }
        };
        fetchAccounts();
    }, [passedAccountId]); // Rerun if the URL param changes (unlikely here)

    // Handle Deposit Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsDepositing(true);
        setError(null);
        setSuccess(null);

        const depositAmount = parseFloat(amount);

        // --- Validation ---
        if (!selectedAccountId) {
            setError("Please select an account to deposit into.");
            setIsDepositing(false);
            return;
        }
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setError("Please enter a valid positive deposit amount.");
            setIsDepositing(false);
            return;
        }

        // --- Find Account Number ---
        const targetAccount = accounts.find(acc => String(acc.id) === selectedAccountId);
        if (!targetAccount || !targetAccount.account_number) {
             setError("Could not find account details for the selected account.");
             setIsDepositing(false);
             return;
         }
        const targetAccountNumber = targetAccount.account_number;

        // --- API Call ---
        try {
            await makeDeposit(targetAccountNumber, depositAmount);
            setSuccess(`Deposit of ${formatCurrency(depositAmount)} submitted successfully for account ...${targetAccountNumber.slice(-4)}! Balance will update shortly.`);
            // Clear form
            setAmount('');
            // Maybe clear account selection if dropdown was used:
            // if (!passedAccountId) setSelectedAccountId('');

            // Optional: Redirect back to dashboard after a delay
            setTimeout(() => {
                 navigate('/dashboard');
             }, 2500); // Redirect after 2.5 seconds

        } catch (err) {
            setError(err.message || "An unexpected error occurred during deposit.");
        } finally {
            setIsDepositing(false);
        }
    };


    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>Enter deposit details.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                     {/* Error/Success Alerts */}
                     {success && (
                         <Alert variant="success" className="bg-green-50">
                             <CheckCircle className="h-4 w-4" />
                             <AlertTitle>Success</AlertTitle>
                             <AlertDescription>{success}</AlertDescription>
                         </Alert>
                     )}
                     {error && (
                         <Alert variant="destructive">
                             <Terminal className="h-4 w-4" />
                             <AlertTitle>Error</AlertTitle>
                             <AlertDescription>{error}</AlertDescription>
                         </Alert>
                     )}

                     {/* Account Selection Dropdown (Show only if ID not passed in URL) */}
                     {!passedAccountId && (
                         <div>
                             <Label htmlFor="depositAccount">Account</Label>
                             {isLoadingAccounts ? (
                                 <Skeleton className="h-10 w-full mt-1" />
                             ) : (
                                 <Select
                                     value={selectedAccountId}
                                     onValueChange={setSelectedAccountId}
                                     required
                                     disabled={isDepositing || accounts.length === 0}
                                 >
                                     <SelectTrigger id="depositAccount" className="mt-1">
                                         <SelectValue placeholder={accounts.length > 0 ? "Select account..." : "No accounts available"} />
                                     </SelectTrigger>
                                     <SelectContent>
                                         {accounts.map(acc => (
                                             <SelectItem key={acc.id} value={String(acc.id)}>
                                                 {acc.account_type} (...{acc.account_number?.slice(-4)}) - {formatCurrency(acc.balance)}
                                             </SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                             )}
                         </div>
                     )}

                     {/* Display selected account if ID was passed */}
                     {passedAccountId && (
                         <div>
                             <Label>Depositing Into Account</Label>
                              {isLoadingAccounts ? (
                                 <Skeleton className="h-6 w-3/4 mt-1" />
                             ) : (
                                <p className="text-sm font-medium mt-1">
                                     {accounts.find(acc => String(acc.id) === passedAccountId)?.account_type || 'Account'}
                                     {' '}
                                     (...{accounts.find(acc => String(acc.id) === passedAccountId)?.account_number?.slice(-4) || 'N/A'})
                                </p>
                              )}
                         </div>
                     )}


                     {/* Amount Field */}
                     <div>
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            className="mt-1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            disabled={isDepositing || (!selectedAccountId)} // Disable if no account selected
                        />
                     </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isDepositing || !selectedAccountId || !amount}>
                         {isDepositing ? (
                             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                         ) : (
                             'Submit Deposit'
                         )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default DepositPage;
// src/pages/UserDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { getUserAccounts } from '@/features/accounts';
import { getTransactions } from '@/features/transactions';
import BalanceChart from '@/components/dashboard/BalanceChart';


// Import UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import  Button  from "@/components/ui/Button"; // Corrected path case
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Ban } from "lucide-react";

// Import custom dashboard components
import SummaryCard from '@/components/dashboard/SummaryCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

// --- Import Layout Components ---
import Sidebar from '@/layouts/Sidebar'; // This should be in UserLayout, not directly here
import Header from '@/layouts/Header';   // This should be in UserLayout, not directly here

// Helper to format currency
const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '$--.--';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoadingAccounts(true);
            setIsLoadingTransactions(true);
            setError(null);
            try {
                console.log("UserDashboard: Fetching accounts and transactions...");
                const [fetchedAccounts, fetchedTransactions] = await Promise.all([
                    getUserAccounts(),
                    getTransactions() // Ensure this fetches relevant transactions
                ]);
                console.log("UserDashboard: Raw Transactions from API:", fetchedTransactions);
                console.log("UserDashboard: Raw Accounts from API:", fetchedAccounts);

                const userAccounts = fetchedAccounts || [];
                setAccounts(userAccounts);
                setTransactions(Array.isArray(fetchedTransactions) ? fetchedTransactions : []);

            } catch (err) {
                console.error("UserDashboard: Fetch error:", err);
                setError(err.response?.data?.message || err.message || "Failed to load dashboard data.");
                setAccounts([]);
                setTransactions([]);
            } finally {
                setIsLoadingAccounts(false);
                setIsLoadingTransactions(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- Calculated Values ---
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

    // Corrected Recent Income Calculation
    const recentIncome = transactions
        .filter(t => {
            // Check if the transaction's primary account_id matches one of the user's accounts
            const isAccountRelated = accounts.some(acc => acc.id === t.account_id);
            // Check if the RECEIVER of a transfer is one of the user's accounts by ID
            const isReceiver = accounts.some(acc => acc.id === t.receiver_account_id);
            // Check if the SENDER of a transfer is one of the user's accounts by ID
            const isSender = accounts.some(acc => acc.id === t.sender_account_id);

            // Income condition:
            // 1. It's a 'deposit' related to one of the user's accounts
            // OR
            // 2. It's a 'transfer' where the RECEIVER is the user's account AND the SENDER is NOT.
            return (t.type === 'deposit' && isAccountRelated) ||
                   (t.type === 'transfer' && isReceiver && !isSender);
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Corrected Recent Expenses Calculation
     const recentExpenses = transactions
         .filter(t => {
             // Check if the transaction's primary account_id matches one of the user's accounts
             const isAccountRelated = accounts.some(acc => acc.id === t.account_id);
             // Check if the SENDER of a transfer is one of the user's accounts by ID
             const isSender = accounts.some(acc => acc.id === t.sender_account_id);
             // Check if the RECEIVER of a transfer is one of the user's accounts by ID
             const isReceiver = accounts.some(acc => acc.id === t.receiver_account_id);

             // Expense condition:
             // 1. It's a 'withdrawal' related to one of the user's accounts
             // OR
             // 2. It's a 'transfer' where the SENDER is the user's account AND the RECEIVER is NOT.
             return (t.type === 'withdrawal' && isAccountRelated) || // Assuming 'withdrawal' type exists
                    (t.type === 'transfer' && isSender && !isReceiver);
         })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);


    // Combined loading state
    const isLoading = isLoadingAccounts || isLoadingTransactions;

    // --- Component Return Structure ---
    // NOTE: Removed direct Sidebar/Header imports/render as they belong in UserLayout
    return (
        <>
            {/* Welcome Message */}
            <h1 className="text-2xl font-semibold text-gray-700 mb-6">
                Welcome back, {user?.firstName || 'User'}!
            </h1>

            {/* Error State */}
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Loading Dashboard</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Summary Cards (uses corrected recentIncome/recentExpenses) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                    title="Total Balance"
                    value={formatCurrency(totalBalance)}
                    icon="dollar"
                    isLoading={isLoadingAccounts}
                />
                 <SummaryCard
                    title="Recent Income"
                    value={formatCurrency(recentIncome)}
                    icon="arrow-up"
                    trend="positive"
                    isLoading={isLoadingTransactions}
                />
                 <SummaryCard
                    title="Recent Expenses"
                    value={formatCurrency(recentExpenses)} //  corrected calculation
                    icon="arrow-down"
                    trend="negative"
                    isLoading={isLoadingTransactions}
                />
                 <SummaryCard
                    title="Accounts"
                    value={accounts.length}
                    icon="bank"
                    isLoading={isLoadingAccounts}
                />
            </div>

            {/* Main Content Area (Chart & Recent Transactions) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Financial Overview Chart */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader>
                        <CardTitle>Financial Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BalanceChart
                            transactions={transactions}
                            accounts={accounts}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>

                {/* Recent Transactions List */}
                <RecentTransactions transactions={transactions} isLoading={isLoadingTransactions} className="shadow-sm" />
            </div>

            {/* Accounts Overview */}
             <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Details</h2>
             {isLoadingAccounts && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Skeleton className="h-32 w-full rounded-lg" />
                     <Skeleton className="h-32 w-full rounded-lg" />
                </div>
             )}
             {!isLoadingAccounts && accounts.length === 0 && !error && (
                <Card className="shadow-sm">
                    <CardContent className="pt-6 flex items-center justify-center flex-col text-center">
                         <Ban className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-gray-600">No accounts found.</p>
                        <p className="text-sm text-gray-500">If you just registered, approval might be pending.</p>
                    </CardContent>
                </Card>
             )}
             {!isLoadingAccounts && accounts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {accounts.map((account) => (
                        <Card key={account.id || account.account_number} className="shadow-sm">
                             <CardHeader>
                                <CardTitle>{account.account_type || 'Account'}</CardTitle>
                                <CardDescription>
                                    ...{account.account_number?.slice(-4) || 'N/A'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    {formatCurrency(account.balance)}
                                </p>
                                <p className={`text-sm capitalize ${account.account_status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                                     Status: {account.account_status?.replace('_', ' ') || 'Unknown'}
                                 </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    size="sm"
                                    asChild
                                >
                                    {/* Link to transactions page, potentially filtered */}
                                    <Link to={`/transactions?accountId=${account.id}`}>View History</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             )}
        </>
    );
};

export default UserDashboard;

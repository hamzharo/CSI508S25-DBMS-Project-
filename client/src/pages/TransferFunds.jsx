// **PASTE THIS CODE INTO: src/pages/TransferFunds.jsx**

import { useState } from 'react';
import { transferFunds } from '@/features/transactions'; // API function

// Shadcn UI Components
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from 'lucide-react'; // Icons

export default function TransferFunds() {
    const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle the transfer submission
    const handleTransfer = async (e) => {
         e.preventDefault(); // Prevent default form submission behavior
        setError(null);       // Clear previous messages
        setSuccessMessage(null);
        setIsLoading(true);   // Show loading state

        // Simple validation
        if (!receiverAccountNumber || !amount || Number(amount) <= 0) {
            setError('Please enter a valid receiver account number and a positive amount.');
            setIsLoading(false); // Stop loading
            return;
        }

        try {
            // Call the API function from features/transactions.js
            const response = await transferFunds(receiverAccountNumber, Number(amount));

            if (response.success) {
                setSuccessMessage(response.message || 'Transfer successful!');
                // Clear the form fields after success
                setReceiverAccountNumber('');
                setAmount('');
            } else {
                // Show error message from API response or a generic one
                setError(response.message || 'Transfer failed. Please try again.');
            }
        } catch (err) {
             // Handle unexpected errors during the API call
             console.error("Transfer Page Error:", err);
             setError(err.message || "An unexpected error occurred during transfer.");
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    // JSX for the component
    return (
        <div className="max-w-lg mx-auto"> {/* Center the form card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Transfer Funds</CardTitle>
                    <CardDescription>Send money securely to another account.</CardDescription>
                </CardHeader>
                {/* Form element wraps the inputs and button */}
                <form onSubmit={handleTransfer}>
                    <CardContent className="space-y-4">
                        {/* Display error message if 'error' state is not null */}
                        {error && (
                            <Alert variant="destructive">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Transfer Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {/* Display success message if 'successMessage' state is not null */}
                         {successMessage && (
                            <Alert variant="default" className="bg-green-50 border-green-300 text-green-800">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        {/* Input field for Receiver Account Number */}
                        <div className="space-y-1">
                            <Label htmlFor="receiverAccount">Receiver Account Number</Label>
                            <Input
                                id="receiverAccount"
                                type="text"
                                placeholder="Enter account number"
                                value={receiverAccountNumber}
                                // Update state when user types
                                onChange={(e) => setReceiverAccountNumber(e.target.value)}
                                required // HTML basic validation
                                disabled={isLoading} // Disable while loading
                            />
                        </div>
                        {/* Input field for Amount */}
                        <div className="space-y-1">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number" // Use number type for amount
                                placeholder="0.00"
                                value={amount}
                                // Update state when user types
                                onChange={(e) => setAmount(e.target.value)}
                                required // HTML basic validation
                                min="0.01" // Example minimum value
                                step="0.01" // Allow cents
                                disabled={isLoading} // Disable while loading
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        {/* Submit button */}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {/* Show different text while loading */}
                            {isLoading ? 'Processing Transfer...' : 'Send Transfer'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
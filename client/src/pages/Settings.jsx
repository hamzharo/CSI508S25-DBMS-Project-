// client/src/pages/Settings.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // For linking to profile page
import { AuthContext } from '@/context/AuthContext'; // To get current user info

// --- Import Conceptual API Functions ---
// Create these functions in src/features/user.js or similar
import { changePassword, getUserPreferences, updateUserPreferences } from '@/features/user';

// --- Import Shadcn UI Components ---
// (Make sure you've added these via `npx shadcn@latest add ...`)
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import  Button  from "@/components/ui/Button";
import  Input  from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch"; // For notification toggles
import { Separator } from "@/components/ui/separator"; // For visual separation
import { Loader2, Terminal, CheckCircle, CircleAlert, User, KeyRound, Bell } from 'lucide-react'; // Icons
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
    const { user } = useContext(AuthContext); // Get logged-in user data

    // --- State for Password Change ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
    const [passwordChangeError, setPasswordChangeError] = useState(null);

    // --- State for Notification Preferences ---
    const [preferences, setPreferences] = useState({
        emailLoginAlerts: false,
        emailLargeTransactions: false,
        // Add more preferences as needed (e.g., SMS)
    });
    const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
    const [isSavingPreferences, setIsSavingPreferences] = useState(false);
    const [preferencesError, setPreferencesError] = useState(null);
    const [preferencesSuccess, setPreferencesSuccess] = useState(null);

    // --- Fetch initial preferences ---
    useEffect(() => {
        const fetchPrefs = async () => {
            setIsLoadingPreferences(true);
            setPreferencesError(null);
            try {
                const fetchedPrefs = await getUserPreferences();
                // Map fetched data to state structure - adjust based on your API response
                setPreferences({
                    emailLoginAlerts: fetchedPrefs?.emailNotifications?.loginAlerts ?? false,
                    emailLargeTransactions: fetchedPrefs?.emailNotifications?.largeTransactions ?? false,
                });
            } catch (err) {
                console.error("Failed to fetch preferences:", err);
                setPreferencesError("Could not load your notification preferences.");
            } finally {
                setIsLoadingPreferences(false);
            }
        };
        fetchPrefs();
    }, []);

    // --- Handle Password Change Submission ---
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordChangeError(null);
        setPasswordChangeSuccess(null);

        if (newPassword !== confirmPassword) {
            setPasswordChangeError("New password and confirmation password do not match.");
            return;
        }
        if (newPassword.length < 8) { // Example basic validation
             setPasswordChangeError("New password must be at least 8 characters long.");
             return;
        }

        setIsChangingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordChangeSuccess("Password updated successfully!");
            // Clear fields after success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error("Password change error:", err);
            setPasswordChangeError(err.message || "Failed to update password. Please check current password.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    // --- Handle Notification Preference Toggle ---
    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        // Clear success message on change, user needs to save again
        setPreferencesSuccess(null);
    };

    // --- Handle Saving Notification Preferences ---
    const handleSavePreferences = async () => {
        setIsSavingPreferences(true);
        setPreferencesError(null);
        setPreferencesSuccess(null);
        try {
            // Structure data as expected by your API
            const prefsToSave = {
                emailNotifications: {
                    loginAlerts: preferences.emailLoginAlerts,
                    largeTransactions: preferences.emailLargeTransactions,
                }
                // add other preference types (sms etc)
            };
            await updateUserPreferences(prefsToSave);
            setPreferencesSuccess("Notification preferences saved successfully!");
        } catch (err) {
            console.error("Failed to save preferences:", err);
            setPreferencesError(err.message || "Could not save preferences.");
        } finally {
            setIsSavingPreferences(false);
        }
    };

    return (
        // No need for Navbar here if using UserLayout
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold text-gray-700">Settings</h1>

            {/* --- Profile Information Section --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Basic profile details. For updates, please visit your profile page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                    <p><strong>Name:</strong> {user?.firstName || ''} {user?.lastName || ''}</p>
                    <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                    {/* Add other relevant info like phone if available in user context */}
                    {/* <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p> */}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/profile">Go to Profile Page</Link>
                    </Button>
                </CardFooter>
            </Card>

            {/* --- Security Section --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5" />
                        Security
                    </CardTitle>
                    <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePasswordSubmit}>
                    <CardContent className="space-y-4">
                        <h3 className="font-medium text-md">Change Password</h3>
                        {/* Current Password */}
                        <div>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                disabled={isChangingPassword}
                                className="mt-1"
                            />
                        </div>
                        {/* New Password */}
                        <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8} // Basic HTML validation
                                disabled={isChangingPassword}
                                className="mt-1"
                            />
                        </div>
                        {/* Confirm New Password */}
                        <div>
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isChangingPassword}
                                className="mt-1"
                            />
                        </div>
                        {/* Password Change Feedback */}
                        {passwordChangeSuccess && (
                            <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle>Success!</AlertTitle>
                                <AlertDescription>{passwordChangeSuccess}</AlertDescription>
                            </Alert>
                        )}
                        {passwordChangeError && (
                            <Alert variant="destructive">
                                <CircleAlert className="h-4 w-4" />
                                <AlertTitle>Password Change Failed</AlertTitle>
                                <AlertDescription>{passwordChangeError}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isChangingPassword}>
                            {isChangingPassword ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
                            ) : (
                                'Update Password'
                            )}
                        </Button>
                    </CardFooter>
                </form>
                {/* Add 2FA section here later if needed */}
                 {/* <Separator className="my-6" />
                 <div>
                    <h3 className="font-medium text-md mb-2">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-gray-600">Status: Not Implemented</p>
                    <Button variant="outline" size="sm" className="mt-2" disabled>Setup 2FA</Button>
                 </div> */}
            </Card>

            {/* --- Notification Preferences Section --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Preferences
                    </CardTitle>
                    <CardDescription>Choose how you receive alerts and updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingPreferences && <Skeleton className="h-24 w-full" />}
                    {!isLoadingPreferences && preferencesError && (
                         <Alert variant="destructive">
                             <Terminal className="h-4 w-4" />
                             <AlertTitle>Error</AlertTitle>
                             <AlertDescription>{preferencesError}</AlertDescription>
                         </Alert>
                    )}
                    {!isLoadingPreferences && !preferencesError && (
                        <>
                            <h3 className="font-medium text-md">Email Notifications</h3>
                            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                                <Label htmlFor="emailLoginAlerts" className="flex flex-col space-y-1">
                                    <span>Login Alerts</span>
                                    <span className="font-normal leading-snug text-muted-foreground text-xs">
                                        Receive an email when your account is logged into from a new device or location.
                                    </span>
                                </Label>
                                <Switch
                                    id="emailLoginAlerts"
                                    checked={preferences.emailLoginAlerts}
                                    onCheckedChange={(checked) => handlePreferenceChange('emailLoginAlerts', checked)}
                                    disabled={isSavingPreferences}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                                <Label htmlFor="emailLargeTransactions" className="flex flex-col space-y-1">
                                    <span>Large Transaction Alerts</span>
                                    <span className="font-normal leading-snug text-muted-foreground text-xs">
                                        Receive an email for transactions exceeding a certain amount (if applicable).
                                    </span>
                                </Label>
                                <Switch
                                    id="emailLargeTransactions"
                                    checked={preferences.emailLargeTransactions}
                                    onCheckedChange={(checked) => handlePreferenceChange('emailLargeTransactions', checked)}
                                    disabled={isSavingPreferences}
                                />
                            </div>
                            {/* Add more notification toggles here */}

                             {/* Preferences Save Feedback */}
                            {preferencesSuccess && (
                                <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertTitle>Saved!</AlertTitle>
                                    <AlertDescription>{preferencesSuccess}</AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}
                </CardContent>
                 {!isLoadingPreferences && !preferencesError && (
                     <CardFooter>
                         <Button onClick={handleSavePreferences} disabled={isSavingPreferences}>
                             {isSavingPreferences ? (
                                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                             ) : (
                                 'Save Preferences'
                             )}
                         </Button>
                     </CardFooter>
                 )}
            </Card>

             {/* Add other sections like Appearance, etc. later */}

        </div>
    );
}
// // src/pages/ProfilePage.jsx
// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '@/context/AuthContext';
// import { getUserProfile, updateUserProfile } from '@/features/user'; // API functions

// // Import Shadcn UI Components
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import { Label } from "@/components/ui/Label";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal, CheckCircle, Edit, Save } from "lucide-react"; // Icons

// export default function ProfilePage() {
//     const { user: authUser } = useContext(AuthContext); // Basic user info from context if needed
//     const [profileData, setProfileData] = useState(null);
//     const [formData, setFormData] = useState({}); // For edit form
//     const [isLoading, setIsLoading] = useState(true);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);

//     // Fetch profile data on load
//     useEffect(() => {
//         const fetchProfile = async () => {
//             setIsLoading(true);
//             setError(null);
//             try {
//                 const data = await getUserProfile();
//                 console.log("Fetched Profile Data from API:", JSON.stringify(data, null, 2));
//                 if (data) {
//                     setProfileData(data);
//                     // Initialize form data only when profile is loaded
//                     setFormData({
//                         firstName: data.firstName || '',
//                         lastName: data.lastName || '',
//                         phone: data.phone || '',
//                         // Address fields - Assuming your GET /profile returns these nested or flat
//                         // Adjust based on your actual API response structure
//                         street: data.address?.street || data.street || '',
//                         apt: data.address?.apt || data.apt || '',
//                         city: data.address?.city || data.city || '',
//                         country: data.address?.country || data.country || '',
//                         zip: data.address?.zip || data.zip || '',
//                     });
//                 } else {
//                     throw new Error("Profile data not found.");
//                 }
//             } catch (err) {
//                 setError(err.message || "Failed to load profile.");
//                 setProfileData(null); // Clear data on error
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProfile();
//     }, []); // Fetch only once on mount

//     // Handle input changes in the edit form
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle saving the updated profile
//     const handleSave = async (e) => {
//         e.preventDefault();
//         setIsSaving(true);
//         setError(null);
//         setSuccessMessage(null);

//         // Structure data for PUT /api/user/profile
//         // Adjust based on what your API expects (flat or nested address?)
//         const updatePayload = {
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             phone: formData.phone,
//             // Assuming API expects flat structure matching form state:
//             street: formData.street,
//             apt: formData.apt,
//             city: formData.city,
//             country: formData.country,
//             zip: formData.zip,
//             // OR if API expects nested address:
//             // address: {
//             //     street: formData.street,
//             //     apt: formData.apt,
//             //     city: formData.city,
//             //     country: formData.country,
//             //     zip: formData.zip,
//             // }
//         };

//         try {
//             const result = await updateUserProfile(updatePayload);
//             if (result.success) {
//                 setSuccessMessage(result.message || "Profile updated successfully!");
//                 // Update local profile data state after successful save
//                 // NOTE: Ideally, getUserProfile should be re-fetched for consistency,
//                 // but for simplicity, we update local state directly here.
//                 setProfileData(prev => ({ ...prev, ...updatePayload })); // Adjust if payload structure differs
//                 setIsEditing(false); // Exit edit mode
//             } else {
//                 setError(result.message || "Failed to update profile.");
//             }
//         } catch (err) {
//             setError(err.message || "An unexpected error occurred.");
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     // Helper to display profile data or skeleton
//     const renderField = (label, value) => (
//         <div className="mb-3">
//             <Label className="text-sm text-gray-500">{label}</Label>
//             {isLoading ? (
//                 <Skeleton className="h-6 w-3/4 mt-1" />
//             ) : (
//                 <p className="text-base text-gray-800">{value || '-'}</p>
//             )}
//         </div>
//     );

//     // Helper to render form input
//     const renderInput = (name, label, type = "text") => (
//         <div>
//             <Label htmlFor={name}>{label}</Label>
//             <Input
//                 id={name}
//                 name={name}
//                 type={type}
//                 value={formData[name] || ''}
//                 onChange={handleChange}
//                 disabled={isSaving}
//                 className="mt-1"
//                 required={['firstName', 'lastName', 'street', 'city', 'country', 'zip'].includes(name)} // Example required fields
//             />
//         </div>
//     );

//     return (
//         <Card className="max-w-2xl mx-auto shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between">
//                 <div>
//                     <CardTitle className="text-2xl">Your Profile</CardTitle>
//                     <CardDescription>View and manage your personal details.</CardDescription>
//                 </div>
//                 {!isEditing && !isLoading && profileData && (
//                     <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
//                         <Edit className="mr-2 h-4 w-4" /> Edit Profile
//                     </Button>
//                 )}
//             </CardHeader>

//             <form onSubmit={handleSave}>
//                 <CardContent>
//                     {error && !isSaving && ( // Show fetch error only if not currently saving
//                         <Alert variant="destructive" className="mb-4">
//                             <Terminal className="h-4 w-4" />
//                             <AlertTitle>Error</AlertTitle>
//                             <AlertDescription>{error}</AlertDescription>
//                         </Alert>
//                     )}
//                      {successMessage && ( // Show success message from save
//                         <Alert variant="default" className="bg-green-50 border-green-300 text-green-800 mb-4">
//                             <CheckCircle className="h-4 w-4 text-green-600" />
//                             <AlertTitle>Success</AlertTitle>
//                             <AlertDescription>{successMessage}</AlertDescription>
//                         </Alert>
//                     )}

//                     {isEditing ? (
//                         // --- Edit Mode ---
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {renderInput('firstName', 'First Name')}
//                                 {renderInput('lastName', 'Last Name')}
//                             </div>
//                             {renderInput('phone', 'Phone Number', 'tel')}

//                             <h3 className="text-lg font-semibold pt-4 border-t">Address</h3>
//                             {renderInput('street', 'Street Address')}
//                             {renderInput('apt', 'Apt/Suite/Other (Optional)')}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 {renderInput('city', 'City')}
//                                 {renderInput('country', 'Country')}
//                                 {renderInput('zip', 'Zip Code')}
//                             </div>
//                              {error && isSaving && ( // Show save error specifically here
//                                  <Alert variant="destructive" className="mt-2">
//                                      <Terminal className="h-4 w-4" />
//                                      <AlertTitle>Save Error</AlertTitle>
//                                      <AlertDescription>{error}</AlertDescription>
//                                  </Alert>
//                              )}
//                         </div>
//                     ) : (
//                         // --- View Mode ---
//                         <div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//                                 {renderField('First Name', profileData?.firstName)}
//                                 {renderField('Last Name', profileData?.lastName)}
//                                 {renderField('Email', profileData?.email)} {/* Assuming email is in profile */}
//                                 {renderField('Phone Number', profileData?.phone)}
//                                 {renderField('Date of Birth', profileData?.dob ? new Date(profileData.dob).toLocaleDateString() : '-')}
//                                 {renderField('SSN', `***-**-${profileData?.ssn?.slice(-4) || '****'}`)} {/* Mask SSN */}
//                             </div>
//                              <h3 className="text-lg font-semibold pt-4 mt-4 border-t">Address</h3>
//                              {renderField('Street Address', profileData?.address?.street || profileData?.street)}
//                              {renderField('Apt/Suite/Other', profileData?.address?.apt || profileData?.apt)}
//                              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
//                                  {renderField('City', profileData?.address?.city || profileData?.city)}
//                                  {renderField('Country', profileData?.address?.country || profileData?.country)}
//                                  {renderField('Zip Code', profileData?.address?.zip || profileData?.zip)}
//                              </div>
//                         </div>
//                     )}
//                 </CardContent>

//                 {isEditing && (
//                     <CardFooter className="border-t pt-4 flex justify-end space-x-2">
//                         <Button
//                             type="button" // Important: Prevents accidental form submission
//                             variant="outline"
//                             onClick={() => {
//                                 setIsEditing(false);
//                                 setError(null); // Clear errors when cancelling
//                                 setSuccessMessage(null);
//                                 // Optionally reset formData to profileData if changes shouldn't persist
//                                 // setFormData({ ...initial form data from profileData ... });
//                             }}
//                             disabled={isSaving}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={isSaving}>
//                             {isSaving ? (
//                                 <> <Save className="mr-2 h-4 w-4 animate-spin" /> Saving... </>
//                             ) : (
//                                 <> <Save className="mr-2 h-4 w-4" /> Save Changes </>
//                             )}
//                         </Button>
//                     </CardFooter>
//                 )}
//             </form>
//         </Card>
//     );
// }



// src/pages/ProfilePage.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/features/user'; // API functions

// Import Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, Edit, Save } from "lucide-react"; // Icons

export default function ProfilePage() {
    const { user: authUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Fetch profile data on load
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getUserProfile();
                console.log("Fetched Profile Data from API:", JSON.stringify(data, null, 2)); // Keep this log for verification

                if (data) {
                    setProfileData(data);
                    // Initialize form data with fields we *can* edit
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        phone: data.phone || '',
                        // Initialize the single address string field
                        address: data.address || '',
                        // We are NOT initializing separate address fields anymore
                        // We are also NOT including dob/ssn in editable form data for now
                    });
                } else {
                    throw new Error("Profile data not found.");
                }
            } catch (err) {
                setError(err.message || "Failed to load profile.");
                setProfileData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Handle input changes in the edit form
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle saving the updated profile
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        // Structure data for PUT /api/user/profile
        // Send only the fields that are editable in the form
        const updatePayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address, // Send the single address string
            // DO NOT send individual street, apt, city etc.
            // DO NOT send dob, ssn unless you add them to the edit form
        };

        try {
            const result = await updateUserProfile(updatePayload);
            if (result.success) {
                setSuccessMessage(result.message || "Profile updated successfully!");
                // Update local profile data state
                setProfileData(prev => ({
                    ...prev, // Keep existing data like email, dob, ssn
                    ...updatePayload // Overwrite with updated fields
                }));
                setIsEditing(false);
            } else {
                setError(result.message || "Failed to update profile.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to display profile data or skeleton
    const renderField = (label, value, isMasked = false) => (
        <div className="mb-3">
            <Label className="text-sm text-gray-500">{label}</Label>
            {isLoading ? (
                <Skeleton className="h-6 w-3/4 mt-1" />
            ) : (
                 // Apply masking if needed (like for SSN)
                 <p className="text-base text-gray-800">
                     {isMasked && value ? `***-**-${value.slice(-4)}` : (value || '-')}
                 </p>
            )}
        </div>
    );

    // Helper to render form input
    const renderInput = (name, label, type = "text") => (
        <div>
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                value={formData[name] || ''}
                onChange={handleChange}
                disabled={isSaving}
                className="mt-1"
                required={['firstName', 'lastName'].includes(name)} // Only make name required
            />
        </div>
    );

     // Helper to render form textarea
     const renderTextarea = (name, label, rows = 3) => (
        <div>
            <Label htmlFor={name}>{label}</Label>
            <Textarea
                id={name}
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                disabled={isSaving}
                className="mt-1"
                rows={rows}
                 required={name === 'address'} // Make address required if needed
            />
        </div>
    );


    return (
        <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl">Your Profile</CardTitle>
                    <CardDescription>View and manage your personal details.</CardDescription>
                </div>
                {!isEditing && !isLoading && profileData && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                )}
            </CardHeader>

            <form onSubmit={handleSave}>
                <CardContent>
                    {/* Error and Success Messages */}
                    {error && !isSaving && (
                        <Alert variant="destructive" className="mb-4">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                     {successMessage && (
                        <Alert variant="default" className="bg-green-50 border-green-300 text-green-800 mb-4">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    {isEditing ? (
                        // --- Edit Mode ---
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderInput('firstName', 'First Name')}
                                {renderInput('lastName', 'Last Name')}
                            </div>
                            {renderInput('phone', 'Phone Number', 'tel')}

                            {/* Use Textarea for the single address field */}
                            {renderTextarea('address', 'Full Address', 4)}

                             {error && isSaving && ( // Show save error specifically here
                                 <Alert variant="destructive" className="mt-2">
                                     <Terminal className="h-4 w-4" />
                                     <AlertTitle>Save Error</AlertTitle>
                                     <AlertDescription>{error}</AlertDescription>
                                 </Alert>
                             )}
                        </div>
                    ) : (
                        // --- View Mode ---
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                {renderField('First Name', profileData?.firstName)}
                                {renderField('Last Name', profileData?.lastName)}
                                {renderField('Email', profileData?.email)}
                                {renderField('Phone Number', profileData?.phone)}
                                {renderField('Date of Birth', profileData?.dob ? new Date(profileData.dob).toLocaleDateString() : '-')}
                                {/* Pass SSN value directly, masking is handled in renderField */}
                                {renderField('SSN', profileData?.ssn, true)}
                            </div>
                             <h3 className="text-lg font-semibold pt-4 mt-4 border-t">Address</h3>
                             {/* Display the single address string */}
                             {isLoading ? (
                                 <Skeleton className="h-10 w-full mt-1" />
                             ) : (
                                 <p className="text-base text-gray-800 whitespace-pre-line">{profileData?.address || '-'}</p>
                             )}
                        </div>
                    )}
                </CardContent>

                {isEditing && (
                    <CardFooter className="border-t pt-4 flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setError(null);
                                setSuccessMessage(null);
                                // Reset form data back to profile data on cancel
                                setFormData({
                                     firstName: profileData?.firstName || '',
                                     lastName: profileData?.lastName || '',
                                     phone: profileData?.phone || '',
                                     address: profileData?.address || '',
                                 });
                            }}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving... </> // Changed icon
                            ) : (
                                <> <Save className="mr-2 h-4 w-4" /> Save Changes </>
                            )}
                        </Button>
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}
// src/pages/admin/AdminBranchManagement.jsx
import { useState, useEffect } from 'react';
import {
    adminGetAllBranches,
    adminGetAllAdminUsers,
    adminCreateBranch,
    adminUpdateBranch
} from '@/features/admin'; // Adjust path if you created branches.js

// Shadcn UI imports (add table, dialog, select, input, etc. via CLI)
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import  Button  from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import  Input  from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Terminal, Building, PlusCircle, Edit, Save } from 'lucide-react';
import { toast } from 'react-hot-toast'; // If not already used

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium' }); }
    catch { return dateString; }
};

export default function AdminBranchManagement() {
    // List State
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dialog/Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentBranch, setCurrentBranch] = useState(null); // null for create, object for edit
    const [formData, setFormData] = useState({ name: '', location: '', manager_id: '' });
    const [dialogError, setDialogError] = useState(null);

    // Manager Dropdown State
    const [admins, setAdmins] = useState([]);
    const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

    // Fetch branches function
    const fetchBranches = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminGetAllBranches();
            setBranches(data);
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

     // Fetch admin users function (for manager dropdown)
     const fetchAdmins = async () => {
        setIsLoadingAdmins(true);
        try {
            const data = await adminGetAllAdminUsers();
            setAdmins(data);
        } catch (err) {
             toast.error("Could not load list of potential managers.");
             // Handle error appropriately, maybe disable manager selection
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchBranches();
        fetchAdmins();
    }, []);

    // --- Dialog and Form Handlers ---

    const handleOpenDialog = (branch = null) => {
        setCurrentBranch(branch); // Set the branch to edit, or null for create mode
        setDialogError(null); // Clear previous errors
        if (branch) {
            // Edit mode: Populate form with existing branch data
            setFormData({
                name: branch.name || '',
                location: branch.location || '',
                // Ensure manager_id is a string for Select component, handle null
                manager_id: branch.manager_id !== null ? String(branch.manager_id) : ''
            });
        } else {
            // Create mode: Reset form
            setFormData({ name: '', location: '', manager_id: '' });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setCurrentBranch(null);
        setFormData({ name: '', location: '', manager_id: '' });
        setDialogError(null);
    };

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleManagerChange = (value) => {
         // value will be the string representation of the ID, or "" if unselected
        setFormData(prev => ({ ...prev, manager_id: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setDialogError(null);

        // Prepare data: convert manager_id back to number or null
        const payload = {
            name: formData.name,
            location: formData.location || null, // Send null if empty
            manager_id: formData.manager_id ? parseInt(formData.manager_id, 10) : null
        };

        try {
            if (currentBranch?.id) {
                // Update existing branch
                await adminUpdateBranch(currentBranch.id, payload);
            } else {
                // Create new branch
                await adminCreateBranch(payload);
            }
            fetchBranches(); // Refresh the list
            handleCloseDialog(); // Close dialog on success
        } catch (err) {
            setDialogError(err.message || "Failed to save branch.");
            // Toast error already shown in API function
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="w-6 h-6" />
                            Manage Branches
                        </CardTitle>
                        <CardDescription>Add, view, and edit bank branches.</CardDescription>
                    </div>
                     {/* --- Trigger Button for Dialog --- */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                         <DialogTrigger asChild>
                             <Button size="sm" onClick={() => handleOpenDialog(null)}>
                                 <PlusCircle className="mr-2 h-4 w-4" /> Add Branch
                             </Button>
                         </DialogTrigger>
                         {/* --- Dialog Content --- */}
                         <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => { if(isSaving) e.preventDefault(); }}> {/* Prevent closing while saving */}
                             <DialogHeader>
                                 <DialogTitle>{currentBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
                                 <DialogDescription>
                                     {currentBranch ? 'Update the details for this branch.' : 'Enter the details for the new branch.'}
                                 </DialogDescription>
                             </DialogHeader>
                             <div className="grid gap-4 py-4">
                                 {/* Form Error Display */}
                                {dialogError && (
                                    <Alert variant="destructive">
                                        <Terminal className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{dialogError}</AlertDescription>
                                    </Alert>
                                )}
                                 {/* Branch Name */}
                                 <div className="grid grid-cols-4 items-center gap-4">
                                     <Label htmlFor="name" className="text-right">Name</Label>
                                     <Input
                                         id="name"
                                         name="name"
                                         value={formData.name}
                                         onChange={handleFormChange}
                                         className="col-span-3"
                                         required
                                         disabled={isSaving}
                                     />
                                 </div>
                                  {/* Branch Location */}
                                 <div className="grid grid-cols-4 items-center gap-4">
                                     <Label htmlFor="location" className="text-right">Location</Label>
                                     <Input
                                         id="location"
                                         name="location"
                                         value={formData.location}
                                         onChange={handleFormChange}
                                         className="col-span-3"
                                         placeholder="e.g., City, State or Address"
                                         disabled={isSaving}
                                     />
                                 </div>
                                 {/* Branch Manager */}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                     <Label htmlFor="manager_id" className="text-right">Manager</Label>
                                     <Select
                                        value={formData.manager_id}
                                        onValueChange={handleManagerChange}
                                        disabled={isSaving || isLoadingAdmins} // Disable while loading/saving
                                     >
                                         <SelectTrigger id="manager_id" className="col-span-3">
                                             <SelectValue placeholder={isLoadingAdmins ? "Loading managers..." : "Select a manager (Optional)"} />
                                         </SelectTrigger>
                                         <SelectContent>
                                              {/* Option to unassign manager */}
                                             <SelectItem value="">-- Unassign Manager --</SelectItem>
                                             {admins.map(admin => (
                                                 <SelectItem key={admin.id} value={String(admin.id)}> {/* Value must be string */}
                                                     {admin.first_name} {admin.last_name} ({admin.email})
                                                 </SelectItem>
                                             ))}
                                         </SelectContent>
                                     </Select>
                                 </div>
                             </div>
                             <DialogFooter>
                                  {/* Use DialogClose for Cancel button */}
                                 <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
                                 </DialogClose>
                                 <Button type="button" onClick={handleSave} disabled={isSaving || !formData.name}> {/* Disable if saving or no name */}
                                     {isSaving ? (
                                         <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                     ) : (
                                         <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                                     )}
                                 </Button>
                             </DialogFooter>
                         </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                        </div>
                    )}
                    {error && !isLoading && (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error Loading Branches</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {!isLoading && !error && branches.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No branches found. Add one to get started.</p>
                    )}
                    {!isLoading && !error && branches.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Manager</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.map((branch) => (
                                    <TableRow key={branch.id}>
                                        <TableCell>{branch.id}</TableCell>
                                        <TableCell className="font-medium">{branch.name}</TableCell>
                                        <TableCell>{branch.location || '-'}</TableCell>
                                        <TableCell>{branch.manager_name || <span className="text-gray-400 italic">Unassigned</span>}</TableCell>
                                        <TableCell>{formatDate(branch.created_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(branch)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                             {/* Add Delete button later if needed */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
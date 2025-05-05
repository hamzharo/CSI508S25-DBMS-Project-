// client/src/components/RegisterForm.jsx - CORRECTED AND COMPLETED
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust path if needed

// Add the email prop if it's passed from VerifyEmail (though the verify flow needs fixing too)
export default function RegisterForm({ email: initialEmail }) {
    const [formData, setFormData] = useState({
        email: initialEmail || "", // Use initial email if provided, otherwise empty
        firstName: "",
        lastName: "",
        dob: "", // Date of Birth - Consider a date picker or format constraint
        citizenship: "",
        ssn: "",
        gender: "", // Consider a select dropdown
        phone: "",
        // Address fields - separate for structured API
        address: "", // This seems redundant with street/apt/city/country/zip in the API
        street: "",
        apt: "",
        city: "",
        country: "",
        zip: "",
        localAddressSame: true, // Start as true, use a checkbox
        // --- API fields end here ---
        password: "",
        confirmPassword: "", // Not sent to API, used for validation
        termsAccepted: false, // Not sent to API, used for validation
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Local loading state
    const navigate = useNavigate();

    // --- Get the register function from AuthContext ---
    const { register } = useContext(AuthContext);
    // ---

    // Generic handler for text/number inputs
    const handleChange = (e) => {
      console.log('handleChange received:', e);

      // Check if 'e' looks like a standard browser event object
      if (e && e.target && typeof e.target === 'object') {
        console.log('Looks like a standard event.');
        const name = e.target.name;
        const value = e.target.value;
        console.log(`  e.target.name: '${name}'`);
        console.log(`  e.target.value: '${value}'`);

        // Basic check: Ensure name is a non-empty string before updating state
        if (name) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            console.error("handleChange Error: Received event target without a 'name' attribute.", e.target);
        }

      } else {
        // If 'e' is not a standard event, log it and try to figure out what it is.
        // This branch is likely if the Input component passes only value or name.
        console.warn("handleChange Warning: Received something other than a standard event object. Check the implementation of the Input component.", e);
        // --- You might need to adjust state update logic here based on what 'e' actually is ---
        // Example if Input passes only the value: (This would require knowing the field name somehow)
        // console.log("Attempting state update based on non-standard event might fail without field name.");
        // Example if Input passes an object like { name: 'field', value: 'val' }
        // if (typeof e === 'object' && e !== null && e.name && typeof e.value !== 'undefined') {
        //     setFormData((prevData) => ({ ...prevData, [e.name]: e.value }));
        // }
      }
      // --- END DETAILED LOGS ---
      const { name, value } = e.target;
      // console.log(`Changing ${name} to ${value}`); // Debugging log
      setFormData((prevData) => ({
            ...prevData,
            [name]: value,
      }));
    };

    // Handler specifically for the Radix Checkbox (terms and localAddressSame)
    // Radix Checkbox onCheckedChange passes a boolean (true/false/'indeterminate')
    const handleCheckboxChange = (name, checked) => {
         setFormData((prevData) => ({
            ...prevData,
            [name]: checked === true, // Ensure it's a boolean true/false
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.termsAccepted) {
            setError("You must accept the Terms & Conditions");
            return;
        }

        setIsLoading(true); // Set loading state

        // --- Use the register function from context ---
        // Exclude confirmPassword and termsAccepted from the data sent to backend
        const { confirmPassword, termsAccepted, ...userDataToSend } = formData;

        // Ensure localAddressSame is a boolean
        userDataToSend.localAddressSame = Boolean(userDataToSend.localAddressSame);

        // Note: The API has 'address' but also 'street', 'apt', etc.
        // You might need to decide if 'address' is the combination of the others
        // or a separate field. For now, we'll send all of them as in the API structure.

        // Optional: Basic validation for required fields if not handled by 'required' attribute
        // and if the backend doesn't return specific field errors well.

        const result = await register(userDataToSend); // Pass the relevant form data
        // ---

        setIsLoading(false); // Unset loading state

        if (result.success) {
            // Registration successful! Backend sends verification email.
            setError(null); // Clear any previous errors
            alert("Registration successful! Please check your email (including spam folder) to verify your account before logging in.");
            // Navigate to a page telling them to check email or back home
             navigate('/'); // Or navigate('/check-email-notice');
        } else {
             // Backend returned an error (e.g., email already exists)
            setError(result.message || "Registration failed. Please try again.");
        }
    };

    console.log('State:', formData)

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Complete Registration</h2>
             {error && <p className="text-red-500 text-center mb-4">{error}</p>}
             <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email Field (Only if not pre-filled) */}
                {!initialEmail && (
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email" // Important!
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                )}


                {/* Basic Info */}
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
                </div>
                 <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    {/* Consider using type="date" but note browser support/formatting */}
                    <Input id="dob" type="date" name="dob" placeholder="YYYY-MM-DD" required value={formData.dob} onChange={handleChange} />
                </div>
                 <div>
                    <Label htmlFor="citizenship">Citizenship</Label>
                    <Input id="citizenship" type="text" name="citizenship" required value={formData.citizenship} onChange={handleChange} />
                </div>
                 <div>
                    <Label htmlFor="ssn">SSN</Label>
                    <Input id="ssn" type="text" name="ssn" required value={formData.ssn} onChange={handleChange} />
                </div>
                 <div>
                    <Label htmlFor="gender">Gender</Label>
                     {/* Consider a select dropdown for controlled vocabulary */}
                    <Input id="gender" type="text" name="gender" required value={formData.gender} onChange={handleChange} />
                </div>
                 <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                </div>

                {/* Address Info */}
                <fieldset className="border p-4 rounded space-y-3">
                    <legend className="text-lg font-semibold">Address</legend>
                    {/* Note: 'address' field in API might be compound. Added here as per API structure */}
                     <div>
                        <Label htmlFor="address">Full Address Line (Optional)</Label>
                        <Input id="address" type="text" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input id="street" type="text" name="street" required value={formData.street} onChange={handleChange} />
                    </div>
                     <div>
                        <Label htmlFor="apt">Apt/Suite/Other (Optional)</Label>
                        <Input id="apt" type="text" name="apt" value={formData.apt} onChange={handleChange} />
                    </div>
                     <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" type="text" name="city" required value={formData.city} onChange={handleChange} />
                    </div>
                     <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" type="text" name="country" required value={formData.country} onChange={handleChange} />
                    </div>
                     <div>
                        <Label htmlFor="zip">Zip Code</Label>
                        <Input id="zip" type="text" name="zip" required value={formData.zip} onChange={handleChange} />
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox
                            id="localAddressSame"
                            checked={formData.localAddressSame}
                            onCheckedChange={(checked) => handleCheckboxChange('localAddressSame', checked)} // Use specific handler for this checkbox
                        />
                        <Label htmlFor="localAddressSame" className="cursor-pointer">
                            Is local address same as primary address?
                        </Label>
                    </div>
                </fieldset>


                {/* Password Fields */}
                <fieldset className="border p-4 rounded space-y-3">
                     <legend className="text-lg font-semibold">Password</legend>
                    <div>
                        <Label htmlFor="password">Create Password</Label>
                        <Input id="password" type="password" name="password" required value={formData.password} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                </fieldset>


                 {/* Terms & Conditions Checkbox */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked)} // Use specific handler for this checkbox
                        required // HTML required attribute for checkbox
                    />
                    <Label htmlFor="terms" className="cursor-pointer"> {/* Make label clickable */}
                        I accept the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Terms & Conditions</a>
                    </Label>
                </div>


                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </Button>
                
                <p>
                  <Link to="/" className="text-gray-500 hover:text-blue-500 hover:underline">
                    ← Back to Home
                  </Link>
                 </p>

            </form>
        </div>
    );
}




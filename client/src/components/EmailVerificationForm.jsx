import { sendVerificationEmail } from "../utils/api";
import Input  from "./ui/Input";
import  Button  from "./ui/Button";
import  {Label}  from "./ui/Label";
import  {useState}  from "react";

export default function EmailVerificationForm({ onVerified }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    setLoading(true);
    const response = await sendVerificationEmail(email);
    
    setLoading(false);

    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Verification email sent! Check your inbox.");
      onVerified(email);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
      <Label htmlFor="email">Email Address</Label>
      <Input 
        id="email" 
        type="email" 
        placeholder="Enter your email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      <Button onClick={handleSendEmail} className="mt-4 w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Verification Email"}
      </Button>
    </div>
  );
}

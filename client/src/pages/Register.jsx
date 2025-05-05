// client/src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { sendVerificationEmail } from "../utils/api";
// import Input from "../components/ui/Input";
// import Button from "../components/ui/Button";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleEmailSubmit = async () => {
//     try {
//       const res = await sendVerificationEmail({ email });
//       setMessage(res.message || "Verification link sent.");
//     } catch (err) {
//       setMessage("Something went wrong. Please try again.");
//     }
//   };

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Start Registration</h2>
      {/* <Input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleEmailSubmit} className="mt-3">
        Send Verification Link
      </Button> */}
      <RegisterForm />
      {/* {message && <p className="mt-4 text-sm text-gray-600">{message}</p>} */}

    </div>
    
  );
  
}


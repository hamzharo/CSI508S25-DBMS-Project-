// client/src/components/Navbar.jsx
// import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-lg font-bold">Online Bank Management</h1>
      <div>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/register">Register</Link>
        
      </div>
    </nav>
  );
}

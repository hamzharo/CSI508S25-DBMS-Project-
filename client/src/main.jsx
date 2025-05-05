// client/src/main.jsx
// import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Ensure TailwindCSS is imported
// main.jsx - for DEFAULT export in AuthContext.jsx
import AuthProvider from "./context/AuthContext";


console.log("Frontend is loading...");

ReactDOM.createRoot(document.getElementById("root")).render(
 // <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  //</React.StrictMode>
);

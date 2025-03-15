import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Leads from "./pages/Leads";
import Callers from "./pages/Callers";
import Sales from "./pages/Sales";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (token && userRole) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === "admin");
    }
  }, []);

  const handleAuth = async (email, password, name = "", role = "employee", navigate) => {
    try {
      const endpoint = name ? "register" : "login";
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.authToken);
        localStorage.setItem("userRole", data.role);
        setIsAuthenticated(true);
        setIsAdmin(data.role === "admin");
        navigate(data.role === "admin" ? "/admin" : "/");
        return true;
      } else {
        const errorData = await response.json();
        console.error(errorData.msg || "Authentication failed");
        return false;
      }
    } catch (error) {
      console.error("Authentication failed", error);
      return false;
    }
  };

  return (
    
    <Router>
    <AuthProvider>
      {isAuthenticated ? (
        <div className="app-container">
          <div className="main-content">
            <Navbar isAdmin={isAdmin} />
            <main className="content-area">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/callers" element={<Callers />} />
                <Route path="/sales" element={<Sales />} />
                <Route 
                  path="/admin" 
                  element={
                    isAdmin ? (
                      <AdminPanel />
                    ) : (
                      <Navigate to="/admin-login" replace />
                    )
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onAuth={handleAuth} />} />
          <Route path="/signup" element={<Signup onAuth={handleAuth} />} />
          <Route 
            path="/admin-login" 
            element={<AdminLogin onAuth={handleAuth} />} 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </AuthProvider>
    </Router>
    
  );
}

export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Leads from "./pages/Leads";
import Callers from "./pages/Callers";
import Sales from "./pages/Sales";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin"; // Create this new component
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAuth = (email, password, isAdminLogin = false) => {
    if (isAdminLogin) {
      // Admin authentication
      if (email === "admin@crm.com" && password === "admin123") {
        setIsAuthenticated(true);
        setIsAdmin(true);
        return true;
      }
      return false;
    } else {
      // Regular user authentication
      setIsAuthenticated(true);
      setIsAdmin(false);
      return true;
    }
  };

  return (
    <Router>
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
    </Router>
  );
}

export default App;

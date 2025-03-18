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
import AccountsDashboard from "./pages/AccountsDashboard"; // Import AccountsDashboard
import OperationsDashboard from "./pages/OperationsDashboard"; // Import OperationsDashboard
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import toast from "react-hot-toast";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employeeType, setEmployeeType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const empType = localStorage.getItem("employeeType");
    if (token && userRole) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === "admin");
      setEmployeeType(empType);
    }
  }, []);

  const handleAuth = async (email, password, name = "", role = "employee", type = "") => {
    try {
      const endpoint = name ? "register" : "login";
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role, type }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.authToken);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("employeeType", type);
        setIsAuthenticated(true);
        setIsAdmin(data.role === "admin");
        setEmployeeType(type);
        toast.success("Logged in successfully.");
        // Force full page reload on redirection:
        window.location.href = data.role === "admin" ? "/admin" : "/";
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.msg || "Authentication failed");
        return false;
      }
    } catch (error) {
      toast.error("Authentication failed");
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
                  <Route path="/leads" element={employeeType === "accounts" ? <AccountsDashboard /> : employeeType === "operations" ? <OperationsDashboard /> : <Leads />} />
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
                  <Route path="/accounts" element={<AccountsDashboard />} /> {/* Add accounts dashboard route */}
                  <Route path="/operations" element={<OperationsDashboard />} /> {/* Add operations dashboard route */}
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

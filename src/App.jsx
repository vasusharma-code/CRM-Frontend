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
import AccountsDashboard from "./pages/AccountsDashboard"; // Accounts dashboard
import OperationsDashboard from "./pages/OperationsDashboard"; // Operations dashboard
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import toast from "react-hot-toast";
import "./App.css";

const API_URL = "http://localhost:3000";
window.API_URL = API_URL;

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
      const response = await fetch(`${window.API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role, type }),
      });

      if (response.ok) {
        const data = await response.json();
        // Use the employeeType from data if available, else fallback to the provided type
        const employeeTypeReturned = data.employeeType || type;

        localStorage.setItem("token", data.authToken);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("name", data.name || name);
        localStorage.setItem("email", email);
        localStorage.setItem("employeeType", employeeTypeReturned);
        setIsAuthenticated(true);
        setIsAdmin(data.role === "admin");
        setEmployeeType(employeeTypeReturned);
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
                  {/* Home Route: show AccountsDashboard if employeeType is accounts, OperationsDashboard if operations, else default Dashboard */}
                  <Route
                    path="/"
                    element={
                      employeeType === "accounts" ? (
                        <AccountsDashboard />
                      ) : employeeType === "operations" ? (
                        <OperationsDashboard />
                      ) : (
                        <Dashboard />
                      )
                    }
                  />
                  {/* Leads Route: if sales -> Leads; if accounts or operations, show corresponding dashboard */}
                  <Route
                    path="/leads"
                    element={
                      employeeType === "sales" ? (
                        <Leads />
                      ) : employeeType === "accounts" ? (
                        <AccountsDashboard />
                      ) : employeeType === "operations" ? (
                        <OperationsDashboard />
                      ) : (
                        <Dashboard />
                      )
                    }
                  />
                  <Route path="/callers" element={<Callers />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route
                    path="/admin"
                    element={
                      isAdmin ? <AdminPanel /> : <Navigate to="/admin-login" replace />
                    }
                  />
                  <Route path="/accounts" element={<AccountsDashboard />} /> 
                  <Route path="/operations" element={<OperationsDashboard />} /> 
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onAuth={handleAuth} />} />
            <Route path="/signup" element={<Signup onAuth={handleAuth} />} />
            <Route path="/admin-login" element={<AdminLogin onAuth={handleAuth} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </AuthProvider>
    </Router>
  );
}

export default App;

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
import AccountsDashboard from "./pages/AccountsDashboard";
import OperationsDashboard from "./pages/OperationsDashboard";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import toast from "react-hot-toast";
import "./App.css";
import ViewProof from "./pages/ViewProof"; // Ensure ViewProof is imported

// Set API base URL globally
const API_URL = "http://13.201.101.170";
window.API_URL = API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employeeType, setEmployeeType] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const empType = localStorage.getItem("employeeType");

    if (token && userRole) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === "admin");
      setEmployeeType(empType || "");
    }

    setIsLoading(false); // Done loading
  }, []);

  // Handle Login/Signup
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

        // Full page reload to re-trigger routing
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

  // While loading auth info
  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <AuthProvider>
        {isAuthenticated ? (
          <div className="app-container">
            <div className="main-content">
              <Navbar isAdmin={isAdmin} />
              <main className="content-area">
                <Routes>
                  {/* Home Route */}
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

                  {/* Leads Route - now always shows <Leads /> */}
                  <Route path="/leads" element={<Leads />} />

                  {/* Other Routes */}
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
                  <Route path="/view-proof" element={<ViewProof />} /> {/* Ensure this route is defined */}

                  {/* Fallback */}
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

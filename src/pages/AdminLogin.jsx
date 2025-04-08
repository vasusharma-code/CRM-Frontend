import React, { useState } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AdminLogin = ({ onAuth }) => {
  const navigate = useNavigate();
  const { credentials, setCredentials } = useAuth();
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAuth(credentials.email, credentials.password, "", "admin");
    if (success) {
      toast.success("Admin login successful!");
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const response = await fetch(`${window.API_URL}/api/admin/addLeads`, { // updated endpoint
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (response.ok) {
        toast.success("Leads added successfully");
      } else {
        toast.error("Failed to add leads");
      }
    } catch (error) {
      toast.error("Failed to add leads");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="auth-container">
        <div className="auth-card">
          <h1>Admin Login</h1>
          <p className="subtitle">Please enter your admin credentials</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Admin Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Admin Password</label>
              <input 
                type="password" 
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required 
              />
            </div>

            <button type="submit" className="login-button">
              Sign in as Admin
            </button>
          </form>

          <p className="login-link">
            Not an admin? <Link to="/login">Regular Login</Link>
          </p>

          <h2 className="text-2xl font-bold mt-6">Upload Leads</h2>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <input type="file" onChange={handleFileChange} className="block" accept=".xlsx,.xls" />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"
            >
              {loading ? "Uploading..." : "Upload Leads"}
            </button>
          </form>
        </div>
      </div>
    </Router>
  );
};

export default AdminLogin;
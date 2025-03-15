import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import toast from "react-hot-toast";

const AdminLogin = ({ onAuth }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAuth(credentials.email, credentials.password, true, navigate);
    if (success) {
      toast.success("Admin login successful!");
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

  return (
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
      </div>
    </div>
  );
};

export default AdminLogin;
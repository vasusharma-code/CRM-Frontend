import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

const AdminLogin = ({ onAuth }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.email === "admin@crm.com" && credentials.password === "admin123") {
      onAuth(credentials.email, credentials.password, true);
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
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";


const Signup = ({ onAuth }) => {
  const navigate = useNavigate();
  const {credentials, setCredentials} = useAuth()
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAuth(credentials.email, credentials.password, credentials.name, credentials.role, credentials.type, navigate);
    if (success) {
      toast.success("Signup successful!");
    } else {
      setError("Signup failed");
    }
  };
  useEffect(() => {
    console.log(credentials)
  }, [credentials])
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Signup</h1>
        <p className="subtitle">Create a new account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={credentials.role}
              onChange={handleChange}
              required
            >
              <option value="employee">Employee</option>  
            </select>
          </div>

          {credentials.role === "employee" && (
            <div className="input-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={credentials.type}
                onChange={handleChange}
                required
              >
                <option value="sales">Sales</option>
                <option value="accounts">Accounts</option>
                <option value="operations">Operations</option>
              </select>
            </div>
          )}

          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

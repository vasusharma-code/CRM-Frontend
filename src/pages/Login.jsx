import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = ({ onAuth }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(credentials.email, credentials.password);
  };

  const handleAdminRedirect = () => {
    navigate('/admin-login');
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Please enter your details to sign in</p>
        
        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">Sign in</button>
        </form>

        <div className="admin-login-section">
          <button onClick={handleAdminRedirect} className="admin-login-button">
            Sign in as Admin
          </button>
        </div>

        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button className="social-button google">
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Google
            </button>
            <button className="social-button github">
              <img src="https://github.com/favicon.ico" alt="GitHub" />
              GitHub
            </button>
          </div>
        </div>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

const Signup = ({ onAuth }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup process
    onAuth && onAuth();
  };

  const handleGoogleSignup = () => {
    // Placeholder for Google signup integration
    onAuth && onAuth();
  };

  const handleGithubSignup = () => {
    // Placeholder for GitHub signup integration
    onAuth && onAuth();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="primary-button">Sign Up</button>
        </form>
        <div className="social-signup">
          <p>Or sign up with</p>
          <button className="social-button google" onClick={handleGoogleSignup}>
            Sign up with Google
          </button>
          <button className="social-button github" onClick={handleGithubSignup}>
            Sign up with GitHub
          </button>
        </div>
        <p className="alternative">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

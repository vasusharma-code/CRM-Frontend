import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ isAdmin }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2 className="logo">CRM Dashboard</h2>
        <button 
          className="mobile-menu" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <span className="icon">🏠</span>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/leads" className={location.pathname === "/leads" ? "active" : ""}>
            <span className="icon">📋</span>
            Leads
          </Link>
        </li>
        <li>
          <Link to="/callers" className={location.pathname === "/callers" ? "active" : ""}>
            <span className="icon">📞</span>
            Callers
          </Link>
        </li>
        <li>
          <Link to="/sales" className={location.pathname === "/sales" ? "active" : ""}>
            <span className="icon">💰</span>
            Sales
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
              <span className="icon">⚙️</span>
              Admin
            </Link>
          </li>
        )}
      </ul>

      <div className="nav-right">
        <div className="nav-profile">
          <img 
            src={`https://ui-avatars.com/api/?name=${isAdmin ? 'Admin' : 'User'}&background=667eea&color=fff`}
            alt="Profile" 
            className="profile-image"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

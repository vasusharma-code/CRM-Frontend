import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { LoaderIcon } from "react-hot-toast";
import "../styles/Navbar.css";

const Navbar = ({ isAdmin }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { logout } = useAuth(); // Ensure your AuthContext provides a user object containing name, email, role
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    // Fetch the user's profile (or use the user object from context if available)
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
        } else {
          toast.error("Failed to fetch user profile");
        }
      } catch (error) {
        toast.error("Failed to fetch user profile");
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2 className="logo">CRM Dashboard</h2>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
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
        <div className="nav-profile" onClick={toggleProfileDropdown}>
          <img 
            src={`https://ui-avatars.com/api/?name=${userName}&background=667eea&color=fff`}
            alt="Profile" 
            className="profile-image"
          />
        </div>
        {showProfileDropdown && (
          <div className="profile-dropdown">
            <p className="profile-name">{localStorage.getItem('name')}</p>
            <p className="profile-email">{localStorage.getItem('email')}</p>
            <p className="profile-role">{localStorage.getItem('userRole')}</p>
            <button className="dropdown-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

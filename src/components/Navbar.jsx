import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/Navbar.css";

const Navbar = ({ isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [employeeType, setEmployeeType] = useState("sales");

  useEffect(() => {
    const type = localStorage.getItem("employeeType") || "sales";
    setEmployeeType(type);

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${window.API_URL}/api/user/profile`, {
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

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2 className="logo">CRM Dashboard</h2>
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`} style={{ position: "relative", right: "10vw" }}>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            🏠 Dashboard
          </Link>
        </li>

        {employeeType === "sales" && (
          <>
            <li>
              <Link to="/leads" className={location.pathname === "/leads" ? "active" : ""}>
                📋 Leads
              </Link>
            </li>
            <li>
              <Link to="/sales" className={location.pathname === "/sales" ? "active" : ""}>
                💰 Sales
              </Link>
            </li>
          </>
        )}

        {employeeType === "accounts" && (
          <li>
            <Link to="/accounts" className={location.pathname === "/accounts" ? "active" : ""}>
              📊 Accounts
            </Link>
          </li>
        )}

        {employeeType === "operations" && (
          <li>
            <Link to="/operations" className={location.pathname === "/operations" ? "active" : ""}>
              ⚙️ Operations
            </Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
              🛠️ Admin
            </Link>
          </li>
        )}
      </ul>

      <div className="nav-right" style={{ position: "relative", right: "10vw" }}>
        <div className="nav-profile" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
          <img 
            src={`https://ui-avatars.com/api/?name=${userName}&background=1e3a8a&color=fff`}
            alt="Profile" 
            className="profile-image"
          />
        </div>

        {showProfileDropdown && (
          <div className="profile-dropdown open">
            <p>{localStorage.getItem("name")}</p>
            <p>{localStorage.getItem("email")}</p>
            <p>{employeeType}</p>
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

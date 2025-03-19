import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="common-navbar">
      <div className="common-navbar-container">
        <h1 className="common-navbar-title">{title}</h1>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="common-navbar-logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

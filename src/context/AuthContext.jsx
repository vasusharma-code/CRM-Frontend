import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally verify token on load
    const token = localStorage.getItem("token");
    if (token) {
      // You may call /auth/verify here to get user details
      setUser({ role: localStorage.getItem("userRole") });
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.authToken);
        localStorage.setItem("userRole", credentials.role);
        setUser({ role: credentials.role });
        toast.success("Logged in successfully.");
        navigate(credentials.role === "admin" ? "/admin" : "/employee");
        return true;
      } else {
        toast.error("Login failed.");
        return false;
      }
    } catch (error) {
      toast.error("Login failed.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

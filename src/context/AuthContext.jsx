import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (token && userRole) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === "admin");
    }
  }, []);

  const handleAuth = async (email, password, name = "", role = "employee") => {
    try {
      const endpoint = name ? "register" : "login";
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.authToken);
        localStorage.setItem("userRole", data.role);
        setIsAuthenticated(true);
        setIsAdmin(data.role === "admin");
        toast.success("Logged in successfully.");
        navigate(data.role === "admin" ? "/admin" : "/");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.msg || "Authentication failed");
        return false;
      }
    } catch (error) {
      toast.error("Authentication failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, handleAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        <li><Link to="/">🏠 Dashboard</Link></li>
        <li><Link to="/leads">📋 Leads</Link></li>
        <li><Link to="/callers">📞 Callers</Link></li>
        <li><Link to="/sales">💰 Sales</Link></li>
        <li><Link to="/admin">⚙️ Admin</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;

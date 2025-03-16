import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    assignedLeads: 0,
    unassignedLeads: 0,
    totalEmployees: 0,
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/dashboardStats", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        setStats(await response.json());
      } else {
        toast.error("Failed to load statistics");
      }
    } catch (error) {
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const intervalId = setInterval(fetchStats, 15000); // refresh every 15 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Budding Mariners CRM Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Leads</h3>
          <p>{stats.totalLeads}</p>
        </div>
        <div className="stat-card">
          <h3>Assigned Leads</h3>
          <p>{stats.assignedLeads}</p>
        </div>
        <div className="stat-card">
          <h3>Unassigned Leads</h3>
          <p>{stats.unassignedLeads}</p>
        </div>
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees}</p>
        </div>
      </div>
      <div className="recent-activities-section">
        <h3 className="recent-title">Recent Activities</h3>
        {stats.recentActivities.length > 0 ? (
          <ul className="activities-list">
            {stats.recentActivities.map((act, idx) => (
              <li key={idx} className="activity-item">
                <p className="activity-description">{act.description}</p>
                <p className="activity-timestamp">{new Date(act.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-activities">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../../styles/AdminDashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    assignedLeads: 0,
    unassignedLeads: 0,
    totalEmployees: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
    // Optionally refresh stats periodically
    const intervalId = setInterval(fetchStats, 15000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">Dashboard Overview</h2>
      <div className="admin-stats-container">
        <div className="admin-stat-card">
          <h3>Total Leads</h3>
          <p>{stats.totalLeads}</p>
        </div>
        <div className="admin-stat-card">
          <h3>Assigned Leads</h3>
          <p>{stats.assignedLeads}</p>
        </div>
        <div className="admin-stat-card">
          <h3>Unassigned Leads</h3>
          <p>{stats.unassignedLeads}</p>
        </div>
        <div className="admin-stat-card">
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees}</p>
        </div>
      </div>
      <div className="admin-recent-activities">
        <h3 className="admin-recent-title">Recent Activities</h3>
        {stats.recentActivities.length > 0 ? (
          <ul className="admin-activities-list">
            {stats.recentActivities.map((act, idx) => (
              <li key={idx} className="admin-activity-item">
                <p className="admin-activity-description">{act.description}</p>
                <p className="admin-activity-timestamp">{new Date(act.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-no-activities">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

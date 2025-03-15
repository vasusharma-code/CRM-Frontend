import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
      const response = await fetch("http://localhost:3000/api/admin/dashboard-stats", {
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
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Leads</h3>
          <p className="text-2xl">{stats.totalLeads}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Assigned Leads</h3>
          <p className="text-2xl">{stats.assignedLeads}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Unassigned Leads</h3>
          <p className="text-2xl">{stats.unassignedLeads}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl">{stats.totalEmployees}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold">Recent Activities</h3>
        <ul className="mt-2 space-y-2">
          {stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((act, idx) => (
              <li key={idx} className="bg-gray-50 p-2 rounded shadow-sm">
                <p>{act.description}</p>
                <p className="text-sm text-gray-500">{new Date(act.timestamp).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <p>No recent activities</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

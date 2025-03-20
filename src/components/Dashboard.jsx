import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowUps = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employee/follow-ups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch follow-ups");

      const data = await response.json();
      setFollowUps(data);
    } catch (error) {
      toast.error("Failed to fetch follow-ups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-heading">Dashboard</h1>
      <div className="follow-ups-section">
        <h2>Today's Follow-Ups</h2>
        {followUps.length > 0 ? (
          <table className="follow-ups-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Status</th>
                <th>Follow-Up Date</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((followUp) => (
                <tr key={followUp._id}>
                  <td>{followUp.name}</td>
                  <td>{followUp.contactNumber}</td>
                  <td>{followUp.email}</td>
                  <td>{followUp.status}</td>
                  <td>{followUp.followUpDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No follow-ups for today.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

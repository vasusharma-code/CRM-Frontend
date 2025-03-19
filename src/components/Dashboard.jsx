import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [followUpDates, setFollowUpDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserName(data.name);
      } else {
        toast.error("Failed to load user profile");
      }
    } catch (error) {
      toast.error("Failed to load user profile");
    }
  };

  // Fetch follow-up dates
  const fetchFollowUpDates = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/leads", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        const filteredFollowUps = data
          .filter((lead) => lead.employeeName === userName)
          .map((lead) => ({
            description: lead.clientName,
            date: lead.followUpDate,
          }));
        setFollowUpDates(filteredFollowUps);
      } else {
        toast.error("Failed to load follow-up dates");
      }
    } catch (error) {
      toast.error("Failed to load follow-up dates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchFollowUpDates();
  }, []);

  // Function to determine greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="greeting-section">
        {getGreeting()}, {userName}!
      </h2>

      <div className="follow-up-section">
        <h3 className="follow-up-title">Your Follow-Up Dates</h3>
        {followUpDates.length > 0 ? (
          <ul className="follow-up-list">
            {followUpDates.map((followUp, idx) => (
              <li key={idx} className="follow-up-item">
                <p className="follow-up-description">
                  Follow-up with {followUp.description}
                </p>
                <p className="follow-up-date">
                  {new Date(followUp.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-follow-ups">No follow-ups scheduled</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

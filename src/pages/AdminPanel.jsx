import React, { useState, useEffect } from "react";
import "../styles/AdminPanel.css";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [callers, setCallers] = useState([]);
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = async () => {
    try {
      const callersRes = await fetch("http://localhost:3000/api/admin/callers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const leadsRes = await fetch("http://localhost:3000/api/admin/unassigned-leads", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const revenueRes = await fetch("http://localhost:3000/api/admin/revenue", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCallers(await callersRes.json());
      setUnassignedLeads(await leadsRes.json());
      setTotalRevenue(await revenueRes.json());
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignLead = async (leadId, callerId) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/assignLead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ leadId, callerId }),
      });
      if (response.ok) {
        toast.success("Lead assigned successfully");
        fetchData();
      } else {
        toast.error("Failed to assign lead");
      }
    } catch (error) {
      toast.error("Failed to assign lead");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-box">
            <h3>Total Revenue</h3>
            <p>${totalRevenue}</p>
          </div>
          <div className="stat-box">
            <h3>Total Leads</h3>
            <p>{unassignedLeads.length}</p>
          </div>
          <div className="stat-box">
            <h3>Active Callers</h3>
            <p>{callers.length}</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          Manage Leads
        </button>
        <button 
          className={`tab ${activeTab === 'callers' ? 'active' : ''}`}
          onClick={() => setActiveTab('callers')}
        >
          Manage Callers
        </button>
        <button 
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Performance Overview</h2>
            <div className="performance-chart">
              {/* Add your chart component here */}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="leads-section">
            <h2>Lead Management</h2>
            <div className="leads-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Assign To</th>
                  </tr>
                </thead>
                <tbody>
                  {unassignedLeads.map(lead => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>
                      <td>{lead.contactNumber}</td>
                      <td>{lead.status}</td>
                      <td>
                        <select onChange={(e) => handleAssignLead(lead._id, e.target.value)}>
                          <option value="">Select Caller</option>
                          {callers.map(caller => (
                            <option key={caller._id} value={caller._id}>
                              {caller.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'callers' && (
          <div className="callers-section">
            <h2>Caller Management</h2>
            <div className="callers-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Assigned Leads</th>
                    <th>Completed Calls</th>
                    <th>Revenue Generated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {callers.map(caller => (
                    <tr key={caller._id}>
                      <td>{caller.name}</td>
                      <td>{caller.leads.alloted}</td>
                      <td>{caller.completedCalls}</td>
                      <td>${caller.revenue}</td>
                      <td>
                        <button className="action-btn">View Details</button>
                        <button className="action-btn delete">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <h2>Revenue Reports</h2>
            <div className="report-filters">
              <select>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>
              <button className="download-btn">Download Report</button>
            </div>
            <div className="revenue-chart">
              {/* Add your revenue chart component here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

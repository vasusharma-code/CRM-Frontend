import React, { useState } from "react";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [callers, setCallers] = useState([
    { id: 1, name: "Alice Johnson", assignedLeads: 15, completedCalls: 12, revenue: 2500 },
    { id: 2, name: "Bob Smith", assignedLeads: 20, completedCalls: 18, revenue: 3200 },
  ]);

  const [unassignedLeads, setUnassignedLeads] = useState([
    { id: 1, name: "John Doe", phone: "+1-234-567-8900", status: "new" },
    { id: 2, name: "Jane Smith", phone: "+1-234-567-8901", status: "new" },
  ]);

  const handleAssignLead = (leadId, callerId) => {
    // Handle lead assignment logic here
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-box">
            <h3>Total Revenue</h3>
            <p>$5,700</p>
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
                    <tr key={lead.id}>
                      <td>{lead.name}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.status}</td>
                      <td>
                        <select onChange={(e) => handleAssignLead(lead.id, e.target.value)}>
                          <option value="">Select Caller</option>
                          {callers.map(caller => (
                            <option key={caller.id} value={caller.id}>
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
                    <tr key={caller.id}>
                      <td>{caller.name}</td>
                      <td>{caller.assignedLeads}</td>
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

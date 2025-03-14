import React, { useState } from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "+1 234-567-8900",
      email: "john@example.com",
      location: "New York",
      status: "will_pay",
      proof: null
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "+1 234-567-8901",
      email: "jane@example.com",
      location: "Los Angeles",
      status: "not_answered",
      proof: null
    }
  ]);

  const handleStatusChange = (leadId, newStatus) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const handleProofUpload = (leadId, file) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, proof: file } : lead
    ));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Lead Management Dashboard</h1>
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div className="stat-info">
              <h3>Total Leads</h3>
              <p>{leads.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-info">
              <h3>Will Pay</h3>
              <p>{leads.filter(l => l.status === 'will_pay').length}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">❓</span>
            <div className="stat-info">
              <h3>Not Sure</h3>
              <p>{leads.filter(l => l.status === 'not_sure').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
              <th>Payment Proof</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.phone}</td>
                <td>{lead.email}</td>
                <td>{lead.location}</td>
                <td>
                  <select 
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className={`status-select ${lead.status}`}
                  >
                    <option value="will_pay">Will Pay</option>
                    <option value="not_answered">Not Answered</option>
                    <option value="not_sure">Not Sure</option>
                  </select>
                </td>
                <td>
                  <div className="proof-upload">
                    {lead.proof ? (
                      <div className="proof-preview">
                        <img src={URL.createObjectURL(lead.proof)} alt="Proof" />
                        <button onClick={() => handleProofUpload(lead.id, null)}>Remove</button>
                      </div>
                    ) : (
                      <label className="upload-button">
                        Upload Proof
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProofUpload(lead.id, e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

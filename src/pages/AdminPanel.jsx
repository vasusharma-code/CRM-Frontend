import React, { useState, useEffect } from "react";
import "../styles/AdminPanel.css";
import toast from "react-hot-toast";
import AccountsDashboard from "./AccountsDashboard"; // Import AccountsDashboard
import OperationsDashboard from "./OperationsDashboard"; // Import OperationsDashboard

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [callers, setCallers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [neededLeads, setNeededLeads] = useState({});

  const fetchData = async () => {
    try {
      const callersRes = await fetch("http://localhost:3000/api/admin/callers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const leadsRes = await fetch("http://localhost:3000/api/admin/leads", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const revenueRes = await fetch("http://localhost:3000/api/admin/revenue", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCallers(await callersRes.json());
      setLeads(await leadsRes.json());
      const revenueData = await revenueRes.json();
      setTotalRevenue(revenueData.totalRevenue);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/admin/addLeads", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (response.ok) {
        toast.success("Leads added successfully");
        fetchData();
      } else {
        toast.error("Failed to add leads");
      }
    } catch (error) {
      toast.error("Failed to add leads");
    } finally {
      setLoading(false);
    }
  };

  // Here, we assume that the assignedTo field in lead contains the caller ID.
  // This helper looks up the caller's name, if available.
  const getCallerName = (callerId) => {
    const caller = callers.find(c => c._id === callerId);
    return caller ? caller.name : callerId;
  };

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

  const handleNeededLeadsChange = (callerId, value) => {
    setNeededLeads({
      ...neededLeads,
      [callerId]: value
    });
  };

  const handleSaveNeededLeads = async (callerId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/updateNeededLeads/${callerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ neededLeads: neededLeads[callerId] }),
      });
      if (response.ok) {
        toast.success("Needed leads updated successfully");
        fetchData();
      } else {
        toast.error("Failed to update needed leads");
      }
    } catch (error) {
      toast.error("Failed to update needed leads");
    }
  };

  const getRemainingLeadsCount = (callerId) => {
    return leads.filter(lead => lead.assignedTo === callerId && lead.status === 'new').length;
  };

  const getClosedDealsCount = (callerId) => {
    return leads.filter(lead => lead.assignedTo === callerId && lead.paymentVerified === 'verified' && lead.operationStatus === 'completed').length;
  };

  const getRevenueGenerated = (callerId) => {
    return leads.filter(lead => lead.assignedTo === callerId && lead.paymentVerified === 'verified' && lead.operationStatus === 'completed')
                .reduce((sum, lead) => sum + parseFloat(lead.amount || 0), 0);
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
            <p>{leads.length}</p>
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
          className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Accounts Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveTab('operations')}
        >
          Operations Dashboard
        </button>
        
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2 className="section-title">Performance Overview</h2>
            <div className="performance-chart">
              {/* Add your chart component here */}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="leads-section">
            <h2 className="section-title">Lead Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Assign To</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>
                      <td>{lead.contactNumber}</td>
                      <td>{lead.email}</td>
                      <td>{lead.status}</td>
                      <td>
                        {lead.assignedTo ? (
                          getCallerName(lead.assignedTo)
                        ) : (
                          <select 
                            onChange={(e) => {
                              if(e.target.value) handleAssignLead(lead._id, e.target.value)
                            }}
                          >
                            <option value="">Select Caller</option>
                            {callers.map(caller => (
                              <option key={caller._id} value={caller._id}>
                                {caller.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className="section-title">Upload Leads</h2>
            <form onSubmit={handleFileUpload} className="form-section">
              <input type="file" onChange={handleFileChange} className="input-file" accept=".xlsx,.xls" />
              <button
                type="submit"
                disabled={loading}
                className="primary-btn"
              >
                {loading ? "Uploading..." : "Upload Leads"}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'callers' && (
          <div className="callers-section">
            <h2 className="section-title">Caller Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Assigned Leads</th>
                    <th>Remaining Leads</th>
                    <th>Closed Deals</th>
                    <th>Revenue Generated</th>
                    <th>Needed Leads</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {callers.filter(caller => caller.type === 'sales').map(caller => (
                    <tr key={caller._id}>
                      <td>{caller.name}</td>
                      <td>{caller.leads.alloted}</td>
                      <td>{getRemainingLeadsCount(caller._id)}</td>
                      <td>{getClosedDealsCount(caller._id)}</td>
                      <td>${getRevenueGenerated(caller._id)}</td>
                      <td>
                        <input 
                          type="number" 
                          value={neededLeads[caller._id] || caller.neededLeads} 
                          onChange={(e) => handleNeededLeadsChange(caller._id, e.target.value)} 
                        />
                      </td>
                      <td>
                        <button className="action-btn" onClick={() => handleSaveNeededLeads(caller._id)}>Save</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="unassigned-leads">
              <h2 className="section-title">Unassigned Leads</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Lead Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.filter(lead => !lead.assignedTo).map(lead => (
                      <tr key={lead._id}>
                        <td>{lead.name}</td>
                        <td>{lead.contactNumber}</td>
                        <td>{lead.email}</td>
                        <td>{lead.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="accounts-section">
            <AccountsDashboard />
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="operations-section">
            <OperationsDashboard />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <h2 className="section-title">Revenue Reports</h2>
            <div className="report-filters">
              <select>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>
              <button className="primary-btn">Download Report</button>
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

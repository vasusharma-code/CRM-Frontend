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
  const [batches, setBatches] = useState([]);
  const [newBatch, setNewBatch] = useState({ name: "", price: "", booksPrice: "" });

  const fetchData = async () => {
    try {
      const revenueRes = await fetch(`${window.API_URL}/api/admin/revenue`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const revenueData = await revenueRes.json();
      setTotalRevenue(revenueData.totalRevenue);
      const callersRes = await fetch(`${window.API_URL}/api/admin/callers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const leadsRes = await fetch(`${window.API_URL}/api/admin/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCallers(await callersRes.json());
      setLeads(await leadsRes.json());
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${window.API_URL}/api/admin/batches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch batches");
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      toast.error("Failed to fetch batches");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "batches") {
      fetchBatches();
    }
  }, [activeTab]);

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
      const response = await fetch(`${window.API_URL}/api/admin/addLeads`, {
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
      const response = await fetch(`${window.API_URL}/api/admin/assignLead`, {
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
      const response = await fetch(`${window.API_URL}/api/admin/updateNeededLeads/${callerId}`, {
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
  const getAllotedLeadsCount = (callerId) => {
    return leads.filter(lead => lead.assignedTo === callerId).length;
  }

  const getClosedDealsCount = (callerId) => {
    return leads.filter(lead => lead.assignedTo === callerId && lead.paymentVerified === 'verified').length;
  };

  const getRevenueGenerated = (callerId) => {
    return leads
        .filter(lead => lead.assignedTo === callerId && lead.paymentVerified === 'verified' && lead.status === 'closed-success')
        .reduce((sum, lead) => {
            const batchPrice = lead.batch?.price || 0; // Access batch price
            const booksPrice = lead.books ? lead.batch?.booksPrice || 0 : 0; // Access books price if applicable
            return sum + batchPrice + booksPrice;
        }, 0);
};

  const downloadLeads = async (employeeId) => {
    try {
        const response = await fetch(`${window.API_URL}/api/admin/download-leads/${employeeId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `employee_${employeeId}_leads.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            toast.error("Failed to download leads");
        }
    } catch (error) {
        toast.error("Error downloading leads");
    }
};

  const handleNewBatchChange = (e) => {
    setNewBatch({ ...newBatch, [e.target.name]: e.target.value });
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${window.API_URL}/api/admin/addBatch`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(newBatch),
        });
        if (response.ok) {
            toast.success("Batch added successfully");
            await fetchBatches(); // Refresh the list of batches
            setNewBatch({ name: "", price: "", booksPrice: "" }); // Reset the form
        } else {
            toast.error("Failed to add batch");
        }
    } catch (error) {
        toast.error("Failed to add batch");
    }
};

const handleDeleteCaller = async (callerId) => {
    try {
        const response = await fetch(`${window.API_URL}/api/admin/employee/${callerId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (response.ok) {
            toast.success("Caller deleted successfully");
            fetchData(); // Refresh the data
        } else {
            toast.error("Failed to delete caller");
        }
    } catch (error) {
        toast.error("Error deleting caller");
    }
};

const handleBatchStatusChange = async (batchId, newStatus) => {
    try {
        const response = await fetch(`${window.API_URL}/api/admin/updateBatchStatus/${batchId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (response.ok) {
            toast.success("Batch status updated successfully");
            fetchBatches(); // Refresh batches
        } else {
            toast.error("Failed to update batch status");
        }
    } catch (error) {
        toast.error("Error updating batch status");
    }
};

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-box">
            <h3>Total Revenue</h3>
            <p>₹{totalRevenue}</p>
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
        <button 
          className={`tab ${activeTab === 'batches' ? 'active' : ''}`}
          onClick={() => setActiveTab('batches')}
        >
          Batch Dashboard
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
                    <th>Source</th>
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
                      <td>{lead.source}</td>
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
                    <th>Conversion Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {callers.filter(caller => caller.type === 'sales').map(caller => (
                    <tr key={caller._id}>
                      <td>{caller.name}</td>
                      <td>{getAllotedLeadsCount(caller._id)}</td>
                      <td>{getRemainingLeadsCount(caller._id)}</td>
                      <td>{getClosedDealsCount(caller._id)}</td>
                      <td>₹{getRevenueGenerated(caller._id)}</td>
                      <td>
                        <input 
                          type="number" 
                          value={neededLeads[caller._id] || caller.neededLeads} 
                          onChange={(e) => handleNeededLeadsChange(caller._id, e.target.value)} 
                        />
                      </td>
                      <td>
                      { (getClosedDealsCount(caller._id) / (caller.leads.alloted - getRemainingLeadsCount(caller._id))) * 100}%
                      </td>
                      <td>
                        
                        <button className="action-btn" onClick={() => handleSaveNeededLeads(caller._id)}>Save</button>
                        <button className="action-btn" onClick={() => downloadLeads(caller._id)}>Download Leads</button>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteCaller(caller._id)}>Delete</button>
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
        
        {activeTab === 'batches' && (
          <div className="batches-section">
            <h2 className="section-title">Batches</h2>

            {/* All Batches */}
            <div className="table-container">
              <h3>All Batches</h3>
              <table>
                <thead>
                  <tr>
                    <th>Batch Name</th>
                    <th>Batch Price</th>
                    <th>Books Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch._id}>
                      <td>{batch.name}</td>
                      <td>{batch.price}</td>
                      <td>{batch.booksPrice}</td>
                      <td>
                        <select
                            value={batch.status}
                            onChange={(e) => handleBatchStatusChange(batch._id, e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Active Batches */}
            <div className="table-container">
              <h3>Active Batches</h3>
              <table>
                <thead>
                  <tr>
                    <th>Batch Name</th>
                    <th>Batch Price</th>
                    <th>Books Price</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.filter((batch) => batch.status === "active").map((batch) => (
                    <tr key={batch._id}>
                      <td>{batch.name}</td>
                      <td>{batch.price}</td>
                      <td>{batch.booksPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Batch */}
            <div className="add-batch-form">
              <h3>Add New Batch</h3>
              <form onSubmit={handleAddBatch}>
                <div className="input-group">
                  <label htmlFor="name">Batch Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newBatch.name}
                    onChange={handleNewBatchChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="price">Batch Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newBatch.price}
                    onChange={handleNewBatchChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="booksPrice">Books Price</label>
                  <input
                    type="number"
                    id="booksPrice"
                    name="booksPrice"
                    value={newBatch.booksPrice}
                    onChange={handleNewBatchChange}
                    required
                  />
                </div>
                <button type="submit" className="primary-btn">
                  Add Batch
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

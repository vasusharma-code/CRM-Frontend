import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [callers, setCallers] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  // State to track uploaded proof files by lead ID
  const [proofFiles, setProofFiles] = useState({});
  const [comments, setComments] = useState({});

  const fetchData = async () => {
    try {
      const role = localStorage.getItem("userRole");
      console.log(`role: ${role}`);
      const [callersRes, leadsRes, revenueRes] = await Promise.all([
        fetch("http://localhost:3000/api/admin/callers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`http://localhost:3000/api/${role}/leads`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("http://localhost:3000/api/admin/revenue", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      if (!callersRes.ok || !leadsRes.ok || !revenueRes.ok)
        throw new Error("Failed to fetch one or more API data");

      const callersData = await callersRes.json();
      const leadsData = await leadsRes.json();
      const revenueData = await revenueRes.json();

      setCallers(callersData);
      setLeads(leadsData);
      setRevenue(revenueData);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to get caller name from caller ID
  const getCallerName = (callerId) => {
    const caller = callers.find((c) => c._id === callerId);
    return caller ? caller.name : "Unassigned";
  };

  // Update lead status (for non-proof changes)
  const updateStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch("http://localhost:3000/api/employee/updateLeadStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      if (response.ok) {
        toast.success("Status updated");
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Called when file is selected
  const handleProofChange = (leadId, e) => {
    const file = e.target.files[0];
    setProofFiles((prev) => ({ ...prev, [leadId]: file }));
  };

  // Handler to upload payment proof
  const handleProofUpload = async (leadId) => {
    if (!proofFiles[leadId]) {
      toast.error("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("proof", proofFiles[leadId]);
    formData.append("leadId", leadId);

    try {
      const response = await fetch("http://localhost:3000/api/employee/uploadPaymentProof", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (response.ok) {
        toast.success("Payment proof uploaded");
        fetchData();
      } else {
        toast.error("Failed to upload payment proof");
      }
    } catch (error) {
      toast.error("Error uploading payment proof");
    }
  };

  const handleCommentChange = (leadId, comment) => {
    setComments({
      ...comments,
      [leadId]: comment
    });
  };

  const handleSaveComment = async (leadId) => {
    try {
      const response = await fetch("http://localhost:3000/api/employee/updateLeadComment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ leadId, comment: comments[leadId] }),
      });
      if (response.ok) {
        toast.success("Comment saved successfully");
        fetchData();
      } else {
        toast.error("Failed to save comment");
      }
    } catch (error) {
      toast.error("Failed to save comment");
    }
  };

  if (loading)
    return <div className="loading">Loading...</div>;

  return (
    <div className="leads">
      <h1 className="leads-heading">Leads</h1>
      <table className="leads-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <React.Fragment key={lead._id}>
              <tr>
                <td>{lead._id}</td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.contactNumber}</td>
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead._id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="disqualified">Disqualified</option>
                    <option value="under-review">Under Review</option>
                    <option value="closed-failed">Closed - Failed</option>
                    <option value="closed-success">Closed - Success</option>
                  </select>
                </td>
                <td>{lead.assignedTo ? getCallerName(lead.assignedTo) : "Unassigned"}</td>
                <td>
                  <textarea
                    value={comments[lead._id] || lead.comment || ""}
                    onChange={(e) => handleCommentChange(lead._id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSaveComment(lead._id)}>Save</button>
                </td>
              </tr>
              {lead.paymentProof ? "": lead.status === "closed-success" &&(
                <tr className="proof-upload-row" key={lead._id + "-upload"}>
                  <td colSpan="6">
                    <div className="proof-upload">
                      <input
                        type="file"
                        onChange={(e) => handleProofChange(lead._id, e)}
                        className="file-input"
                      />
                      <button onClick={() => handleProofUpload(lead._id)} className="upload-button">
                        Upload Payment Proof
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {revenue && (
        <div>
          <h2>Total Revenue: ${revenue.totalRevenue}</h2>
        </div>
      )}
    </div>
  );
};

export default Leads;
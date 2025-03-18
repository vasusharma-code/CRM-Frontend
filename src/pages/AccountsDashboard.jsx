import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
 import "../styles/AccountsDashboard.css";

const AccountsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/accounts/under-review-leads", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch leads");

      const data = await response.json();
      setLeads(data);
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleVerificationChange = async (leadId, verificationStatus) => {
    try {
      const response = await fetch("http://localhost:3000/api/accounts/updateVerificationStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ leadId, verificationStatus }),
      });
      if (response.ok) {
        toast.success("Verification status updated successfully");
        fetchLeads();
      } else {
        toast.error("Failed to update verification status");
      }
    } catch (error) {
      toast.error("Failed to update verification status");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="accounts-dashboard">
      <h1 className="dashboard-heading">Accounts Dashboard</h1>
      <table className="leads-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Payment Proof</th>
            <th>Verification</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (

            <tr key={lead._id}>
              <td>{lead._id}</td>
              <td>{lead.name}</td>
              <td>{lead.status}</td>
              <td>{lead.assignedTo}</td>
              <td>
                {lead.paymentProof ? (
                  <a href={`http://localhost:3000/uploads/${lead.paymentProof}`} download={`${lead.paymentProof}.png`} target="_blank" rel="noopener noreferrer">
                    View Proof
                  </a>
                ) : (
                  "No proof uploaded"
                )}
              </td>
              <td>
                <select
                  value={lead.paymentVerified || "unverified"}
                  onChange={(e) => handleVerificationChange(lead._id, e.target.value)}
                >
                  <option value="unverified">Unverified</option>
                  <option value="verified">Verified</option>
                  <option value="fake">Fake</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsDashboard;

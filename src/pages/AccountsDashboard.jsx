import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Ensure navigate is imported
import "../styles/AccountsDashboard.css";

const AccountsDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [leads, setLeads] = useState([]);
  const [batchMap, setBatchMap] = useState({}); // Map to store batch details
  const [amountMap, setAmountMap] = useState({}); // Map to store amounts
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${window.API_URL}/api/accounts/under-review-leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch leads");

      const data = await response.json();
      setLeads(data);
      fetchBatchesAndAmounts(data); // Fetch batch details and amounts for the leads
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchesAndAmounts = async (leads) => {
    try {
      const batchIds = [...new Set(leads.map((lead) => lead.batch).filter(Boolean))]; // Unique batch IDs
      const batchResponses = await Promise.all(
        batchIds.map((batchId) =>
          fetch(`${window.API_URL}/api/accounts/batch`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ batchId }),
          })
        )
      );

      const batchData = await Promise.all(batchResponses.map((res) => res.json()));
      const batchMap = {};
      const amountMap = {};

      batchData.forEach(({ batch, amount }) => {
        batchMap[batch._id] = batch;
      });

      leads.forEach((lead) => {
        if (lead.batch && batchMap[lead.batch]) {
          const batch = batchMap[lead.batch];
          amountMap[lead._id] = lead.books
            ? parseInt(batch.price) + parseInt(batch.booksPrice)
            : parseInt(batch.price);
        }
      });

      setBatchMap(batchMap);
      setAmountMap(amountMap);
    } catch (error) {
      toast.error("Failed to fetch batch details and amounts");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleVerificationChange = async (leadId, verificationStatus) => {
    try {
      const response = await fetch(`${window.API_URL}/api/accounts/updateVerificationStatus`, {
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
      <div className="leads-table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Batch</th>
              <th>With Books</th>
              <th>Amount</th>
              <th>Comments</th>
              <th>Payment Proof</th>
              <th>Books Proof</th>
              <th>Form Proof</th>
              <th>Verification</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.status}</td>
                <td>{batchMap[lead.batch]?.name || "N/A"}</td>
                <td>{lead.books ? "Yes" : "No"}</td>
                <td>₹{amountMap[lead._id] || "N/A"}</td>
                <td>{lead.comment}</td>
                <td>
                  {lead.paymentProof ? (
                    <button
                      onClick={() =>
                        navigate("/view-proof", { state: { imageUrl: `${window.API_URL}/uploads/${lead.paymentProof}` } })
                      }
                      className="text-blue-500 underline"
                    >
                      View Payment Proof
                    </button>
                  ) : (
                    "No proof uploaded"
                  )}
                </td>
                <td>
                  {lead.booksSs ? (
                    <button
                      onClick={() =>
                        navigate("/view-proof", { state: { imageUrl: `${window.API_URL}/uploads/${lead.booksSs}` } })
                      }
                      className="text-blue-500 underline"
                    >
                      View Books Proof
                    </button>
                  ) : (
                    "No proof uploaded"
                  )}
                </td>
                <td>
                  {lead.formSs ? (
                    <button
                      onClick={() =>
                        navigate("/view-proof", { state: { imageUrl: `${window.API_URL}/uploads/${lead.formSs}` } })
                      }
                      className="text-blue-500 underline"
                    >
                      View Form Proof
                    </button>
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
    </div>
  );
};

export default AccountsDashboard;

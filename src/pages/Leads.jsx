import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import "../styles/Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [callers, setCallers] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const role = localStorage.getItem("userRole")
      console.log(`role: ${role}`)
      const [callersRes, leadsRes, revenueRes] = await Promise.all([
        fetch(`http://localhost:3000/api/admin/callers`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`http://localhost:3000/api/${role}/leads`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`http://localhost:3000/api/admin/revenue`, {
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

  // Function to update lead status
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

  if (loading)
    return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="leads">
      <h1>Leads</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead._id}</td>
              <td>{lead.name}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
      {revenue && (
        <div className="revenue-info">
          <h2>Total Revenue: ${revenue.totalRevenue}</h2>
        </div>
      )}
    </div>
  );
};

export default Leads;

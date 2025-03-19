import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  const fetchData = async () => {
    try {
      const role = localStorage.getItem("userRole");
      const leadsRes = await fetch(`http://localhost:3000/api/${role}/leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!leadsRes.ok) throw new Error("Failed to fetch leads");

      const leadsData = await leadsRes.json();
      setLeads(leadsData);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleCommentChange = (leadId, comment) => {
    setComments({
      ...comments,
      [leadId]: comment,
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leads">
      <h1 className="leads-heading">Leads</h1>
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Call Status</th>
            <th>12th Boards Year</th>
            <th>12th PCM</th>
            <th>12th English</th>
            <th>Follow Up Date</th>
            <th>Comments</th>
            <th>Sales Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.contactNumber}</td>
              <td>
                <select value={lead.callStatus || ""} onChange={(e) => updateStatus(lead._id, e.target.value)}>
                  <option value="PICK">PICK</option>
                  <option value="DNP">DNP</option>
                  <option value="CTC">CTC</option>
                  <option value="CB">CB</option>
                  <option value="NA">NA</option>
                </select>
              </td>
              <td>
                <input type="number" value={lead.boardYear || ""} />
              </td>
              <td>
                <select value={lead.pcm || ""}>
                  <option value="<60">&lt;60</option>
                  <option value=">60 AND <65">&gt;60 AND &lt;65</option>
                  <option value=">65 AND <70">&gt;65 AND &lt;70</option>
                  <option value=">70 AND <80">&gt;70 AND &lt;80</option>
                  <option value=">80 AND <90">&gt;80 AND &lt;90</option>
                  <option value=">90">&gt;90</option>
                </select>
              </td>
              <td>
                <select value={lead.english || ""}>
                  <option value="<60">&lt;60</option>
                  <option value=">60 AND <65">&gt;60 AND &lt;65</option>
                  <option value=">65 AND <70">&gt;65 AND &lt;70</option>
                  <option value=">70 AND <80">&gt;70 AND &lt;80</option>
                  <option value=">80 AND <90">&gt;80 AND &lt;90</option>
                  <option value=">90">&gt;90</option>
                </select>
              </td>
              <td>
                <input type="date" value={lead.followUpDate || ""} />
              </td>
              <td>
                <textarea value={comments[lead._id] || lead.comment || ""} onChange={(e) => handleCommentChange(lead._id, e.target.value)} />
                <button onClick={() => handleSaveComment(lead._id)}>Save</button>
              </td>
              <td>
                <select value={lead.salesStatus || ""}>
                  <option value="Willing To Pay">Willing To Pay</option>
                  <option value="Needs to Convince Parents">Needs to Convince Parents</option>
                  <option value="Paid">(Paid)</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;

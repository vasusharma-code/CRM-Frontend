import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [batches, setBatches] = useState([]); // State to store active batches
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});

  const fetchData = async () => {
    try {
      const role = localStorage.getItem("userRole");
      const leadsRes = await fetch(`${window.API_URL}/api/${role}/leads`, {
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

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${window.API_URL}/api/admin/batches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch batches");

      const data = await response.json();
      setBatches(data.filter((batch) => batch.status === "active")); // Filter active batches
    } catch (error) {
      toast.error("Failed to fetch batches");
    }
  };

  useEffect(() => {
    fetchData();
    fetchBatches();
  }, []);

  const updateStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch(`${window.API_URL}/api/employee/updateLeadStatus`, { // updated endpoint
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

  const updateLeadField = async (leadId, field, value) => {
    try {
      const response = await fetch(`${window.API_URL}/api/employee/updateLeadField`, { // updated endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ leadId, field, value }),
      });

      if (response.ok) {
        toast.success("Field updated successfully");
        fetchData();
      } else {
        toast.error("Failed to update field");
      }
    } catch (error) {
      toast.error("Error updating field");
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
      const response = await fetch(`${window.API_URL}/api/employee/updateLeadField`, { // updated endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ leadId, field: "comment", value: comments[leadId] }),
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

  const handleProofUpload = async (leadId, proofType, file) => {
    if (!file) {
        toast.error("Please select a file");
        return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("leadId", leadId);
    formData.append("proofType", proofType);

    try {
        const response = await fetch(`${window.API_URL}/api/employee/uploadPaymentProof`, { // updated endpoint
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: formData,
        });

        if (response.ok) {
            toast.success(`${proofType} proof uploaded successfully`);
            fetchData();
        } else {
            toast.error(`Failed to upload ${proofType} proof`);
        }
    } catch (error) {
        toast.error(`Error uploading ${proofType} proof`);
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
            <th>Source</th>
            <th>Call Status</th>
            <th>12th Boards Year</th>
            <th>12th PCM</th>
            <th>12th English</th>
            <th>Batch</th>
            <th>With Books</th>
            <th>Follow Up Date</th>
            <th>Comments</th>
            <th>Sales Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <React.Fragment key={lead._id}>
              <tr>
                <td>{lead.name}</td>
                <td>{lead.contactNumber}</td>
                <td>{lead.source}</td>
                <td>
                  <select
                    value={lead.status || ""}
                    onChange={(e) => updateLeadField(lead._id, "status", e.target.value)}
                  >
                    <option value="new">NEW</option>
                    <option value="PICK">PICK</option>
                    <option value="DNP">DNP</option>
                    <option value="CTC">CTC</option>
                    <option value="CB">CB</option>
                    <option value="NA">NA</option>
                    <option value="closed-success">CLOSED SUCCESS</option>
                    <option value="under-review">UNDER REVIEW</option>
                  </select>
                </td>
                <td>
                  <select
                    value={lead.boardsPass || ""}
                    onChange={(e) => updateLeadField(lead._id, "boardsPass", e.target.value)}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </td>
                <td>
                  <select
                    value={lead.boardsPCM || ""}
                    onChange={(e) => updateLeadField(lead._id, "boardsPCM", e.target.value)}
                  >
                    <option value="<60">&lt;60</option>
                    <option value=">60 AND <65">&gt;60 AND &lt;65</option>
                    <option value=">65 AND <70">&gt;65 AND &lt;70</option>
                    <option value=">70 AND <80">&gt;70 AND &lt;80</option>
                    <option value=">80 AND <90">&gt;80 AND &lt;90</option>
                    <option value=">90">&gt;90</option>
                  </select>
                </td>
                <td>
                  <select
                    value={lead.boardsEnglish || ""}
                    onChange={(e) => updateLeadField(lead._id, "boardsEnglish", e.target.value)}
                  >
                    <option value="<60">&lt;60</option>
                    <option value=">60 AND <65">&gt;60 AND &lt;65</option>
                    <option value=">65 AND <70">&gt;65 AND &lt;70</option>
                    <option value=">70 AND <80">&gt;70 AND &lt;80</option>
                    <option value=">80 AND <90">&gt;80 AND &lt;90</option>
                    <option value=">90">&gt;90</option>
                  </select>
                </td>
                <td>
                  <select
                    value={lead.batch || ""}
                    onChange={(e) => updateLeadField(lead._id, "batch", e.target.value)}
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={lead.books || false}
                    onChange={(e) => updateLeadField(lead._id, "books", e.target.checked)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="follow-up-date"
                    value={lead.followUpDate || ""}
                    onChange={(e) => updateLeadField(lead._id, "followUpDate", e.target.value)}
                  />
                </td>
                <td>
                  <div className="comments-section">
                    <textarea
                      className="comments-box"
                      value={comments[lead._id] || lead.comment || ""}
                      onChange={(e) =>
                        setComments({ ...comments, [lead._id]: e.target.value })
                      }
                    />
                    <button className="save-btn" onClick={() => handleSaveComment(lead._id)}>
                      Save
                    </button>
                  </div>
                </td>
                <td>
                  <select
                    value={lead.salesStatus || ""}
                    onChange={(e) => updateLeadField(lead._id, "salesStatus", e.target.value)}
                  >
                    <option value="Willing To Pay">Willing To Pay</option>
                    <option value="Needs to Convince Parents">Needs to Convince Parents</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
              </tr>
              {lead.status === "closed-success" && lead.paymentVerified === "unverified" && (
                <tr>
                  <td colSpan="11">
                    <div className="proof-upload-section">
                      <h4>Upload Proofs</h4>
                      <div className="proof-uploads">
                        <div className="proof-upload">
                          <label>Payment Proof:</label>
                          <input
                            type="file"
                            onChange={(e) =>
                              handleProofUpload(lead._id, "payment", e.target.files[0])
                            }
                          />
                        </div>
                        {lead.books && (
                          <div className="proof-upload">
                            <label>Books Proof:</label>
                            <input
                              type="file"
                              onChange={(e) =>
                                handleProofUpload(lead._id, "book", e.target.files[0])
                              }
                            />
                          </div>
                        )}
                        <div className="proof-upload">
                          <label>Form Proof:</label>
                          <input
                            type="file"
                            onChange={(e) =>
                              handleProofUpload(lead._id, "form", e.target.files[0])
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;
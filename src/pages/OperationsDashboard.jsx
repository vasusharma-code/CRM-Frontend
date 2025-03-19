import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import "../styles/OperationsDashboard.css";

const OperationsDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [amounts, setAmounts] = useState({});

    const fetchLeads = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/operations/closed-success-leads", {
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

    const handleOperationStatusChange = async (leadId, operationStatus) => {
        try {
            const response = await fetch("http://localhost:3000/api/operations/updateOperationStatus", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ leadId, operationStatus }),
            });
            if (response.ok) {
                toast.success("Operation status updated successfully");
                fetchLeads();
            } else {
                toast.error("Failed to update operation status");
            }
        } catch (error) {
            toast.error("Failed to update operation status");
        }
    };

    const handleAmountChange = (leadId, amount) => {
        setAmounts({
            ...amounts,
            [leadId]: amount
        });
    };

    const handleSaveAmount = async (leadId) => {
        try {
            const response = await fetch("http://localhost:3000/api/operations/updateAmount", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ leadId, amount: amounts[leadId] }),
            });
            if (response.ok) {
                toast.success("Amount updated successfully");
                fetchLeads();
            } else {
                toast.error("Failed to update amount");
            }
        } catch (error) {
            toast.error("Failed to update amount");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="operations-dashboard">
            <h1 className="dashboard-heading">Operations Dashboard</h1>
            <table className="leads-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Payment Proof</th>
                        <th>Operation Status</th>
                        <th>Amount Paid</th>
                        <th>Actions</th>
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
                                    <a href={`http://localhost:3000/uploads/${lead.paymentProof}`} target="_blank" rel="noopener noreferrer">
                                        View Proof
                                    </a>
                                ) : (
                                    "No proof uploaded"
                                )}
                            </td>
                            <td>
                                <select
                                    value={lead.operationStatus || "remaining"}
                                    onChange={(e) => handleOperationStatusChange(lead._id, e.target.value)}
                                >
                                    <option value="remaining">Remaining</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={amounts[lead._id] || lead.amount || ""}
                                    onChange={(e) => handleAmountChange(lead._id, e.target.value)}
                                    placeholder="Enter amount"
                                />

                            </td>
                            <td>
                                <button onClick={() => handleSaveAmount(lead._id)}>Save</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OperationsDashboard;

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

    const handleOperationStatusChange = async (leadId, field, value) => {
        try {
            const response = await fetch("http://localhost:3000/api/operations/updateOperationStatus", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ leadId, field, value }),
            });
            if (response.ok) {
                toast.success(`${field} updated successfully`);
                fetchLeads();
            } else {
                toast.error(`Failed to update ${field}`);
            }
        } catch (error) {
            toast.error(`Error updating ${field}`);
        }
    };

    const handleAmountChange = (leadId, amount) => {
        setAmounts({
            ...amounts,
            [leadId]: amount
        });
    };


    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="operations-dashboard">
            <h1 className="dashboard-heading">Operations Dashboard</h1>
            <table className="leads-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Number</th>
                        <th>Batch</th>
                        <th>Books</th>
                        <th>Added to Group</th>
                        <th>Registered on App</th>
                        <th>Amount Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead._id}>
                            <td>{lead.name}</td>
                            <td>{lead.contactNumber}</td>
                            <td>{lead.batch}</td>
                            <td>{lead.books ? "Yes" : "No"}</td>
                            <td>
                                <select
                                    value={lead.addedToGroup || "remaining"}
                                    onChange={(e) => handleOperationStatusChange(lead._id, "addedToGroup", e.target.value)}
                                >
                                    <option value="remaining">Remaining</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </td>
                            <td>
                                <select
                                    value={lead.registeredOnApp || "remaining"}
                                    onChange={(e) => handleOperationStatusChange(lead._id, "registeredOnApp", e.target.value)}
                                >
                                    <option value="remaining">Remaining</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </td>
                            <td>{lead.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OperationsDashboard;

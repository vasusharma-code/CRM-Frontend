import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import "../styles/OperationsDashboard.css";

const OperationsDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [batchMap, setBatchMap] = useState({}); // Map to store batch details
    const [amountMap, setAmountMap] = useState({}); // Map to store amounts
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        try {
            const response = await fetch(`${window.API_URL}/api/employee/closed-success-leads`, { // updated endpoint
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
                    fetch(`${window.API_URL}/api/accounts/batch`, { // updated endpoint
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

    const handleOperationStatusChange = async (leadId, field, value) => {
        try {
            const response = await fetch(`${window.API_URL}/api/operations/updateOperationStatus`, { // updated endpoint
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
                            <td>{batchMap[lead.batch]?.name || "N/A"}</td>
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
                            <td>₹{amountMap[lead._id] || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OperationsDashboard;

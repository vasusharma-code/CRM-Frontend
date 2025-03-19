import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const UpdateLeadStatus = () => {
  const [leads, setLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const statusOptions = ["new", "follow up", "closed"];

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employee/leads", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLeads(await response.json());
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const response = await fetch("http://localhost:5000/api/employee/updateLeadStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (response.ok) {
        toast.success("Status updated");
        fetchLeads();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Lead Status</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Current Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td className="px-6 py-4">{lead.name}</td>
              <td className="px-6 py-4">{lead.status}</td>
              <td className="px-6 py-4">
                <select
                  onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                  defaultValue=""
                  className="rounded border-gray-300 p-1"
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateLeadStatus;

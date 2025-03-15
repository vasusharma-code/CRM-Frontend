import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Leads</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td className="px-6 py-4">{lead.name}</td>
              <td className="px-6 py-4">{lead.email}</td>
              <td className="px-6 py-4">{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsList;

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AllotLeads = () => {
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const empRes = await fetch("http://localhost:3000/api/admin/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const leadsRes = await fetch("http://localhost:3000/api/admin/unassigned-leads", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(await empRes.json());
      setLeads(await leadsRes.json());
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || selectedLeads.length === 0) {
      return toast.error("Select an employee and at least one lead");
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/admin/allotLeads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ employeeId, leadIds: selectedLeads }),
      });
      if (response.ok) {
        toast.success("Leads allotted successfully");
        setEmployeeId("");
        setSelectedLeads([]);
        fetchData();
      } else {
        toast.error("Failed to allot leads");
      }
    } catch (error) {
      toast.error("Failed to allot leads");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Allot Leads</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Leads</label>
          <div className="mt-1 border rounded p-2 max-h-60 overflow-y-auto">
            {leads.map((lead) => (
              <label key={lead._id} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  value={lead._id}
                  checked={selectedLeads.includes(lead._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLeads([...selectedLeads, lead._id]);
                    } else {
                      setSelectedLeads(selectedLeads.filter((id) => id !== lead._id));
                    }
                  }}
                  className="h-4 w-4 text-primary-600"
                />
                <span>{lead.name}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition"
        >
          {loading ? "Allotting..." : "Allot Leads"}
        </button>
      </form>
    </div>
  );
};

export default AllotLeads;

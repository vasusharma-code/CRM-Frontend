import React from "react";
import "../styles/Leads.css";

const Leads = () => {
  const leads = [
    { id: 1, name: "John Doe", status: "New" },
    { id: 2, name: "Jane Smith", status: "Contacted" },
    { id: 3, name: "Robert Brown", status: "Interested" },
  ];

  return (
    <div className="leads">
      <h1>Leads</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;

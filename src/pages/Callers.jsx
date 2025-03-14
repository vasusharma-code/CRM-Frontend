import React from "react";
import "../styles/Callers.css";

const Callers = () => {
  const callers = [
    { id: 1, name: "Alice Johnson", callsMade: 20 },
    { id: 2, name: "Michael Brown", callsMade: 35 },
    { id: 3, name: "Sarah Williams", callsMade: 15 },
  ];

  return (
    <div className="callers">
      <h1>Callers</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Calls Made</th>
          </tr>
        </thead>
        <tbody>
          {callers.map((caller) => (
            <tr key={caller.id}>
              <td>{caller.id}</td>
              <td>{caller.name}</td>
              <td>{caller.callsMade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Callers;

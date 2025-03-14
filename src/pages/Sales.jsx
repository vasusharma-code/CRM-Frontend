import React from "react";
import "../styles/Sales.css";

const Sales = () => {
  const sales = [
    { id: 1, customer: "John Doe", amount: "$200", status: "Completed" },
    { id: 2, customer: "Jane Smith", amount: "$150", status: "Pending" },
    { id: 3, customer: "Robert Brown", amount: "$300", status: "Completed" },
  ];

  return (
    <div className="sales">
      <h1>Sales</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.customer}</td>
              <td>{sale.amount}</td>
              <td>{sale.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Sales.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchSales = async () => {
    try {
      const response = await fetch(`${window.API_URL}/api/admin/verified-leads`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Optionally compute per-lead revenue using batch details
        const salesWithRevenue = data.map(lead => {
          const batchPrice = lead.batch?.price || 0;
          const booksPrice = lead.books ? lead.batch?.booksPrice || 0 : 0;
          return { ...lead, revenue: parseFloat(batchPrice) + parseFloat(booksPrice) };
        });
        setSales(salesWithRevenue);
        const revenue = salesWithRevenue.reduce((sum, sale) => sum + sale.revenue, 0);
        setTotalRevenue(revenue);
      } else {
        toast.error("Failed to fetch sales");
      }
    } catch (error) {
      toast.error("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="sales">
      <h1>Sales</h1>
      <h2>Total Revenue: ₹{totalRevenue}</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Revenue Per Lead</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((lead) => {
            const revenuePerLead = lead.revenue;

            return (
              <tr key={lead._id}>
                <td>{lead._id}</td>
                <td>{lead.name}</td>
                <td>₹{revenuePerLead}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;

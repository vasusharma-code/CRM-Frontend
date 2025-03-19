import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/Callers.css";

const Callers = () => {
  const [callers, setCallers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCallers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/callers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        setCallers(await response.json());
      } else {
        toast.error("Failed to fetch callers");
      }
    } catch (error) {
      toast.error("Failed to fetch callers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallers();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

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
            <tr key={caller._id}>
              <td>{caller._id}</td>
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

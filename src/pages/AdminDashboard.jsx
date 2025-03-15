import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Dashboard from "../components/admin/Dashboard";
import AddLeads from "../components/admin/AddLeads";
import AllotLeads from "../components/admin/AllotLeads";
import Navbar from "../components/common/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="CRM Admin Dashboard" />
      <div className="p-4">
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute role="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="add-leads" element={<ProtectedRoute role="admin"><AddLeads /></ProtectedRoute>} />
          <Route path="allot-leads" element={<ProtectedRoute role="admin"><AllotLeads /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

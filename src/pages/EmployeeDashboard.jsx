import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Navbar from "../components/common/Navbar";
import LeadsList from "../components/employee/LeadsList";
import UpdateLeadStatus from "../components/employee/UpdateLeadStatus";

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Employee Dashboard" />
      <div className="p-4">
        <Routes>
          <Route
            index
            element={
              <ProtectedRoute role="employee">
                <LeadsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="update-status"
            element={
              <ProtectedRoute role="employee">
                <UpdateLeadStatus />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

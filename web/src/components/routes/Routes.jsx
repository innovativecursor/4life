import { Routes, Route } from "react-router-dom";

import Login from "../../pages/auth/Login";
import NotFound from "../../pages/NotFound";
import LayOut from "../layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../../pages/dashboad/Dashboard";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Private Layout */}
      <Route
        element={
          <ProtectedRoute>
            <LayOut />
          </ProtectedRoute>
        }
      >
        {/* Nested routes */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
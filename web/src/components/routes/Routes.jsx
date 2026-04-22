import { Routes, Route } from "react-router-dom";

import Login from "../../pages/auth/Login";
import NotFound from "../../pages/NotFound";
import LayOut from "../layout/LayOut";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../../pages/dashboad/Dashboard";
import Timeline from "../../pages/timeline/Timeline";
import Project from "../../pages/project/Project";
import Admin from "../../pages/admin/Admin";
import Role from "../../pages/role/Role";

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
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/project" element={<Project />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/role" element={<Role />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;

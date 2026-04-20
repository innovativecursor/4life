import { Route, Routes } from "react-router-dom";
import LayOut from "../layout/Layout";
import NotFound from "../../pages/NotFound";
// import ProtectedRoute from "./ProtectedRoute";
import Login from "../../pages/auth/Login";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route element={<ProtectedRoute type="public" />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Dashboard Layout */}
      {/* <Route element={<ProtectedRoute type="private" />}>
        <Route element={<LayOut />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route> */}
    </Routes>
  );
};

export default AllRoutes;

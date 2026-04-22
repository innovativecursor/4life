import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;

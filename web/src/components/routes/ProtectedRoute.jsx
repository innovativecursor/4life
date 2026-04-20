// import { Navigate, Outlet } from "react-router-dom";
// import { Spin } from "antd";
// import { useAuthContext } from "../../contexts/AuthContext";

// const ProtectedRoute = ({ type }) => {
//   const { token, authInitializing } = useAuthContext();
//   const rememberToken = localStorage.getItem("rememberToken");

//   if (authInitializing) {
//     return (
//       <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
//         <Spin />
//       </div>
//     );
//   }

//   if (type === "public" && token && rememberToken) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   if (type === "private" && !token) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;



import React from 'react'

const ProtectedRoute = () => {
  return (
    <div>
      
    </div>
  )
}

export default ProtectedRoute

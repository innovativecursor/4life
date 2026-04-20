// import { createContext, useContext, useEffect, useState } from "react";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(
//     localStorage.getItem("access_token") || null
//   );
//   const [isAuthenticated, setIsAuthenticated] = useState(!!token);
//   const [loading, setLoading] = useState(false);

//   // 🔐 Login
//   const loginUser = async (userData, tokenValue) => {
//     localStorage.setItem("access_token", tokenValue);
//     setToken(tokenValue);
//     setIsAuthenticated(true);

//     // 👇 abhi user data nahi hai backend se
//     setUser(userData || null);
//   };

//   // 🚪 Logout
//   const logoutUser = () => {
//     localStorage.removeItem("access_token");
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   // 🔄 initialize (simple)
//   useEffect(() => {
//     if (token) {
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }
//   }, [token]);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         isAuthenticated,
//         loginUser,
//         logoutUser,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// export const useAuthContext = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);

  // 🔐 Login
  const loginUser = (tokenValue) => {
    localStorage.setItem("access_token", tokenValue);
    setToken(tokenValue);
    setIsAuthenticated(true);
  };

  // 🚪 Logout
  const logoutUser = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setIsAuthenticated(false);
    window.location.reload();
  };

  // 🔄 Initialize
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);

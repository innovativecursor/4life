// import { useGoogleLogin } from "@react-oauth/google";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router";
// import { useState } from "react";

// import toast from "react-hot-toast";

// import endpoints from "../../lib/endpoints";
// import { useAuthContext } from "../../contexts/AuthContext";
// import { fetchDataGet } from "../../lib/fetchdata";

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const { loginUser } = useAuthContext();

//   const login = useGoogleLogin({
//     flow: "auth-code",
//     onSuccess: async (codeResponse) => {
//       setLoading(true);
//       try {
//         const res = await fetchDataGet(endpoints.auth.googleLogin, {
//           code: codeResponse.code,
//         });

//         const { token, status, message } = res || {};

//         if (status === "pending") {
//           Swal.fire("Pending", message, "warning");
//           return;
//         }

//         if (status === "approved" && token) {
//           await loginUser(token);
//           toast.success("Login success");
//           navigate("/dashboard");
//           return;
//         }

//         toast.error("Login failed");
//       } catch (err) {
//         Swal.fire("Error", "Login failed", "error");
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   return (
//     <>
//       <button onClick={() => login()} disabled={loading}>
//         {loading ? "Loading..." : "Login with Google"}
//       </button>
//     </>
//   );
// };

// export default Login;



















import { useGoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";

import endpoints from "../../lib/endpoints";
import { useAuthContext } from "../../contexts/AuthContext";
import { fetchDataGet } from "../../lib/fetchdata";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuthContext();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const res = await fetchDataGet(endpoints.auth.googleLogin, {
          code: codeResponse.code,
        });

        const { token, status, message } = res || {};

        if (status === "pending") {
          Swal.fire("Pending", message, "warning");
          return;
        }

        if (status === "approved" && token) {
          await loginUser(token);
          toast.success("Login success");
          navigate("/dashboard");
          return;
        }

        toast.error("Login failed");
      } catch {
        Swal.fire("Error", "Login failed", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#FFF8E7] to-[#FFE8A3] px-4 relative overflow-hidden">

      {/* subtle glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#FCD34D] opacity-20 blur-[100px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-[#D97706] opacity-20 blur-[100px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md 
        bg-white/80 backdrop-blur-xl 
        border border-white/40 
        rounded-3xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl 
            bg-gradient-to-br from-[#D97706] to-[#F59E0B] 
            text-white flex items-center justify-center 
            font-semibold text-lg shadow-md">
            Rx
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Continue with your Google account
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => login()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 
          bg-white border border-gray-200 
          hover:shadow-lg hover:-translate-y-[2px]
          active:scale-[0.98]
          text-gray-700 py-3 rounded-xl transition-all duration-200
          disabled:opacity-60"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Authorized access only
        </p>
      </div>
    </div>
  );
};

export default Login;
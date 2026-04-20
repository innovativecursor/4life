// import React, { useState } from "react";
// import { Lock, Mail, Shield, Eye, EyeOff } from "lucide-react";

// import { Input } from "../../components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
//         <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-[#08580D] rounded-2xl text-white min-h-[600px]">
//           <div className="text-center space-y-6">
//             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
//               <Lock className="w-10 h-10 text-white" />
//             </div>
//             <div className="space-y-2">
//               <h1 className="text-4xl font-bold">Welcome Back</h1>
//               <p className="text-blue-100 text-lg">
//                 Access your admin Panel securely
//               </p>
//             </div>
//             <div className="space-y-4 text-sm text-blue-100">
//               <div className="flex items-center gap-3">
//                 <Shield className="w-5 h-5" />
//                 <span>Secure authentication</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Lock className="w-5 h-5" />
//                 <span>Two-factor protection</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right side -*/}
//         <div className="w-full max-w-md">
//           <Card className="shadow-xl border-0 bg-secondary backdrop-blur-sm">
//             <CardHeader className="text-center space-y-2 pb-8">
//               <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Enter your credentials to access your account
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <form className="space-y-6">
//                 <div>
//                   <label className="text-sm font-medium block mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                     <Input
//                       type="email"
//                       placeholder="you@example.com"
//                       className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium block mb-2">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
// {/*
//                 <div className="flex items-center justify-between text-sm">
//                   <label className="flex items-center space-x-2 cursor-pointer"></label>
//                   <a
//                     href="#"
//                     className="text-orange-700 cursor-pointer font-medium"
//                   >
//                     Forgot password?
//                   </a>
//                 </div> */}

//                 <button
//                   type="button"
//                   className="w-full bg-[#08580D] cursor-pointer  text-white py-2.5 rounded-lg font-medium transition-colors"
//                 >
//                   Sign In
//                 </button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

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
      } catch (err) {
        Swal.fire("Error", "Login failed", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <button onClick={() => login()} disabled={loading}>
        {loading ? "Loading..." : "Login with Google"}
      </button>
    </>
  );
};

export default Login;

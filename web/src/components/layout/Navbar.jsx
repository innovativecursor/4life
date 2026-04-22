import { Menu, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthContext } from "../../contexts/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const { logoutUser } = useAuthContext();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out");
  };

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-[#FFF8E7] border-b border-[#F1E5C6]">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-[#FFE8A3] rounded-md"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell size={18} className="text-gray-600" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#D97706] text-white flex items-center justify-center text-sm">
          A
        </div>
      </div>
    </div>
  );
};

export default Navbar;

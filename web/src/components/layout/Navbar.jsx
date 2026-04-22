import { Menu, Bell, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuthContext } from "../../contexts/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuthContext();

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-[#F1E5C6] sticky top-0 z-30 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-[#FFE8A3] transition-colors rounded-lg text-gray-600 hover:text-[#D97706]"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center bg-[#FFF8E7] px-3 py-1.5 rounded-xl border border-[#F1E5C6] w-64 group focus-within:border-[#D97706] transition-all">
          <Search size={16} className="text-gray-400 group-focus-within:text-[#D97706]" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2 text-gray-600 hover:bg-[#FFF1CC] rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-none">Admin User</p>
            <p className="text-xs text-gray-500 mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center text-sm font-bold shadow-sm shadow-[#D97706]/20">
            A
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;


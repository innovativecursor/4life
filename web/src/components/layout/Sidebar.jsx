import { LayoutDashboard, Users, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`h-screen bg-[#FFF1CC] border-r border-[#F1E5C6] ${isOpen ? "w-60" : "w-16"} transition-all`}>
      
      {/* Logo */}
      <div className="h-16 flex items-center px-5 text-lg font-semibold text-gray-800">
        {isOpen ? "Kloud" : "K"}
      </div>

      {/* Menu */}
      <div className="mt-4 space-y-1 px-2">
        <Item to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" isOpen={isOpen} />
        <Item to="/users" icon={<Users size={18} />} label="Users" isOpen={isOpen} />
        <Item to="/settings" icon={<Settings size={18} />} label="Settings" isOpen={isOpen} />
      </div>
    </div>
  );
};

const Item = ({ to, icon, label, isOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
        isActive
          ? "bg-white text-[#D97706] font-medium shadow-sm"
          : "text-gray-600 hover:bg-white/70"
      }`
    }
  >
    {icon}
    {isOpen && <span>{label}</span>}
  </NavLink>
);

export default Sidebar;
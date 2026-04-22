import {
  LayoutDashboard,
  Users,
  Timer,
  FolderDot,
  X,
  Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  return (
    <>
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
          }`}
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-[#FFF1CC] border-r border-[#F1E5C6]
          transition-all duration-300 ease-in-out
          flex flex-col overflow-hidden
          ${
            isMobile
              ? `w-64 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`
              : `${isOpen ? "w-64" : "w-16"}`
          }
        `}
      >
        <div className="flex flex-col h-full w-64 shrink-0">
          <div className="h-16 flex items-center justify-between px-5 shrink-0">
            <span
              className={`text-xl font-bold text-[#D97706] transition-opacity duration-300 ${!isOpen && !isMobile ? "opacity-0 w-0" : "opacity-100"}`}
            >
              Kloud
            </span>
            {!isOpen && !isMobile && (
              <span className="text-xl font-bold text-[#D97706] absolute left-1/2 -translate-x-1/2">
                K
              </span>
            )}

            {isMobile && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#FFE8A3] rounded-md"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto no-scrollbar">
            <Item
              to="/dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              isOpen={isOpen || isMobile}
              onClose={onClose}
              isMobile={isMobile}
            />
            <Item
              to="/timeline"
              icon={<Timer size={20} />}
              label="Timeline"
              isOpen={isOpen || isMobile}
              onClose={onClose}
              isMobile={isMobile}
            />
            <Item
              to="/project"
              icon={<FolderDot size={20} />}
              label="Project"
              isOpen={isOpen || isMobile}
              onClose={onClose}
              isMobile={isMobile}
            />
            <Item
              to="/admin"
              icon={<Users size={20} />}
              label="Admin"
              isOpen={isOpen || isMobile}
              onClose={onClose}
              isMobile={isMobile}
            />
            <Item
              to="/role"
              icon={<Shield size={20} />}
              label="Role"
              isOpen={isOpen || isMobile}
              onClose={onClose}
              isMobile={isMobile}
            />
          </nav>

          <div
            className={`p-4 border-t border-[#F1E5C6] transition-opacity duration-300 ${!isOpen && !isMobile ? "opacity-0" : "opacity-100"}`}
          >
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              v1.2.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

const Item = ({ to, icon, label, isOpen, onClose, isMobile }) => (
  <NavLink
    to={to}
    onClick={() => {
      if (isMobile) onClose();
    }}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
        isActive
          ? "bg-white text-[#D97706] font-semibold shadow-sm"
          : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
      }`
    }
  >
    <span className="shrink-0">{icon}</span>
    <span
      className={`whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}
    >
      {label}
    </span>
    {!isOpen && !isMobile && (
      <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        {label}
      </div>
    )}
  </NavLink>
);

export default Sidebar;

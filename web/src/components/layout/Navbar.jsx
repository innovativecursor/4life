import { Menu, Bell } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="h-16 flex items-center justify-between px-6 bg-[#FFF8E7] border-b border-[#F1E5C6]">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-[#FFE8A3] rounded-md">
          <Menu size={18} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell size={18} className="text-gray-600" />
        <div className="w-9 h-9 rounded-full bg-[#D97706] text-white flex items-center justify-center text-sm">
          A
        </div>
      </div>
    </div>
  );
};

export default Navbar;
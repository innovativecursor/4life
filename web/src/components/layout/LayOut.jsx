import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const LayOut = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#FFF8E7] text-gray-800">
      {/* Sidebar (desktop) */}
      {!isMobile && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (mobile overlay) */}
      {isMobile && isSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed z-50">
            <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Section */}
      <div className="flex flex-col flex-1 ">
        {/* Navbar */}
        <div className="sticky top-0 z-30 bg-[#FFF8E7] border-b border-[#F1E5C6]">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Content */}
        <div className="flex-1   md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayOut;

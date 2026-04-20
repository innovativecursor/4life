import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const LayOut = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsSidebarOpen(!isMobile);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <div
          className={`fixed top-0 z-10 bg-zinc-50 shadow-sm ${
            isSidebarOpen ? "left-48" : "left-0"
          } right-0 transition-all duration-300`}
        >
          <Navbar
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isOpen={isSidebarOpen}
          />
        </div>

        {/* Main Page Content */}
        <div
          className={`mt-16 overflow-auto h-[calc(100vh-4rem)] transition-all duration-300 ${
            isSidebarOpen ? "ml-48 blur-sm md:blur-none" : "ml-0"
          }`}
        >
          {isSidebarOpen && (
            <div className="absolute inset-0 bg-opacity-20 md:hidden z-10 pointer-events-none"></div>
          )}
          <div className="w-full h-full p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayOut;

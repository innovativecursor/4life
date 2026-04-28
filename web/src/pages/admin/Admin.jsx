import React, { useState } from "react";
import AdminList from "../../components/admin/AdminList";
import PendingAdmins from "../../components/admin/PendingAdmins";

const Admin = () => {
  const [tab, setTab] = useState("pending");

  return (
    <div className="md:p-6 space-y-7 mt-6">
      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "pending" ? "bg-[#D97706] text-white" : "bg-[#FFF1CC]"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-lg text-sm ${
            tab === "all" ? "bg-[#D97706] text-white" : "bg-[#FFF1CC]"
          }`}
        >
          All Admins
        </button>
      </div>

      {/* Content */}
      {tab === "pending" ? <PendingAdmins /> : <AdminList />}
    </div>
  );
};

export default Admin;

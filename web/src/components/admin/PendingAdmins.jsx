import React, { useState } from "react";
import { useGetAdmins, useApproveUser } from "../../hooks/admin/useAdmin";
import { useGetRoles } from "../../hooks/role/useRole";
import toast from "react-hot-toast";

const PendingAdmins = () => {
  const { data } = useGetAdmins();
  const { data: roleData } = useGetRoles();
  const { mutate, isPending } = useApproveUser();

  const roles = roleData?.roles || [];

  const pendingAdmins =
    data?.admins?.filter((a) => a.approval_status === "pending") || [];

  const [selectedRoles, setSelectedRoles] = useState({});

  const handleApprove = (admin) => {
    const role = selectedRoles[admin.id];
    if (!role) return toast.error("Select role first");

    mutate(
      { email: admin.email, role, status: "approved" },
      { onSuccess: () => toast.success("Approved") }
    );
  };

  const handleReject = (admin) => {
    mutate(
      { email: admin.email, role: "NA", status: "rejected" },
      { onSuccess: () => toast.success("Rejected") }
    );
  };

  return (
    <div className="bg-white border border-[#F1E5C6] rounded-2xl p-5">

      <h2 className="text-lg font-semibold mb-4 text-[#7C5A00]">
        Pending Approvals
      </h2>

      <div className="space-y-4">
        {pendingAdmins.map((admin) => (
          <div
            key={admin.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 border p-4 rounded-xl bg-[#FFF8E7]"
          >
            {/* Info */}
            <div>
              <p className="font-medium">
                {admin.first_name} {admin.last_name}
              </p>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>

            {/* Role */}
            <select
              value={selectedRoles[admin.id] || ""}
              onChange={(e) =>
                setSelectedRoles({
                  ...selectedRoles,
                  [admin.id]: e.target.value,
                })
              }
              className="border px-3 py-1 rounded-lg"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(admin)}
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(admin)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingAdmins;
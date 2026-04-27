import React from "react";
import { useGetAdmins } from "../../hooks/admin/useAdmin";

const AdminList = () => {
  const { data, isLoading } = useGetAdmins();

  if (isLoading) return <p className="p-4">Loading...</p>;

  const admins = data?.admins || [];

  return (
    <div className="bg-white border border-[#F1E5C6] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F1E5C6]">
        <h2 className="text-lg font-semibold text-[#7C5A00]">Admin List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FFF1CC] text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Verified</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((admin) => (
              <tr
                key={admin.id}
                className="border-t border-[#F1E5C6] hover:bg-[#FFF8E7]"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {admin.first_name} {admin.last_name}
                </td>

                <td className="px-4 py-3 text-gray-600">{admin.email}</td>

                <td className="px-4 py-3">{admin.application_role || "NA"}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.email_verified
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {admin.email_verified ? "Verified" : "Not Verified"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.approval_status === "approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {admin.approval_status}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {admin.created_at?.split(" ")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;

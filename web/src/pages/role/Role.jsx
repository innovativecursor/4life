import React from "react";
import { useGetRoles } from "../../hooks/role/useRole";

const Role = () => {
  const { data, isLoading } = useGetRoles();

  if (isLoading) return <p className="p-4">Loading...</p>;

  const roles = data?.roles || [];

  return (
    <div className="bg-white border border-[#F1E5C6] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F1E5C6]">
        <h2 className="text-lg font-semibold text-[#7C5A00]">Roles</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FFF1CC] text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Role Name</th>
              <th className="px-4 py-3 text-left">Created Date</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role, index) => (
              <tr
                key={role.id}
                className="border-t border-[#F1E5C6] hover:bg-[#FFF8E7]"
              >
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                <td className="px-4 py-3 font-medium text-gray-800">
                  {role.name}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {role.created_at?.split(" ")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Role;

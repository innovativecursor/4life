import React, { useState } from "react";
import { useGetRoles, useCreateRole } from "../../hooks/role/useRole";
import { Modal, Input } from "antd";
import toast from "react-hot-toast";

const Role = () => {
  const { data, isLoading } = useGetRoles();
  const { mutate, isPending } = useCreateRole();

  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");

  const roles = data?.roles || [];

  const handleCreate = () => {
    if (!roleName) return toast.error("Role name required");

    mutate(
      { name: roleName },
      {
        onSuccess: () => {
          toast.success("Role created");
          setOpen(false);
          setRoleName("");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Failed");
        },
      },
    );
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-white border border-[#F1E5C6] rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#F1E5C6] flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#7C5A00]">Roles</h2>

        {/* Create Button */}
        <button
          onClick={() => setOpen(true)}
          className="bg-[#D97706] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#b45309]"
        >
          + Create Role
        </button>
      </div>

      {/* Table */}
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
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{role.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {role.created_at?.split(" ")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 Modal */}
      <Modal
        title="Create Role"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        confirmLoading={isPending}
        okButtonProps={{
          style: {
            backgroundColor: "#D97706",
            borderColor: "#D97706",
          },
        }}
        cancelButtonProps={{
          style: {
            color: "#D97706",
            borderColor: "#F3E6C9",
          },
        }}
      >
        <Input
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Role;

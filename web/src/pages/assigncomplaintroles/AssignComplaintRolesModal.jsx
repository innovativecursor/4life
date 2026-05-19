import React, { useEffect, useState } from "react";

import { Modal, Select, Button } from "antd";

import toast from "react-hot-toast";

import { useGetRoles } from "../../hooks/role/useRole";
import {
  useAssignComplaintRoles,
  useGetComplaintRoles,
} from "../../hooks/assigncomplaintrole/useAssignComplaintRoles";
import { useGetProjectById } from "../../hooks/project/useProject";

const { Option } = Select;

const AssignComplaintRolesModal = ({ open, onClose, projectId }) => {
  // PROJECT
  const { data: projectData } = useGetProjectById(projectId, open);

  // ALL ROLES
  const { data: roleData } = useGetRoles();

  // GET ASSIGNED ROLES
  const { data: complaintRoleData } = useGetComplaintRoles(projectId, open);

  // SAVE API
  const { mutate, isPending } = useAssignComplaintRoles();

  // PROJECT
  const project = projectData?.project;

  // ROLES
  const roles = roleData?.roles || [];

  // ASSIGNED ROLES
  const assignedRoles = complaintRoleData?.roles || [];

  // SELECTED STATE
  const [selectedRoles, setSelectedRoles] = useState([]);

  // PREFILL
  useEffect(() => {
    if (!open) return;

    if (Array.isArray(complaintRoleData?.roles)) {
      setSelectedRoles(complaintRoleData.roles);
    } else {
      setSelectedRoles([]);
    }
  }, [projectId, open, complaintRoleData]);

  // SAVE
  const handleSave = () => {
    // if (!selectedRoles.length) {
    //   return toast.error("Select at least one role");
    // }

    const payload = {
      project_id: projectId,
      roles: selectedRoles,
    };

    mutate(payload, {
      onSuccess: (res) => {
        toast.success(res?.message || "Roles assigned successfully");

        onClose();
      },

      onError: (err) => {
        toast.error(err?.response?.data?.error || "Something went wrong");
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      title={null}
    >
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-[#7C5A00]">
            {project?.Name}
          </h2>

          <p className="text-sm text-gray-500">Assign complaint roles</p>
        </div>

        {/* SELECT */}
        <div className="space-y-4">
          <div className="mb-5">
            <Select
              mode="multiple"
              placeholder="Select Roles"
              style={{ width: "100%" }}
              value={selectedRoles}
              onChange={(val) => setSelectedRoles(val)}
            >
              {roles.map((role) => (
                <Option key={role.id} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* SHOW SELECTED */}
          {!!selectedRoles.length && (
            <div className="flex flex-wrap gap-2">
              {selectedRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-[#FFF1CC] text-[#7C5A00] rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          )}

          {/* BUTTON */}
          <Button
            type="primary"
            loading={isPending}
            onClick={handleSave}
            style={{
              backgroundColor: "#D97706",
              borderColor: "#D97706",
            }}
          >
            Save Roles
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignComplaintRolesModal;

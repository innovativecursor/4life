import React, { useEffect, useState } from "react";

import { Modal, Select, Button } from "antd";

import toast from "react-hot-toast";

import { useGetRoles } from "../../hooks/role/useRole";
import { useAssignComplaintRoles } from "../../hooks/assigncomplaintrole/useAssignComplaintRoles";
import { useGetProjectById } from "../../hooks/project/useProject";

// import {
//   useAssignComplaintRoles,
//   useGetProjectById,
// } from "../../hooks/project/useProject";

const { Option } = Select;

const AssignComplaintRolesModal = ({
  open,
  onClose,
  projectId,
}) => {
  // PROJECT DETAILS
  const { data, isLoading } =
    useGetProjectById(projectId, open);

  // ROLES
  const { data: roleData } = useGetRoles();

  // ASSIGN API
  const { mutate, isPending } =
    useAssignComplaintRoles();

  // ROLE LIST
  const roles = roleData?.roles || [];

  // PROJECT
  const project = data?.project;

  // ALREADY ASSIGNED ROLES
  const assignedRoles =
    data?.complaint_roles || [];

  // SELECTED ROLES STATE
  const [selectedRoles, setSelectedRoles] =
    useState([]);

  // PREFILL SELECTED ROLES
  useEffect(() => {
    if (open) {
      setSelectedRoles(assignedRoles);
    }
  }, [open, data]);

  // SAVE
  const handleSave = () => {
    if (!selectedRoles.length) {
      return toast.error(
        "Select at least one role"
      );
    }

    const payload = {
      project_id: projectId,
      roles: selectedRoles,
    };

    mutate(payload, {
      onSuccess: (res) => {
        toast.success(
          res?.message ||
            "Roles assigned successfully"
        );
      },

      onError: (err) => {
        toast.error(
          err?.response?.data?.message ||
            "Something went wrong"
        );
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {/* HEADER */}
          <div>
            <h2 className="text-xl font-semibold text-[#7C5A00]">
              {project?.Name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Assign complaint roles to this
              project
            </p>
          </div>

          {/* SELECT */}
          <div className="space-y-3">
            <Select
              mode="multiple"
              placeholder="Select Roles"
              style={{ width: "100%" }}
              value={selectedRoles}
              onChange={(val) =>
                setSelectedRoles(val)
              }
            >
              {roles.map((role) => (
                <Option
                  key={role.id}
                  value={role.name}
                >
                  {role.name}
                </Option>
              ))}
            </Select>

            {/* SELECTED ROLE TAGS */}
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

            {/* SAVE BUTTON */}
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
      )}
    </Modal>
  );
};

export default AssignComplaintRolesModal;
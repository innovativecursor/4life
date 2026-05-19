import {
  Modal,
  Tag,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Badge,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import {
  useAssignStepRoles,
  useGetProjectById,
  useGetStepRoles,
} from "../../hooks/project/useProject";
import { useGetRoles } from "../../hooks/role/useRole";
import toast from "react-hot-toast";
import StepList from "../../pages/steppermissions/StepList";
import ProjectDetailsHeader from "../project/ProjectDetailsHeader";

const { Title, Text } = Typography;
const { Option } = Select;

const statusColor = {
  pending: "default",
  in_progress: "processing",
  completed: "success",
};

const StepPermissionsModal = ({ open, onClose, projectId }) => {
  const { data, isLoading } = useGetProjectById(projectId, open);
  const { data: stepRoleData } = useGetStepRoles(projectId, open);
  const { data: roleData } = useGetRoles();
  const { mutate, isPending } = useAssignStepRoles();
  const roles = roleData?.roles || [];
  const project = data?.project;
  const steps = data?.steps || [];

  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    if (!open) return;

    const steps = stepRoleData?.steps;

    if (Array.isArray(steps)) {
      const map = {};

      steps.forEach((item) => {
        map[item.step_id] = item.roles || [];
      });

      setSelectedRoles(map);
    } else {
      setSelectedRoles({});
    }
  }, [open, projectId, stepRoleData]);

  const handleSave = (stepId) => {
    const roles = selectedRoles[stepId];
    // if (!roles || !roles.length) {
    //   return toast.error("Select at least one role");
    // }
    const payload = {
      timeline_step_id: stepId,
      roles,
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
      width={800}
      title={null}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          <ProjectDetailsHeader project={project} />

          <Divider />

          <StepList
            steps={steps}
            renderRight={(step) => (
              <div className="flex flex-col md:flex-row gap-2  md:mt-0 mt-4 w-full">
                <Select
                  mode="multiple"
                  placeholder="Select Role"
                  style={{ width: 240 }}
                  value={selectedRoles[step.step_id] || []}
                  onChange={(val) =>
                    setSelectedRoles((prev) => ({
                      ...prev,
                      [step.step_id]: val,
                    }))
                  }
                >
                  {roles.map((role) => (
                    <Option key={role.id} value={role.name}>
                      {role.name}
                    </Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  loading={isPending}
                  style={{
                    backgroundColor: "#D97706",
                    borderColor: "#D97706",
                  }}
                  onClick={() => handleSave(step.step_id)}
                >
                  Save
                </Button>
              </div>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

export default StepPermissionsModal;

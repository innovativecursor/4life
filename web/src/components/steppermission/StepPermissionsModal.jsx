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
import { useGetProjectById } from "../../hooks/project/useProject";
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
  const { data: roleData } = useGetRoles();

  const roles = roleData?.roles || [];
  const project = data?.project;
  const steps = data?.steps || [];

  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    if (steps.length) {
      const map = {};
      steps.forEach((s) => {
        if (s.role_id) {
          map[s.step_id] = s.role_id;
        }
      });
      setSelectedRoles(map);
    }
  }, [steps]);

  const handleSave = (stepId) => {
    const roleId = selectedRoles[stepId];

    if (!roleId) return toast.error("Select role first");

    console.log("SAVE:", { stepId, roleId });

    toast.success("Permission saved");
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
              <Space>
                <Select
                  placeholder="Select Role"
                  style={{ width: 160 }}
                  value={selectedRoles[step.step_id]}
                  onChange={(val) =>
                    setSelectedRoles((prev) => ({
                      ...prev,
                      [step.step_id]: val,
                    }))
                  }
                >
                  {roles.map((role) => (
                    <Option key={role.id} value={role.id}>
                      {role.name}
                    </Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#D97706",
                    borderColor: "#D97706",
                  }}
                  onClick={() => handleSave(step.step_id)}
                >
                  Save
                </Button>
              </Space>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

export default StepPermissionsModal;

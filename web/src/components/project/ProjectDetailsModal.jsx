import { Modal, Upload, Button, Space, Divider, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  useGetProjectById,
  useUpdateStepStatus,
} from "../../hooks/project/useProject";
import StepList from "../../pages/steppermissions/StepList";
import ProjectDetailsHeader from "./ProjectDetailsHeader";
import { useState } from "react";
import toast from "react-hot-toast";

const { Option } = Select;
const { Dragger } = Upload;

const ProjectDetailsModal = ({ open, onClose, projectId }) => {
  const { data, isLoading, refetch } = useGetProjectById(projectId, open);
  const { mutate, isPending } = useUpdateStepStatus();

  const [statusMap, setStatusMap] = useState({});
  const [fileMap, setFileMap] = useState({});
  const [previewMap, setPreviewMap] = useState({});

  const project = data?.project;
  const steps = data?.steps || [];

  //  base64 converter
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // upload handler
  const handleUpload = async (file, stepId) => {
    const base64 = await toBase64(file);
    const cleanBase64 = base64.split(",")[1];

    setFileMap((prev) => {
      const existing = prev[stepId] || [];

      if (existing.length >= 5) {
        toast.error("Max 5 images allowed");
        return prev;
      }

      return {
        ...prev,
        [stepId]: [...existing, cleanBase64],
      };
    });

    setPreviewMap((prev) => {
      const existing = prev[stepId] || [];
      return {
        ...prev,
        [stepId]: [...existing, base64],
      };
    });

    return false;
  };

  // remove image
  const removeImage = (stepId, index) => {
    setFileMap((prev) => {
      const updated = [...(prev[stepId] || [])];
      updated.splice(index, 1);
      return { ...prev, [stepId]: updated };
    });

    setPreviewMap((prev) => {
      const updated = [...(prev[stepId] || [])];
      updated.splice(index, 1);
      return { ...prev, [stepId]: updated };
    });
  };

  const handleSave = (step) => {
    const status = statusMap[step.step_id];
    const images = fileMap[step.step_id] || [];

    if (!status) {
      return toast.error("Status required");
    }

    if (!images.length) {
      return toast.error("At least 1 image required");
    }

    const payload = {
      project_id: project.ID,
      timeline_step_id: step.step_id,
      status,
      images,
    };

    mutate(payload, {
      onSuccess: (res) => {
        toast.success(res?.message || "Updated");
        refetch();
        setFileMap({});
        setPreviewMap({});
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed");
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={850}
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
              <div className="space-y-2">
                <Space align="start">
                  <Select
                    placeholder="Status"
                    style={{ width: 140 }}
                    value={statusMap[step.step_id]}
                    onChange={(val) =>
                      setStatusMap((prev) => ({
                        ...prev,
                        [step.step_id]: val,
                      }))
                    }
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="in_progress">In Progress</Option>
                    <Option value="completed">Completed</Option>
                  </Select>

                  <Dragger
                    multiple
                    showUploadList={false}
                    beforeUpload={(file) => handleUpload(file, step.step_id)}
                    style={{ width: 200 }}
                  >
                    <p className="text-xs">Drag / Upload</p>
                  </Dragger>

                  <Button
                    type="primary"
                    loading={isPending}
                    onClick={() => handleSave(step)}
                    style={{
                      backgroundColor: "#D97706",
                      borderColor: "#D97706",
                    }}
                  >
                    Save
                  </Button>
                </Space>

                <div className="flex gap-2 flex-wrap">
                  {(previewMap[step.step_id] || []).map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeImage(step.step_id, i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

export default ProjectDetailsModal;

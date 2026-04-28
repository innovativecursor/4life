import {
  Modal,
  Tag,
  Upload,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Badge,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useGetProjectById } from "../../hooks/project/useProject";
import StepList from "../../pages/steppermissions/StepList";
import ProjectDetailsHeader from "./ProjectDetailsHeader";

const { Title, Text } = Typography;

const statusColor = {
  pending: "default",
  in_progress: "processing",
  completed: "success",
};

const ProjectDetailsModal = ({ open, onClose, projectId }) => {
  const { data, isLoading } = useGetProjectById(projectId, open);

  const project = data?.project;
  const steps = data?.steps || [];

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

          {/*  STEPS */}

          <StepList
            steps={steps}
            renderRight={(step) => (
              <Space>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#D97706",
                    borderColor: "#D97706",
                  }}
                >
                  Update
                </Button>

                <Upload showUploadList={false} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Space>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

export default ProjectDetailsModal;

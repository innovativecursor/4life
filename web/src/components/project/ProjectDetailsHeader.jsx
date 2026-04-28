import { Tag, Typography } from "antd";

const { Title, Text } = Typography;

const ProjectDetailsHeader = ({ project }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <Title level={4} style={{ marginBottom: 0 }}>
          {project?.Name}
        </Title>

        <Text type="secondary">{project?.Description || "No description"}</Text>

        <div className="mt-2 flex gap-2">
          <Tag color="gold">{project?.Market}</Tag>
          <Tag color="blue">{project?.Timeline?.Name}</Tag>
        </div>
      </div>

      <div className="text-right mt-5">
        <Text strong>{project?.CreatedAt?.split("T")[0]}</Text>
      </div>
    </div>
  );
};

export default ProjectDetailsHeader;

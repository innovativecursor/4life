import React, { useState } from "react";
import { useGetProjects } from "../../hooks/project/useProject";
import { Table, Tag, Space, Button } from "antd";
import ProjectDetailsModal from "./ProjectDetailsModal";
import CreateComplaintModal from "./CreateComplaintModal";
import ViewComplaintsModal from "./ViewComplaintsModal";

const ProjectList = ({
  onRowClick,
  title = "Project List",
  showComplaintActions = false,
}) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetProjects(page, 10);
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = data?.projects || [];
  const pagination = data?.pagination || {};

  const [complaintProject, setComplaintProject] = useState(null);

  const [viewComplaintProject, setViewComplaintProject] = useState(null);

  const columns = [
    {
      title: "#",
      width: 60,
      render: (_, __, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: "Project",
      render: (_, record) => (
        <div>
          <p className="font-medium text-gray-800">{record.Name}</p>
          <p className="text-xs text-gray-400">
            {record.Description || "No description"}
          </p>
        </div>
      ),
    },
    {
      title: "Market",
      render: (_, record) => (
        <Tag className="bg-[#FFF1CC] text-[#7C5A00] border-none">
          {record.Market}
        </Tag>
      ),
    },
    {
      title: "Timeline",
      render: (_, record) => (
        <div>
          <p className="text-sm font-medium text-gray-700">
            {record.Timeline?.Name}
          </p>
          <p className="text-xs text-gray-400">
            {record.Timeline?.IsDefault ? "Default" : "Custom"}
          </p>
        </div>
      ),
    },
    {
      title: "Created",
      render: (_, record) => (
        <span className="text-gray-500 text-sm">
          {record.CreatedAt?.split("T")[0]}
        </span>
      ),
    },

    ...(showComplaintActions
      ? [
          {
            title: "Actions",

            render: (_, record) => (
              <Space>
                <Button
                  type="primary"
                  size="small"
                  style={{
                    backgroundColor: "#D97706",
                    borderColor: "#D97706",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();

                    setComplaintProject(record.ID);
                  }}
                >
                  Create Complaint
                </Button>

                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();

                    setViewComplaintProject(record.ID);
                  }}
                >
                  View Complaints
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white border border-[#F1E5C6] rounded-2xl shadow-sm overflow-hidden">
      {/* Top */}
      <div className="px-6 py-4 border-b border-[#F1E5C6] flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#7C5A00]"> {title}</h2>

        <span className="text-sm text-gray-400">
          Total: {pagination.total || 0}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="ID"
          loading={isLoading}
          scroll={{ x: 900 }}
          onRow={(record) => ({
            onClick: () => {
              if (onRowClick) {
                onRowClick(record);
              } else {
                setSelectedProject(record.ID);
              }
            },
          })}
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.limit,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
          className="custom-table"
        />
      </div>

      {showComplaintActions && (
        <>
          <CreateComplaintModal
            open={!!complaintProject}
            projectId={complaintProject}
            onClose={() => setComplaintProject(null)}
          />

          <ViewComplaintsModal
            open={!!viewComplaintProject}
            projectId={viewComplaintProject}
            onClose={() => setViewComplaintProject(null)}
          />
        </>
      )}

      {!onRowClick && (
        <ProjectDetailsModal
          open={!!selectedProject}
          projectId={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectList;

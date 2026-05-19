import React, { useState } from "react";

import ProjectList from "../../components/project/ProjectList";
import AssignComplaintRolesModal from "./AssignComplaintRolesModal";

const AssignComplaintRoles = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="space-y-12 mt-6">
      <ProjectList
        title="Assign Complaint Roles"
        onRowClick={(record) => setSelectedProject(record.ID)}
      />

      <AssignComplaintRolesModal
        open={!!selectedProject}
        projectId={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default AssignComplaintRoles;

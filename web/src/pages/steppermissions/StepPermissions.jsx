import React, { useState } from "react";
import ProjectList from "../../components/project/ProjectList";
import StepPermissionsModal from "../../components/steppermission/StepPermissionsModal";

const StepPermissions = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <ProjectList
        title="Step Permissions"
        onRowClick={(record) => setSelectedProject(record.ID)}
      />

      <StepPermissionsModal
        open={!!selectedProject}
        projectId={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default StepPermissions;

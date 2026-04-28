import React from "react";
import CreateProject from "../../components/project/CreateProject";
import ProjectList from "../../components/project/ProjectList";

const Project = () => {
  return (
    <div className="space-y-12 mt-6">
      <div className="bg-gradient-to-r from-[#FFF1CC] to-[#FFF8E7] border border-[#F1E5C6] rounded-2xl p-5 md:flex  justify-between items-center shadow-sm">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-semibold text-[#7C5A00]">Projects</h2>
          <p className="text-sm text-gray-500">
            Manage all your projects in one place
          </p>
        </div>

        <CreateProject />
      </div>

      {/* Table */}
      <ProjectList />
    </div>
  );
};

export default Project;

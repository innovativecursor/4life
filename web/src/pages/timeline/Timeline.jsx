import React from "react";
import AddTimeline from "../../components/timeline/AddTimeline";
import TimelineList from "../../components/timeline/TimelineList";

const Timeline = () => {
  return (
    <div className="space-y-12 mt-6">
      <div className="bg-gradient-to-r from-[#FFF1CC] to-[#FFF8E7] border border-[#F1E5C6] rounded-2xl p-5 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-[#7C5A00]">Projects</h2>
          <p className="text-sm text-gray-500">
            Manage all your projects in one place
          </p>
        </div>

        <AddTimeline />
      </div>

      <TimelineList />
    </div>
  );
};

export default Timeline;

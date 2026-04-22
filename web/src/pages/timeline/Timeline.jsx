import React from "react";
import AddTimeline from "../../components/timeline/AddTimeline";
import TimelineList from "../../components/timeline/TimelineList";

const Timeline = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E7] to-[#FFF1CC] md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <AddTimeline />
        <TimelineList />
      </div>
    </div>
  );
};

export default Timeline;

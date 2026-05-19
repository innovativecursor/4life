import React, { useState } from "react";
import { useGetTimelines } from "../../hooks/timeline/useTimeline";
import EditTimeline from "./EditTimeline";

const TimelineList = () => {
  const { data, isLoading } = useGetTimelines();
  const [selected, setSelected] = useState(null);

  if (isLoading) return <p>Loading...</p>;

  const timelines = data?.timelines || [];

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {timelines.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-xl border border-[#F1E5C6]"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{item.name}</h3>

              <button
                onClick={() => setSelected(item)}
                className="text-sm text-blue-500"
              >
                Edit
              </button>
            </div>

            {/* Steps */}
            <ul className="mt-4 space-y-2">
              {item.steps?.map((step) => (
                <li
                  key={step.id}
                  className="bg-[#FFF8E7] px-3 py-2 rounded-lg border"
                >
                  <span className="font-medium mr-2">{step.step_order}.</span>
                  {step.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      <EditTimeline
        open={!!selected}
        timeline={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default TimelineList;

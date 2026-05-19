import React from "react";
import { useGetTimelines } from "../../hooks/timeline/useTimeline";

const Dashboard = () => {
  const { data, isLoading } = useGetTimelines();

  const defaultTimeline = data?.timelines?.find((item) => item?.is_default);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center mt-10 gap-4 mb-10">
        <h1 className="text-xl font-semibold text-black">
          {defaultTimeline?.name}
        </h1>

        <div className="bg-white rounded-full px-5 py-2 text-sm font-medium text-secondary shadow-sm">
          Default
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 overflow-x-auto">
        <div className="flex items-start min-w-max">
          {defaultTimeline?.steps?.map((step, index) => {
            const isCompleted = index < 2;
            const isProgress = index === 2;

            return (
              <div key={step.id} className="flex items-start">
                <div className="min-w-[260px]">
                  <div className="flex items-center">
                    <div
                      className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center
                        ${
                          isCompleted || isProgress
                            ? "border-secondary"
                            : "border-[#D8D8D8]"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full
                          ${
                            isCompleted || isProgress
                              ? "bg-secondary"
                              : "bg-white"
                          }`}
                      />
                    </div>

                    {index !== defaultTimeline.steps.length - 1 && (
                      <div
                        className={`w-[200px] h-[4px] rounded-full mx-3
                          ${index < 3 ? "bg-secondary" : "bg-[#E5E5E5]"}`}
                      />
                    )}
                  </div>

                  <div className="mt-5">
                    <p className="uppercase text-sm text-[#B0B0B0]">
                      Step {step.step_order}
                    </p>

                    <h2 className="text-sm leading-5 font-medium text-[#222] mt-3 max-w-[220px]">
                      {step.name}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

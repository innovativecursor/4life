// import React from "react";
// import { useGetTimelines } from "../../hooks/timeline/useTimeline";

// const TimelineList = () => {
//   const { data, isLoading } = useGetTimelines();

//   if (isLoading) return <p className="p-4">Loading...</p>;

//   const timelines = data?.timelines || [];

//   return (
//     <div className="grid md:grid-cols-2 gap-6">
//       {timelines.map((item) => (
//         <div
//           key={item.id}
//           className="relative bg-white/70 backdrop-blur-xl border border-[#F1E5C6] rounded-3xl p-6 shadow-md hover:shadow-xl transition"
//         >
//           {/* Header */}
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-[#7C5A00]">
//               {item.name}
//             </h3>

//             {item.is_default && (
//               <span className="text-xs px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706]">
//                 Default
//               </span>
//             )}
//           </div>

//           {/* Timeline vertical */}
//           <div className="relative pl-6">
//             {/* vertical line */}
//             <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-[#F1E5C6]" />

//             {item.steps.map((step, index) => (
//               <div key={step.id} className="relative mb-6">
//                 {/* dot */}
//                 <div className="absolute -left-[10px] w-5 h-5 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] border-2 border-white shadow" />

//                 {/* content */}
//                 <div className="bg-[#FFF8E7] border border-[#F1E5C6] rounded-xl px-4 py-2">
//                   <p className="text-sm text-gray-700">
//                     <span className="font-medium text-[#7C5A00] mr-2">
//                       {index + 1}.
//                     </span>
//                     {step.name}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TimelineList;





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
          <div key={item.id} className="bg-white p-6 rounded-xl">

            {/* Header */}
            <div className="flex justify-between">
              <h3>{item.name}</h3>

              <button
                onClick={() => setSelected(item)}
                className="text-sm text-blue-500"
              >
                Edit
              </button>
            </div>

            {/* Steps */}
            <ul className="mt-4">
              {item.steps?.map((s) => (
                <li key={s.id}>
                  {s.step_order}. {s.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 🔥 Modal */}
      <EditTimeline
        open={!!selected}
        timeline={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default TimelineList;
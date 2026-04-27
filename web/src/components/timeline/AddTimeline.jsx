import React, { useState } from "react";
import { useAddTimeline } from "../../hooks/timeline/useTimeline";
import toast from "react-hot-toast";

const AddTimeline = () => {
  const [name, setName] = useState("");
  const [steps, setSteps] = useState("");

  const { mutate, isPending } = useAddTimeline();

  const handleSubmit = () => {
    if (!name || !steps) return toast.error("All fields required");

    const payload = {
      name,
      steps: steps.split(",").map((s) => s.trim()),
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Timeline added");
        setName("");
        setSteps("");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed");
      },
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-[#F1E5C6] rounded-3xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-[#7C5A00] mb-5">
        Create Timeline
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-xl border border-[#F1E5C6] bg-white focus:ring-2 focus:ring-[#F59E0B] outline-none"
          placeholder="Timeline Name"
        />

        {/* Steps */}
        <input
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="p-3 rounded-xl border border-[#F1E5C6] bg-white focus:ring-2 focus:ring-[#F59E0B] outline-none"
          placeholder="Steps (comma separated)"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-5 w-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white py-3 rounded-xl font-medium shadow-md hover:scale-[1.02] transition"
      >
        {isPending ? "Adding..." : "Add Timeline"}
      </button>
    </div>
  );
};

export default AddTimeline;
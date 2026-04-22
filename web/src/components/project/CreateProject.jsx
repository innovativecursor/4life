import React, { useState } from "react";
import { useGetTimelines } from "../../hooks/timeline/useTimeline";
import { useAddProject } from "../../hooks/project/useProject";
import toast from "react-hot-toast";

const CreateProject = () => {
  const { data } = useGetTimelines();
  const timelines = data?.timelines || [];

  const { mutate, isPending } = useAddProject();

  const [form, setForm] = useState({
    name: "",
    description: "",
    market: "",
    timeline_id: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.market || !form.timeline_id) {
      return toast.error("Name, Market, and Timeline are required");
    }

    mutate(form, {
      onSuccess: () => {
        toast.success("Project created");
        setForm({
          name: "",
          description: "",
          market: "",
          timeline_id: "",
        });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed");
      },
    });
  };
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-[#F1E5C6] rounded-3xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-5 text-[#7C5A00]">
        Create Project
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Name */}
        <input
          className="p-3 rounded-xl border border-[#F1E5C6]"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Market */}
        <input
          className="p-3 rounded-xl border border-[#F1E5C6]"
          placeholder="Market"
          value={form.market}
          onChange={(e) => setForm({ ...form, market: e.target.value })}
        />

        {/* Description */}
        <input
          className="p-3 rounded-xl border border-[#F1E5C6] md:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* 🔥 Timeline Dropdown */}
        <select
          className="p-3 rounded-xl border border-[#F1E5C6]"
          value={form.timeline_id}
          onChange={(e) =>
            setForm({ ...form, timeline_id: Number(e.target.value) })
          }
        >
          <option value="" hidden>
            Select Timeline
          </option>

          {timelines.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-5 w-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white py-3 rounded-xl"
      >
        {isPending ? "Creating..." : "Create Project"}
      </button>
    </div>
  );
};

export default CreateProject;

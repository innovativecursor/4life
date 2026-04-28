import React, { useState } from "react";
import { Modal, Input } from "antd";
import { useAddTimeline } from "../../hooks/timeline/useTimeline";
import toast from "react-hot-toast";

const AddTimeline = () => {
  const [open, setOpen] = useState(false);
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
        setOpen(false);
        setName("");
        setSteps("");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed");
      },
    });
  };

  return (
    <>
      {/* 🔥 CTA Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#D97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition"
      >
        + Create Timeline
      </button>

      {/* 🔥 Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold text-[#7C5A00]">
            Create Timeline
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={isPending}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "#D97706",
            borderColor: "#D97706",
          },
        }}
        cancelButtonProps={{
          style: {
            color: "#D97706",
            borderColor: "#F3E6C9",
          },
        }}
      >
        <div className="space-y-5 mt-3">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Timeline Name</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter timeline name"
              className="rounded-lg"
            />
          </div>

          {/* Steps */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Steps</p>
            <Input
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="steps"
              className="rounded-lg"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate steps using commas
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddTimeline;

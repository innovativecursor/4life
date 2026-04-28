import React, { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import { useUpdateTimeline } from "../../hooks/timeline/useTimeline";
import toast from "react-hot-toast";

const EditTimeline = ({ open, onClose, timeline }) => {
  const { mutate, isPending } = useUpdateTimeline();

  const [name, setName] = useState("");
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (timeline) {
      setName(timeline.name);

      setSteps(
        timeline.steps?.map((s) => ({
          id: s.id,
          name: s.name,
          step_order: s.step_order,
        })) || [],
      );
    }
  }, [timeline]);

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, { name: "", step_order: steps.length + 1 }]);
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name) return toast.error("Name required");
    if (steps.some((s) => !s.step_order)) {
      return toast.error("Step order required");
    }

    const payload = {
      timeline_id: timeline.id,
      name,
      steps: steps.map((s) => ({
        ...(s.id && { id: s.id }),
        name: s.name,
        step_order: s.step_order,
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Updated");
        onClose();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed");
      },
    });
  };

  return (
    <Modal
      title={
        <span className="text-lg font-semibold text-[#7C5A00]">
          Edit Timeline
        </span>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isPending}
      okText="Update"
      okButtonProps={{
        style: {
          backgroundColor: "#D97706",
          borderColor: "#D97706",
        },
      }}
    >
      <div className="space-y-6">
        {/* Timeline Name */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Timeline Name</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter timeline name"
            className="rounded-lg"
          />
        </div>

        {/* Steps Header */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-600">Steps</p>

          <button
            onClick={addStep}
            className="text-sm px-3 py-1.5 rounded-lg border border-[#D97706] text-[#D97706] hover:bg-[#FFF3E0] transition"
          >
            + Add Step
          </button>
        </div>

        {/* Steps List */}
        <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
          {steps.map((step, i) => (
            <div
              key={step.id || i}
              className="flex items-center gap-3 bg-white border border-[#F3E6C9] rounded-xl px-3 py-3 shadow-sm hover:shadow-md transition"
            >
              {/* Index */}
              <div className="text-sm font-semibold text-[#D97706] w-6">
                {i + 1}
              </div>

              {/* Step Name */}
              <Input
                value={step.name}
                onChange={(e) => handleStepChange(i, "name", e.target.value)}
                placeholder="Step name"
                className="border-0 shadow-none focus:shadow-none"
              />

              {/* Order */}
              <Input
                type="number"
                value={step.step_order}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleStepChange(i, "step_order", isNaN(val) ? 0 : val);
                }}
                className="w-20 rounded-md"
              />

              {/* Delete */}
              <button
                onClick={() => removeStep(i)}
                className="text-gray-400 hover:text-red-500 text-lg transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default EditTimeline;

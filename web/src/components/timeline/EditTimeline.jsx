import React, { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import { useUpdateTimeline } from "../../hooks/timeline/useTimeline";
import toast from "react-hot-toast";

const EditTimeline = ({ open, onClose, timeline }) => {
  const { mutate, isPending } = useUpdateTimeline();

  const [name, setName] = useState("");
  const [steps, setSteps] = useState([]);

  // ✅ PREFILL (IMPORTANT)
  useEffect(() => {
    if (timeline) {
      setName(timeline.name || "");
      setSteps(
        timeline.steps?.map((s) => ({
          id: s.id,
          name: s.name,
          step_order: s.step_order,
        })) || []
      );
    }
  }, [timeline]);

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        name: "",
        step_order: steps.length + 1,
      },
    ]);
  };

  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  const handleSubmit = () => {
    if (!name) return toast.error("Name required");

    const payload = {
      timeline_id: timeline.id,
      name,
      steps: steps.map((s, i) => ({
        ...(s.id && { id: s.id }), // ✅ only if exists
        name: s.name,
        step_order: i + 1,
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Timeline updated");
        onClose();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed");
      },
    });
  };

  return (
    <Modal
      title="Edit Timeline"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isPending}
      okButtonProps={{ className: "custom-ok-btn" }}
    >
      <div className="space-y-4">

        {/* Name */}
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Timeline Name"
        />

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.id || i} className="flex gap-2">
              
              <Input
                value={step.name}
                onChange={(e) =>
                  handleStepChange(i, "name", e.target.value)
                }
                placeholder="Step name"
              />

              <Input
                type="number"
                value={step.step_order}
                onChange={(e) =>
                  handleStepChange(i, "step_order", Number(e.target.value))
                }
                className="w-20"
              />

              <button
                onClick={() => removeStep(i)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Step */}
        <button
          onClick={addStep}
          className="text-[#D97706] text-sm"
        >
          + Add Step
        </button>
      </div>
    </Modal>
  );
};

export default EditTimeline;
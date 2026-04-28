import React, { useState } from "react";
import { useGetTimelines } from "../../hooks/timeline/useTimeline";
import { useAddProject } from "../../hooks/project/useProject";
import { Modal, Input, Select } from "antd";
import { getNames } from "country-list";
import toast from "react-hot-toast";

const { Option } = Select;

const CreateProject = () => {
  const { data } = useGetTimelines();
  const timelines = data?.timelines || [];

  const countries = getNames();

  const { mutate, isPending } = useAddProject();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    market: "",
    timeline_id: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.market || !form.timeline_id) {
      return toast.error("Name, Market, and Timeline required");
    }

    mutate(form, {
      onSuccess: () => {
        toast.success("Project created");
        setOpen(false);
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
    <div>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#b45309] text-white px-5 py-2.5 w-full md:w-fit rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition"
      >
        + Create Project
      </button>

      {/* Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold text-[#7C5A00]">
            Create Project
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={isPending}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{
          className: "custom-ok-btn",
        }}
        cancelButtonProps={{
          style: {
            color: "#D97706",
            borderColor: "#F3E6C9",
          },
        }}
      >
        <div className="space-y-4 mt-2">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Project Name</label>
            <Input
              placeholder="Enter project name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Market (Country Dropdown) */}
          <div>
            <label className="text-sm text-gray-600">Market</label>
            <Select
              showSearch
              placeholder="Select country"
              value={form.market || undefined}
              onChange={(value) => setForm({ ...form, market: value })}
              style={{ width: "100%" }}
              optionFilterProp="children"
            >
              {countries.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <Input.TextArea
              rows={3}
              placeholder="Enter description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="text-sm text-gray-600">Timeline</label>
            <Select
              placeholder="Select timeline"
              value={form.timeline_id || undefined}
              onChange={(value) => setForm({ ...form, timeline_id: value })}
              style={{ width: "100%" }}
            >
              {timelines.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateProject;

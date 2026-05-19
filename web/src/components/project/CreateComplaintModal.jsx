import React, { useState } from "react";

import { Modal, Input, Upload, Button } from "antd";

import { PlusOutlined } from "@ant-design/icons";

import toast from "react-hot-toast";

import { useCreateComplaint } from "../../hooks/project/useProject";

const { TextArea } = Input;

const CreateComplaintModal = ({ open, onClose, projectId }) => {
  const { mutate, isPending } = useCreateComplaint();

  const [text, setText] = useState("");
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);

  // BASE64
  const convertBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = reader.result.split(",")[1];

        resolve(base64);
      };

      reader.onerror = reject;
    });

  // UPLOAD
  const handleUpload = async ({ fileList: newFileList }) => {
    try {
      setFileList(newFileList);

      const base64Images = await Promise.all(
        newFileList.map(async (file) => {
          const originFile = file.originFileObj;

          if (!originFile) return null;

          return await convertBase64(originFile);
        }),
      );

      const filteredImages = base64Images.filter(Boolean);

      setImages(filteredImages);
    } catch (error) {
      console.log(error);
    }
  };

  // SAVE
  const handleSubmit = () => {
    if (!text) {
      return toast.error("Complaint text required");
    }

    const payload = {
      project_id: projectId,
      text,
      images,
    };

    mutate(payload, {
      onSuccess: (res) => {
        toast.success(res?.message || "Complaint created");

        setText("");

        setImages([]);

        setFileList([]);

        onClose();
      },

      onError: (err) => {
        toast.error(err?.response?.data?.error || "Something went wrong");
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Create Complaint"
    >
      <div className="space-y-4">
        <div className="mb-5">
          <TextArea
            rows={4}
            placeholder="Enter complaint"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="mb-5 w-full">
          <Upload
            multiple
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUpload}
          >
            <Button icon={<PlusOutlined />}>Upload Images</Button>
          </Upload>
        </div>

        <Button
          type="primary"
          loading={isPending}
          onClick={handleSubmit}
          style={{
            backgroundColor: "#D97706",
            borderColor: "#D97706",
          }}
        >
          Submit Complaint
        </Button>
      </div>
    </Modal>
  );
};

export default CreateComplaintModal;

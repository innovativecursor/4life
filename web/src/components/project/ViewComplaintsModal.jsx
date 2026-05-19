import React from "react";

import { Modal } from "antd";

import { useGetComplaints } from "../../hooks/project/useProject";

const ViewComplaintsModal = ({
  open,
  onClose,
  projectId,
}) => {
  const { data, isLoading } =
    useGetComplaints(projectId, open);

  const complaints =
    data?.complaints || [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title="Complaints"
    >
      <div className="space-y-4 max-h-[500px] overflow-y-auto">

        {isLoading && <p>Loading...</p>}

        {!complaints.length &&
          !isLoading && (
            <p>No complaints found</p>
          )}

        {complaints.map((item, index) => (
          <div
            key={index}
            className="border border-[#F1E5C6] rounded-xl p-4"
          >
            <p className="text-gray-700">
              {item.text}
            </p>

            {!!item.images?.length && (
              <div className="flex gap-3 flex-wrap mt-4">
                {item.images.map(
                  (img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ViewComplaintsModal;
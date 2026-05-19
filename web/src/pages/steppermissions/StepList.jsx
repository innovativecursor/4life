import { Card, Row, Col, Typography, Space, Badge } from "antd";

const { Text } = Typography;

const statusColor = {
  pending: "default",
  in_progress: "processing",
  completed: "success",
};

const StepList = ({ steps = [], renderRight }) => {
  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      {steps.map((step) => {
        const images = step.images || [];

        return (
          <Card
            key={step.step_id}
            size="small"
            style={{
              borderRadius: 14,
              border: "1px solid #F3E6C9",
              background: "#FFFBF2",
            }}
            bodyStyle={{ padding: 16 }}
          >
            <Row 
            align="middle" justify="space-between" gutter={16}
            >
              <Col flex="auto">
                <Space direction="vertical" size={4}>
                  <Text strong style={{ fontSize: 15 }}>
                    {step.step_order}. {step.name}
                  </Text>

                  <Badge
                    status={statusColor[step.status]}
                    text={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {step.status.replace("_", " ")}
                      </Text>
                    }
                  />
                </Space>
              </Col>

              <Col>{renderRight && renderRight(step)}</Col>
            </Row>

            {images.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="step"
                    className="w-14 h-14 object-cover rounded-xl border border-gray-200 hover:scale-105 transition duration-200"
                  />
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </Space>
  );
};

export default StepList;






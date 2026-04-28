import { Card, Row, Col, Typography, Space, Badge } from "antd";

const { Text } = Typography;

const statusColor = {
  pending: "default",
  in_progress: "processing",
  completed: "success",
};

const StepList = ({ steps = [], renderRight }) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {steps.map((step) => (
        <Card
          key={step.step_id}
          size="small"
          style={{
            borderRadius: 12,
            borderColor: "#F3E6C9",
          }}
        >
          <Row align="middle" justify="space-between">
            {/* LEFT */}
            <Col>
              <Space direction="vertical" size={2}>
                <Text strong>
                  {step.step_order}. {step.name}
                </Text>

                <Badge
                  status={statusColor[step.status]}
                  text={<Text type="secondary">{step.status}</Text>}
                />
              </Space>
            </Col>

            {/* RIGHT (dynamic) */}
            <Col>{renderRight && renderRight(step)}</Col>
          </Row>
        </Card>
      ))}
    </Space>
  );
};

export default StepList;

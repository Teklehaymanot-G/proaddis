// src/components/PageHeader.jsx
import { Flex, Space, Typography } from "antd";

const PageHeader = ({ title, description, actions }) => (
  <Flex justify="space-between" align="flex-start" gap={16} wrap style={{ marginBottom: 24 }}>
    <div style={{ minWidth: 0 }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      {description && (
        <Typography.Text type="secondary">{description}</Typography.Text>
      )}
    </div>
    {actions && <Space wrap>{actions}</Space>}
  </Flex>
);

export default PageHeader;

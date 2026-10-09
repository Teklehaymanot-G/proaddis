// src/pages/Dashboard.jsx
import { Link, useOutletContext } from "react-router-dom";
import { Badge, Card, Col, Empty, List, Row, Skeleton, Statistic, Tag, Typography } from "antd";
import {
  AppstoreOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import { formatDateTime } from "../components/format";

const StatCard = ({ to, title, value, icon }) => (
  <Col xs={12} lg={6}>
    <Link to={to}>
      <Card hoverable>
        <Statistic title={title} value={value} prefix={icon} />
      </Card>
    </Link>
  </Col>
);

const StatusRow = ({ label, ok, okText, badText, to }) => (
  <List.Item extra={<Link to={to}>Open</Link>}>
    <List.Item.Meta title={label} />
    <Tag color={ok ? "success" : "warning"}>{ok ? okText : badText}</Tag>
  </List.Item>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { overview } = useOutletContext();

  if (!overview) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <Skeleton active paragraph={{ rows: 8 }} />
      </>
    );
  }

  const { messages, content, users, system, backups } = overview;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name}. You are signed in as ${user.role.name}.`}
      />

      <Row gutter={[16, 16]}>
        {messages && (
          <StatCard
            to="/messages"
            title="Unread messages"
            value={messages.unread}
            icon={<InboxOutlined />}
          />
        )}
        {content && (
          <>
            <StatCard
              to="/content/services"
              title="Services"
              value={content.services}
              icon={<AppstoreOutlined />}
            />
            <StatCard
              to="/content/portfolio"
              title="Portfolio projects"
              value={content.projects}
              icon={<FolderOpenOutlined />}
            />
            <StatCard
              to="/content/clients"
              title="Clients"
              value={content.clients}
              icon={<ShopOutlined />}
            />
          </>
        )}
        {users && (
          <StatCard
            to="/access/users"
            title="Active users"
            value={users.active}
            icon={<TeamOutlined />}
          />
        )}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {messages && (
          <Col xs={24} lg={14}>
            <Card
              title="Latest messages"
              extra={<Link to="/messages">All messages ({messages.total})</Link>}
              styles={{ body: { paddingBlock: 4 } }}
            >
              {messages.recent.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No messages yet. Contact form submissions appear here."
                />
              ) : (
                <List
                  dataSource={messages.recent}
                  renderItem={(message) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Badge status={message.read ? "default" : "processing"} />}
                        title={
                          <Link to="/messages" state={{ openId: message.id }}>
                            {message.name}
                          </Link>
                        }
                        description={
                          <Typography.Text type="secondary" ellipsis style={{ maxWidth: "100%" }}>
                            {message.message}
                          </Typography.Text>
                        }
                      />
                      <Typography.Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(message.createdAt)}
                      </Typography.Text>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        )}

        {(system || backups) && (
          <Col xs={24} lg={10}>
            <Card title="System status" styles={{ body: { paddingBlock: 4 } }}>
              <List>
                {system && (
                  <>
                    <StatusRow
                      label="Email sending"
                      ok={system.emailConfigured}
                      okText="Configured"
                      badText="Not set up"
                      to="/settings/email"
                    />
                    <StatusRow
                      label="Google Analytics"
                      ok={system.analyticsEnabled}
                      okText="Tracking on"
                      badText="Off"
                      to="/settings/analytics"
                    />
                  </>
                )}
                {backups && (
                  <StatusRow
                    label="Last backup"
                    ok={Boolean(backups.latest)}
                    okText={formatDateTime(backups.latest)}
                    badText="Never"
                    to="/backups"
                  />
                )}
              </List>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Dashboard;

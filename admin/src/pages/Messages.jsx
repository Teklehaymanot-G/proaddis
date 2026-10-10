// src/pages/Messages.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import {
  App,
  Badge,
  Button,
  Card,
  Descriptions,
  Drawer,
  Input,
  Popconfirm,
  Segmented,
  Space,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  MailOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import PageState from "../components/PageState";
import DataTable from "../components/DataTable";
import { formatDateTime } from "../components/format";

const Messages = () => {
  const { message: toast } = App.useApp();
  const { can } = useAuth();
  const canManage = can("messages.manage");
  const location = useLocation();
  const { refreshOverview } = useOutletContext();

  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [openId, setOpenId] = useState(location.state?.openId ?? null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setMessages((await api.getMessages()).messages);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action, successText) => {
    setBusy(true);
    try {
      await action();
      await load();
      refreshOverview();
      if (successText) toast.success(successText);
    } catch (actionError) {
      toast.error(actionError.message);
    } finally {
      setBusy(false);
    }
  };

  const setRead = (ids, read, successText) =>
    run(() => api.setMessagesRead(ids, read), successText);

  const remove = (ids) =>
    run(async () => {
      await api.deleteMessages(ids);
      setSelected((keys) => keys.filter((key) => !ids.includes(key)));
      if (ids.includes(openId)) setOpenId(null);
    }, ids.length === 1 ? "Message deleted" : `${ids.length} messages deleted`);

  const open = (record) => {
    setOpenId(record.id);
    if (canManage && !record.read) setRead([record.id], true);
  };

  const unreadCount = messages?.filter((m) => !m.read).length || 0;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (messages || []).filter(
      (m) =>
        (filter === "all" || !m.read) &&
        (!term ||
          [m.name, m.email, m.subject, m.company, m.message].some((text) =>
            text?.toLowerCase().includes(term),
          )),
    );
  }, [messages, filter, search]);

  const current = messages?.find((m) => m.id === openId);

  const columns = [
    {
      title: "From",
      width: 260,
      render: (_, m) => (
        <Space align="start">
          <Badge status={m.read ? "default" : "processing"} />
          <span>
            <Typography.Text strong={!m.read} style={{ display: "block" }}>
              {m.name}
            </Typography.Text>
            <Typography.Text type="secondary">{m.email}</Typography.Text>
          </span>
        </Space>
      ),
    },
    {
      title: "Message",
      ellipsis: true,
      render: (_, m) => (
        <>
          {m.subject && <Typography.Text strong={!m.read}>{m.subject} — </Typography.Text>}
          <Typography.Text type="secondary">{m.message}</Typography.Text>
        </>
      ),
    },
    {
      title: "Received",
      dataIndex: "createdAt",
      width: 190,
      render: formatDateTime,
    },
  ];

  return (
    <>
      <PageHeader
        title="Messages"
        description="Everything sent through the website contact form."
        actions={
          <Button icon={<ReloadOutlined />} onClick={load}>
            Refresh
          </Button>
        }
      />

      <PageState loading={!messages && !error} error={error} onRetry={load}>
        <Card styles={{ body: { padding: 0 } }}>
          <Space wrap style={{ padding: 16, width: "100%", justifyContent: "space-between" }}>
            <Space wrap>
              <Segmented
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "all", label: `All (${messages?.length || 0})` },
                  { value: "unread", label: `Unread (${unreadCount})` },
                ]}
              />
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search messages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 240 }}
              />
            </Space>
            {canManage && selected.length > 0 && (
              <Space wrap>
                <Typography.Text type="secondary">{selected.length} selected</Typography.Text>
                <Button onClick={() => setRead(selected, true, "Marked as read")}>
                  Mark as read
                </Button>
                <Button onClick={() => setRead(selected, false, "Marked as unread")}>
                  Mark as unread
                </Button>
                <Popconfirm
                  title={`Delete ${selected.length} message(s)?`}
                  description="This cannot be undone."
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => remove(selected)}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </Space>

          <DataTable
            rowKey="id"
            columns={columns}
            dataSource={visible}
            loading={busy}
            scroll={{ x: 720 }}
            rowSelection={
              canManage ? { selectedRowKeys: selected, onChange: setSelected } : undefined
            }
            onRow={(record) => ({
              onClick: () => open(record),
              style: { cursor: "pointer" },
            })}
            pagination={{ pageSize: 15, showSizeChanger: false, style: { marginRight: 16 } }}
            locale={{
              emptyText:
                filter === "unread" || search
                  ? "No messages match"
                  : "No messages yet. Contact form submissions appear here.",
            }}
          />
        </Card>
      </PageState>

      <Drawer
        title={current?.subject || "Message"}
        open={Boolean(current)}
        onClose={() => setOpenId(null)}
        width={560}
        extra={
          current && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              href={`mailto:${current.email}?subject=${encodeURIComponent(
                `Re: ${current.subject || "Your message to ProAddis Marketing"}`,
              )}`}
            >
              Reply by email
            </Button>
          )
        }
      >
        {current && (
          <>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Name">{current.name}</Descriptions.Item>
              <Descriptions.Item label="Email">
                <a href={`mailto:${current.email}`}>{current.email}</a>
              </Descriptions.Item>
              {current.phone && (
                <Descriptions.Item label="Phone">
                  <a href={`tel:${current.phone.replace(/[^\d+]/g, "")}`}>{current.phone}</a>
                </Descriptions.Item>
              )}
              {current.company && (
                <Descriptions.Item label="Company">{current.company}</Descriptions.Item>
              )}
              <Descriptions.Item label="Received">
                {formatDateTime(current.createdAt)}
              </Descriptions.Item>
            </Descriptions>

            <Typography.Paragraph
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 24 }}
            >
              {current.message}
            </Typography.Paragraph>

            {canManage && (
              <Space style={{ marginTop: 16 }}>
                <Button
                  icon={<MailOutlined />}
                  onClick={() => setRead([current.id], !current.read)}
                >
                  Mark as {current.read ? "unread" : "read"}
                </Button>
                <Popconfirm
                  title="Delete this message?"
                  description="This cannot be undone."
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => remove([current.id])}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default Messages;

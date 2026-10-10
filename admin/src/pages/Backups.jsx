// src/pages/Backups.jsx
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  HistoryOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import PageState from "../components/PageState";
import DataTable from "../components/DataTable";
import { formatDateTime, formatSize } from "../components/format";

const KIND = [
  { prefix: "before-restore", label: "Before restore", color: "gold" },
  { prefix: "uploaded", label: "Uploaded", color: "purple" },
  { prefix: "backup", label: "Manual", color: "blue" },
];

const kindOf = (name) => KIND.find((kind) => name.startsWith(kind.prefix)) || KIND[2];

const Backups = () => {
  const { message } = App.useApp();
  const { can, refresh } = useAuth();
  const canRestoreAccess = can("users.manage");

  const [backups, setBackups] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(""); // which action is running
  const [restoring, setRestoring] = useState(null); // backup chosen for restore
  const [includeAccess, setIncludeAccess] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setBackups((await api.getBackups()).backups);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (key, action, successText) => {
    setBusy(key);
    try {
      const result = await action();
      if (result?.backups) setBackups(result.backups);
      if (successText) message.success(successText);
      return result;
    } catch (actionError) {
      message.error(actionError.message);
      return null;
    } finally {
      setBusy("");
    }
  };

  const create = () => run("create", api.createBackup, "Backup created");

  const uploadFile = (file) => {
    run("upload", () => api.uploadBackup(file), "Backup file added to the list");
    return false; // handled here, not by antd
  };

  const restore = async () => {
    const result = await run(
      "restore",
      () => api.restoreBackup(restoring.name, includeAccess),
      "Backup restored",
    );
    if (!result) return;
    setRestoring(null);
    // Restoring users may have changed this account
    if (includeAccess) refresh();
  };

  const columns = [
    {
      title: "Backup",
      render: (_, backup) => {
        const kind = kindOf(backup.name);
        return (
          <Space direction="vertical" size={2}>
            <Typography.Text strong>{formatDateTime(backup.createdAt)}</Typography.Text>
            <Space size={8}>
              <Tag color={kind.color}>{kind.label}</Tag>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {backup.name}
              </Typography.Text>
            </Space>
          </Space>
        );
      },
    },
    { title: "Size", dataIndex: "size", width: 110, render: formatSize },
    {
      title: "Actions",
      width: 280,
      align: "right",
      render: (_, backup) => (
        <Space size={4}>
          <Button
            icon={<DownloadOutlined />}
            loading={busy === `download:${backup.name}`}
            onClick={() => run(`download:${backup.name}`, () => api.downloadBackup(backup.name))}
          >
            Download
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => {
              setIncludeAccess(false);
              setRestoring(backup);
            }}
          >
            Restore
          </Button>
          <Popconfirm
            title="Delete this backup?"
            description="The backup file is removed from the server."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => run("delete", () => api.deleteBackup(backup.name), "Backup deleted")}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete backup" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Backup & restore"
        description="A backup contains the website content, settings, messages, users and uploaded files."
        actions={
          <>
            <Upload accept=".zip" showUploadList={false} beforeUpload={uploadFile}>
              <Button icon={<CloudUploadOutlined />} loading={busy === "upload"}>
                Upload backup file
              </Button>
            </Upload>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={busy === "create"}
              onClick={create}
            >
              Create backup
            </Button>
          </>
        }
      />

      <PageState loading={!backups && !error} error={error} onRetry={load}>
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <Alert
            type="info"
            showIcon
            message="Keep a copy somewhere else"
            description="Backups listed here are stored on the same server as the website. Download important ones to your computer or cloud storage so they survive a server problem."
          />

          <Card styles={{ body: { padding: 0 } }}>
            <DataTable
              rowKey="name"
              columns={columns}
              dataSource={backups || []}
              scroll={{ x: 720 }}
              pagination={
                (backups?.length || 0) > 10
                  ? { pageSize: 10, showSizeChanger: false, style: { marginRight: 16 } }
                  : false
              }
              locale={{ emptyText: "No backups yet. Create the first one now." }}
            />
          </Card>
        </Space>
      </PageState>

      <Modal
        title="Restore this backup?"
        open={Boolean(restoring)}
        onCancel={() => setRestoring(null)}
        onOk={restore}
        okText="Restore backup"
        okButtonProps={{ danger: true }}
        confirmLoading={busy === "restore"}
        destroyOnClose
      >
        {restoring && (
          <Space direction="vertical" size={16}>
            <Typography.Text>
              Backup from <strong>{formatDateTime(restoring.createdAt)}</strong>
            </Typography.Text>
            <Alert
              type="warning"
              showIcon
              message="This replaces the current website content, settings and messages"
              description="Anything changed since this backup was made will be lost. A backup of the current state is created first, so you can undo this."
            />
            <Tooltip
              title={
                canRestoreAccess ? "" : "Restoring users and roles needs the Manage users permission"
              }
            >
              <Checkbox
                checked={includeAccess}
                disabled={!canRestoreAccess}
                onChange={(e) => setIncludeAccess(e.target.checked)}
              >
                Also restore users, passwords and roles
              </Checkbox>
            </Tooltip>
            {includeAccess && (
              <Alert
                type="error"
                showIcon
                message="Sign-in details will go back to what they were in the backup"
                description="Users added since then are removed and changed passwords are reverted. You may need to sign in again with your old password."
              />
            )}
          </Space>
        )}
      </Modal>
    </>
  );
};

export default Backups;

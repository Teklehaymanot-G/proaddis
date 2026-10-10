// src/pages/Users.jsx
import { useCallback, useEffect, useState } from "react";
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import PageState from "../components/PageState";
import DataTable from "../components/DataTable";
import { SwitchField } from "../components/FormLayout";
import { formatDateTime } from "../components/format";

const Users = () => {
  const { message } = App.useApp();
  const { user: me, refresh } = useAuth();

  const [users, setUsers] = useState(null);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // user object, or {} for a new one
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setError("");
    try {
      const [usersResult, rolesResult] = await Promise.all([
        api.getUsers(),
        api.getRoles(),
      ]);
      setUsers(usersResult.users);
      setRoles(rolesResult.roles);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isNew = editing && !editing.id;
  const isSelf = editing?.id === me.id;

  // Only roles that do not exceed the signed-in user's own permissions
  const assignable = (role) =>
    role.permissions.every((key) => me.permissions.includes(key));

  const openEditor = (user) => {
    form.resetFields();
    form.setFieldsValue(
      user.id
        ? { name: user.name, email: user.email, roleId: user.role.id, isActive: user.isActive }
        : { isActive: true },
    );
    setEditing(user);
  };

  const submit = async (values) => {
    setSaving(true);
    try {
      const result = isNew
        ? await api.createUser(values)
        : await api.updateUser(editing.id, values);
      setUsers(result.users);
      setEditing(null);
      message.success(isNew ? "User created" : "User updated");
      if (isSelf) refresh();
    } catch (saveError) {
      message.error(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user) => {
    try {
      setUsers((await api.deleteUser(user.id)).users);
      message.success("User deleted");
    } catch (deleteError) {
      message.error(deleteError.message);
    }
  };

  const columns = [
    {
      title: "User",
      render: (_, user) => (
        <>
          <Typography.Text strong style={{ display: "block" }}>
            {user.name} {user.id === me.id && <Tag>You</Tag>}
          </Typography.Text>
          <Typography.Text type="secondary">{user.email}</Typography.Text>
        </>
      ),
    },
    {
      title: "Role",
      width: 180,
      render: (_, user) => (
        <Tag color={user.role.isSystem ? "blue" : "default"}>{user.role.name}</Tag>
      ),
    },
    {
      title: "Status",
      width: 120,
      render: (_, user) =>
        user.isActive ? <Tag color="success">Active</Tag> : <Tag>Deactivated</Tag>,
    },
    {
      title: "Last sign-in",
      dataIndex: "lastLoginAt",
      width: 190,
      render: (value) => (value ? formatDateTime(value) : "Never"),
    },
    {
      title: "Actions",
      width: 110,
      align: "right",
      render: (_, user) => (
        <Space size={0}>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={`Edit ${user.name}`}
              onClick={() => openEditor(user)}
            />
          </Tooltip>
          <Popconfirm
            title={`Delete ${user.name}?`}
            description="They will no longer be able to sign in."
            okText="Delete"
            okButtonProps={{ danger: true }}
            disabled={user.id === me.id}
            onConfirm={() => remove(user)}
          >
            <Tooltip title={user.id === me.id ? "You cannot delete yourself" : "Delete"}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={`Delete ${user.name}`}
                disabled={user.id === me.id}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Users"
        description="People who can sign in to this admin panel."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor({})}>
            New user
          </Button>
        }
      />

      <PageState loading={!users && !error} error={error} onRetry={load}>
        <Card styles={{ body: { padding: 0 } }}>
          <DataTable
            rowKey="id"
            columns={columns}
            dataSource={users || []}
            scroll={{ x: 760 }}
            pagination={
              (users?.length || 0) > 15
                ? { pageSize: 15, showSizeChanger: false, style: { marginRight: 16 } }
                : false
            }
          />
        </Card>
      </PageState>

      <Modal
        title={isNew ? "New user" : `Edit ${editing?.name || "user"}`}
        open={Boolean(editing)}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText={isNew ? "Create user" : "Save changes"}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          onFinish={submit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="name"
            label="Full name"
            rules={[{ required: true, message: "Enter the user's name" }]}
          >
            <Input maxLength={150} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            extra="Used to sign in."
            rules={[
              { required: true, message: "Enter an email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="Role"
            extra={isSelf ? "You cannot change your own role." : "Decides what this user may do."}
            rules={[{ required: true, message: "Choose a role" }]}
          >
            <Select
              disabled={isSelf}
              options={roles.map((role) => ({
                value: role.id,
                label: role.name,
                disabled: !assignable(role),
              }))}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={isNew ? "Password" : "New password"}
            extra={
              isNew
                ? "At least 8 characters. Share it with the user privately."
                : "Leave empty to keep the current password."
            }
            rules={[
              { required: isNew, message: "Enter a password" },
              { min: 8, message: "At least 8 characters" },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="isActive" valuePropName="checked" noStyle>
            <SwitchField
              title="Active"
              description={
                isSelf
                  ? "You cannot deactivate yourself."
                  : "Deactivated users cannot sign in but are kept in the list."
              }
              disabled={isSelf}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Users;

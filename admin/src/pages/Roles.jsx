// src/pages/Roles.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  App,
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import PageState from "../components/PageState";
import DataTable from "../components/DataTable";

const Roles = () => {
  const { message } = App.useApp();
  const { user: me } = useAuth();

  const [roles, setRoles] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // role object, or {} for a new one
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setError("");
    try {
      const result = await api.getRoles();
      setRoles(result.roles);
      setPermissions(result.permissions);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Permissions grouped the way they are shown: [["Messages", [...]], ...]
  const groups = useMemo(() => {
    const map = new Map();
    for (const permission of permissions) {
      if (!map.has(permission.group)) map.set(permission.group, []);
      map.get(permission.group).push(permission);
    }
    return [...map.entries()];
  }, [permissions]);

  const isNew = editing && !editing.id;
  // The built-in role and the user's own role can be looked at, not changed
  const readOnly = Boolean(editing?.isSystem || (editing?.id && editing.id === me.role.id));

  const openEditor = (role) => {
    form.resetFields();
    form.setFieldsValue(
      role.id
        ? { name: role.name, description: role.description, permissions: role.permissions }
        : { permissions: [] },
    );
    setEditing(role);
  };

  const submit = async (values) => {
    setSaving(true);
    try {
      const result = isNew
        ? await api.createRole(values)
        : await api.updateRole(editing.id, values);
      setRoles(result.roles);
      setEditing(null);
      message.success(isNew ? "Role created" : "Role updated");
    } catch (saveError) {
      message.error(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (role) => {
    try {
      setRoles((await api.deleteRole(role.id)).roles);
      message.success("Role deleted");
    } catch (deleteError) {
      message.error(deleteError.message);
    }
  };

  const lockReason = (role) => {
    if (role.isSystem) return "The built-in Administrator role cannot be changed";
    if (role.id === me.role.id) return "You cannot change your own role";
    return null;
  };

  const columns = [
    {
      title: "Role",
      render: (_, role) => (
        <>
          <Typography.Text strong style={{ display: "block" }}>
            {role.name} {role.isSystem && <Tag color="blue">Built-in</Tag>}
          </Typography.Text>
          <Typography.Text type="secondary">{role.description}</Typography.Text>
        </>
      ),
    },
    {
      title: "Permissions",
      width: 170,
      render: (_, role) =>
        role.permissions.length === permissions.length
          ? "Full access"
          : `${role.permissions.length} of ${permissions.length}`,
    },
    { title: "Users", dataIndex: "userCount", width: 90 },
    {
      title: "Actions",
      width: 110,
      align: "right",
      render: (_, role) => {
        const locked = lockReason(role);
        const inUse = role.userCount > 0;
        return (
          <Space size={0}>
            <Tooltip title={locked ? "View" : "Edit"}>
              <Button
                type="text"
                icon={locked ? <EyeOutlined /> : <EditOutlined />}
                aria-label={`${locked ? "View" : "Edit"} ${role.name}`}
                onClick={() => openEditor(role)}
              />
            </Tooltip>
            <Popconfirm
              title={`Delete the ${role.name} role?`}
              okText="Delete"
              okButtonProps={{ danger: true }}
              disabled={Boolean(locked) || inUse}
              onConfirm={() => remove(role)}
            >
              <Tooltip
                title={
                  locked ||
                  (inUse ? "Users still have this role. Give them another role first." : "Delete")
                }
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`Delete ${role.name}`}
                  disabled={Boolean(locked) || inUse}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Roles & permissions"
        description="A role is a set of permissions. Give each user the role that fits their job."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor({})}>
            New role
          </Button>
        }
      />

      <PageState loading={!roles && !error} error={error} onRetry={load}>
        <Card styles={{ body: { padding: 0 } }}>
          <DataTable
            rowKey="id"
            columns={columns}
            dataSource={roles || []}
            pagination={false}
            scroll={{ x: 640 }}
          />
        </Card>
      </PageState>

      <Drawer
        title={isNew ? "New role" : readOnly ? editing?.name : `Edit ${editing?.name || "role"}`}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        width={520}
        destroyOnClose
        footer={
          !readOnly && (
            <>
              <Button onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="primary" loading={saving} onClick={() => form.submit()}>
                {isNew ? "Create role" : "Save changes"}
              </Button>
            </>
          )
        }
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          disabled={readOnly}
          onFinish={submit}
        >
          {readOnly && editing && (
            <Typography.Paragraph type="secondary">{lockReason(editing)}.</Typography.Paragraph>
          )}
          <Form.Item
            name="name"
            label="Role name"
            rules={[{ required: true, message: "Enter a role name" }]}
          >
            <Input maxLength={100} placeholder="For example: Content editor" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input maxLength={255} placeholder="What is this role for?" />
          </Form.Item>
          <Form.Item name="permissions" label="Permissions">
            <Checkbox.Group style={{ display: "block" }}>
              {groups.map(([group, items]) => (
                <div key={group} style={{ marginBottom: 16 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ display: "block", marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}
                  >
                    {group}
                  </Typography.Text>
                  <Space direction="vertical" size={8}>
                    {items.map((permission) => {
                      const mine = me.permissions.includes(permission.key);
                      return (
                        <Checkbox
                          key={permission.key}
                          value={permission.key}
                          disabled={readOnly || !mine}
                        >
                          <span style={{ fontWeight: 500 }}>{permission.label}</span>
                          <Typography.Text type="secondary" style={{ display: "block" }}>
                            {permission.description}
                            {!mine && " You do not have this permission yourself."}
                          </Typography.Text>
                        </Checkbox>
                      );
                    })}
                  </Space>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default Roles;

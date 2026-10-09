// src/pages/Profile.jsx
import { useState } from "react";
import { App, Button, Card, Descriptions, Form, Input, Space, Tag } from "antd";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";

const Profile = () => {
  const { message } = App.useApp();
  const { user, setUser } = useAuth();
  const [nameForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const saveName = async ({ name }) => {
    setSavingName(true);
    try {
      const result = await api.updateProfile(name);
      setUser(result.user);
      message.success("Name updated");
    } catch (saveError) {
      message.error(saveError.message);
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async ({ currentPassword, newPassword }) => {
    setSavingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      passwordForm.resetFields();
      message.success("Password changed");
    } catch (saveError) {
      message.error(saveError.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <PageHeader title="My profile" description="Your own account details." />

      <Space direction="vertical" size={24} style={{ width: "100%", maxWidth: 640 }}>
        <Card title="Account">
          <Descriptions column={1} size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={user.role.isSystem ? "blue" : "default"}>{user.role.name}</Tag>
            </Descriptions.Item>
          </Descriptions>
          <Form
            form={nameForm}
            layout="vertical"
            requiredMark={false}
            initialValues={{ name: user.name }}
            onFinish={saveName}
          >
            <Form.Item
              name="name"
              label="Full name"
              rules={[{ required: true, message: "Enter your name" }]}
            >
              <Input maxLength={150} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={savingName}>
              Save name
            </Button>
          </Form>
        </Card>

        <Card title="Change password">
          <Form
            form={passwordForm}
            layout="vertical"
            requiredMark={false}
            onFinish={savePassword}
          >
            <Form.Item
              name="currentPassword"
              label="Current password"
              rules={[{ required: true, message: "Enter your current password" }]}
            >
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New password"
              extra="At least 8 characters."
              rules={[
                { required: true, message: "Enter a new password" },
                { min: 8, message: "At least 8 characters" },
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Repeat new password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Repeat the new password" },
                ({ getFieldValue }) => ({
                  validator: (_, value) =>
                    !value || value === getFieldValue("newPassword")
                      ? Promise.resolve()
                      : Promise.reject(new Error("The passwords do not match")),
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={savingPassword}>
              Change password
            </Button>
          </Form>
        </Card>
      </Space>
    </>
  );
};

export default Profile;

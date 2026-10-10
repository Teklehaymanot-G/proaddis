// src/pages/Profile.jsx
import { useState } from "react";
import { App, Avatar, Button, Form, Input, Space, Tag, Typography } from "antd";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import { FormActions, FormPanel, FormSection } from "../components/FormLayout";

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

      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Form
          form={nameForm}
          layout="vertical"
          requiredMark={false}
          initialValues={{ name: user.name }}
          onFinish={saveName}
        >
          <FormPanel>
            <FormSection
              title="Account"
              description="Your name is shown in the top bar and in the users list."
            >
              <Space size={16} style={{ marginBottom: 24 }}>
                <Avatar size={56} style={{ background: "#006AAB", fontSize: 22 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Typography.Text strong style={{ display: "block" }}>
                    {user.email}
                  </Typography.Text>
                  <Tag color={user.role.isSystem ? "blue" : "default"} style={{ marginTop: 4 }}>
                    {user.role.name}
                  </Tag>
                </div>
              </Space>
              <Form.Item
                name="name"
                label="Full name"
                rules={[{ required: true, message: "Enter your name" }]}
              >
                <Input maxLength={150} />
              </Form.Item>
            </FormSection>
            <FormActions>
              <Button type="primary" htmlType="submit" loading={savingName}>
                Save name
              </Button>
            </FormActions>
          </FormPanel>
        </Form>

        <Form
          form={passwordForm}
          layout="vertical"
          requiredMark={false}
          onFinish={savePassword}
        >
          <FormPanel>
            <FormSection
              title="Password"
              description="Use at least 8 characters. You stay signed in on this device after changing it."
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
            </FormSection>
            <FormActions>
              <Button type="primary" htmlType="submit" loading={savingPassword}>
                Change password
              </Button>
            </FormActions>
          </FormPanel>
        </Form>
      </Space>
    </>
  );
};

export default Profile;

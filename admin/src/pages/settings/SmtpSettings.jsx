// src/pages/settings/SmtpSettings.jsx
import { useEffect, useState } from "react";
import { Alert, App, Button, Col, Form, Input, InputNumber, Row, Space } from "antd";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import PageHeader from "../../components/PageHeader";
import PageState from "../../components/PageState";
import {
  FormActions,
  FormPanel,
  FormSection,
  SwitchField,
} from "../../components/FormLayout";
import useSettings from "./useSettings";

const SOURCE_NOTICE = {
  settings: null,
  environment: {
    type: "info",
    message: "Email is currently using the settings from the server's .env file.",
    description:
      "Saving this form replaces them. The existing password is kept if you leave the password empty and keep the same username.",
  },
  none: {
    type: "warning",
    message: "Email is not set up yet.",
    description:
      "Until it is, contact form messages are still saved under Messages, but no notification emails are sent.",
  },
};

const SmtpSettings = () => {
  const { message } = App.useApp();
  const { user } = useAuth();
  const { settings, error, load, patch } = useSettings();
  const [form] = Form.useForm();
  const [testForm] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [dirty, setDirty] = useState(false);

  const smtp = settings?.smtp;

  useEffect(() => {
    if (smtp) form.setFieldsValue({ ...smtp, password: "" });
  }, [smtp, form]);

  const save = async (values) => {
    setSaving(true);
    try {
      const result = await api.saveSmtp(values);
      patch({ smtp: result.smtp });
      setDirty(false);
      setTestResult(null);
      message.success("Email settings saved");
    } catch (saveError) {
      message.error(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async ({ to }) => {
    setTesting(true);
    setTestResult(null);
    try {
      await api.testSmtp(to);
      setTestResult({
        type: "success",
        message: `Test email sent to ${to}. Check the inbox (and the spam folder).`,
      });
    } catch (testError) {
      setTestResult({
        type: "error",
        message: "The test email could not be sent",
        description: testError.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const notice = smtp && SOURCE_NOTICE[smtp.source];

  return (
    <>
      <PageHeader
        title="Email (SMTP)"
        description="The mail server used to send contact form notifications and automatic replies."
      />

      <PageState loading={!settings && !error} error={error} onRetry={load}>
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          {notice && <Alert showIcon {...notice} />}

          <Form
            form={form}
            layout="vertical"
            requiredMark="optional"
            onFinish={save}
            onValuesChange={() => setDirty(true)}
          >
            <FormPanel>
              <FormSection
                title="Mail server"
                description="Where outgoing email is handed over. Your email provider lists these details as “SMTP settings”."
              >
                <Row gutter={16}>
                  <Col xs={24} sm={16}>
                    <Form.Item
                      name="host"
                      label="SMTP host"
                      extra="Gmail: smtp.gmail.com"
                      rules={[{ required: true, message: "Enter the SMTP host" }]}
                    >
                      <Input placeholder="smtp.example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="port"
                      label="Port"
                      extra="Usually 587"
                      rules={[{ required: true, message: "Enter the port" }]}
                    >
                      <InputNumber min={1} max={65535} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="secure" valuePropName="checked" noStyle>
                  <SwitchField
                    title="Use SSL"
                    description="Turn on for port 465. Leave off for port 587, where encryption starts automatically."
                  />
                </Form.Item>
              </FormSection>

              <FormSection
                title="Sign-in"
                description="The account the server signs in with. The password is stored encrypted and never shown again."
              >
                <Form.Item name="user" label="Username" extra="Usually the full email address.">
                  <Input autoComplete="off" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  extra={
                    smtp?.hasPassword
                      ? "A password is saved. Leave empty to keep it."
                      : "Gmail needs an App Password, not your normal password."
                  }
                >
                  <Input.Password
                    autoComplete="new-password"
                    placeholder={smtp?.hasPassword ? "••••••••" : ""}
                  />
                </Form.Item>
              </FormSection>

              <FormSection
                title="Sender"
                description="How emails from the website appear in the recipient's inbox."
              >
                <Form.Item name="fromName" label="Sender name">
                  <Input placeholder="ProAddis Marketing" />
                </Form.Item>
                <Form.Item
                  name="fromEmail"
                  label="Sender email"
                  extra="Leave empty to use the username."
                  rules={[{ type: "email", message: "Enter a valid email address" }]}
                >
                  <Input />
                </Form.Item>
              </FormSection>

              <FormActions hint={dirty ? "You have unsaved changes" : "All changes saved"}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={saving}
                  disabled={!dirty}
                >
                  Save email settings
                </Button>
              </FormActions>
            </FormPanel>
          </Form>

          <FormPanel>
            <FormSection
              title="Send a test email"
              description="Checks the saved settings by sending a real email."
            >
              <Form
                form={testForm}
                layout="vertical"
                requiredMark={false}
                initialValues={{ to: user.email }}
                onFinish={sendTest}
              >
                <Form.Item
                  name="to"
                  label="Send to"
                  rules={[
                    { required: true, message: "Enter an email address" },
                    { type: "email", message: "Enter a valid email address" },
                  ]}
                >
                  <Input placeholder="you@example.com" />
                </Form.Item>
                <Button
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={testing}
                  disabled={dirty || smtp?.source === "none"}
                >
                  Send test email
                </Button>
              </Form>
              {dirty && (
                <Alert
                  type="info"
                  showIcon
                  message="Save your changes first: the test uses the saved settings."
                  style={{ marginTop: 16 }}
                />
              )}
              {testResult && <Alert showIcon {...testResult} style={{ marginTop: 16 }} />}
            </FormSection>
          </FormPanel>
        </Space>
      </PageState>
    </>
  );
};

export default SmtpSettings;

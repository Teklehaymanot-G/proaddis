// src/pages/settings/SmtpSettings.jsx
import { useEffect, useState } from "react";
import { Alert, App, Button, Card, Col, Form, Input, InputNumber, Row, Space, Switch } from "antd";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import PageHeader from "../../components/PageHeader";
import PageState from "../../components/PageState";
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
      setTestResult({ type: "success", message: `Test email sent to ${to}. Check the inbox (and the spam folder).` });
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

          <Card title="Mail server">
            <Form
              form={form}
              layout="vertical"
              requiredMark="optional"
              onFinish={save}
              onValuesChange={() => setDirty(true)}
              style={{ maxWidth: 720 }}
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
                    extra="Usually 587, or 465 with SSL"
                    rules={[{ required: true, message: "Enter the port" }]}
                  >
                    <InputNumber min={1} max={65535} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="secure"
                label="Use SSL"
                valuePropName="checked"
                extra="Turn on for port 465. Leave off for port 587 (STARTTLS is used automatically)."
              >
                <Switch />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="user" label="Username" extra="Usually the full email address.">
                    <Input autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
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
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="fromName" label="Sender name">
                    <Input placeholder="ProAddis Marketing" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="fromEmail"
                    label="Sender email"
                    extra="Leave empty to use the username."
                    rules={[{ type: "email", message: "Enter a valid email address" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                disabled={!dirty}
              >
                Save email settings
              </Button>
            </Form>
          </Card>

          <Card title="Send a test email">
            <Form
              form={testForm}
              layout="inline"
              initialValues={{ to: user.email }}
              onFinish={sendTest}
            >
              <Form.Item
                name="to"
                rules={[
                  { required: true, message: "Enter an email address" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input placeholder="you@example.com" aria-label="Send test to" style={{ width: 280 }} />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={testing}
                  disabled={dirty || smtp?.source === "none"}
                >
                  Send test
                </Button>
              </Form.Item>
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
          </Card>
        </Space>
      </PageState>
    </>
  );
};

export default SmtpSettings;

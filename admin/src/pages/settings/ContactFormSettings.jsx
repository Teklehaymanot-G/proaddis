// src/pages/settings/ContactFormSettings.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { App, Button, Card, Checkbox, Form, Input, Select, Space, Switch, Table } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import PageHeader from "../../components/PageHeader";
import PageState from "../../components/PageState";
import useSettings from "./useSettings";

const OPTIONAL_FIELDS = [
  { key: "phone", label: "Phone number" },
  { key: "company", label: "Company" },
  { key: "subject", label: "Subject" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactFormSettings = () => {
  const { message } = App.useApp();
  const { settings, error, load, patch } = useSettings();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fields = Form.useWatch("fields", form);
  const autoReplyOn = Form.useWatch(["autoReply", "enabled"], form);

  useEffect(() => {
    if (settings) form.setFieldsValue(settings.contactForm);
  }, [settings, form]);

  const save = async (values) => {
    setSaving(true);
    try {
      const result = await api.saveContactForm(values);
      patch({ contactForm: result.contactForm });
      setDirty(false);
      message.success("Contact form settings saved");
    } catch (saveError) {
      message.error(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const fieldColumns = [
    { title: "Field", dataIndex: "label" },
    {
      title: "Show on the form",
      width: 170,
      render: (_, row) =>
        row.fixed ? (
          <Checkbox checked disabled aria-label={`${row.label} is always shown`} />
        ) : (
          <Form.Item name={["fields", row.key, "show"]} valuePropName="checked" noStyle>
            <Checkbox aria-label={`Show ${row.label}`} />
          </Form.Item>
        ),
    },
    {
      title: "Required",
      width: 120,
      render: (_, row) =>
        row.fixed ? (
          <Checkbox checked disabled aria-label={`${row.label} is always required`} />
        ) : (
          <Form.Item name={["fields", row.key, "required"]} valuePropName="checked" noStyle>
            <Checkbox
              disabled={!fields?.[row.key]?.show}
              aria-label={`${row.label} is required`}
            />
          </Form.Item>
        ),
    },
  ];

  const fieldRows = [
    { key: "name", label: "Name", fixed: true },
    { key: "email", label: "Email", fixed: true },
    ...OPTIONAL_FIELDS,
    { key: "message", label: "Message", fixed: true },
  ];

  return (
    <>
      <PageHeader
        title="Contact form"
        description="What the website contact form asks for and what happens when someone sends it."
      />

      <PageState loading={!settings && !error} error={error} onRetry={load}>
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          onFinish={save}
          onValuesChange={() => setDirty(true)}
        >
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Card title="Form">
              <div style={{ maxWidth: 720 }}>
                <Form.Item
                  name="enabled"
                  label="Accept messages"
                  valuePropName="checked"
                  extra="When off, the website shows that the form is unavailable and nothing can be sent."
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name="successMessage"
                  label="Confirmation shown after sending"
                  rules={[{ required: true, message: "Enter a confirmation message" }]}
                >
                  <Input.TextArea autoSize={{ minRows: 2 }} maxLength={500} showCount />
                </Form.Item>
              </div>
            </Card>

            <Card title="Fields" styles={{ body: { padding: 0 } }}>
              <Table
                rowKey="key"
                columns={fieldColumns}
                dataSource={fieldRows}
                pagination={false}
                size="middle"
              />
            </Card>

            <Card title="Notifications">
              <div style={{ maxWidth: 720 }}>
                <Form.Item
                  name="recipients"
                  label="Send new messages to"
                  extra={
                    <>
                      Type an email address and press Enter. You can add several.
                      {settings?.envRecipient &&
                        ` If empty, ${settings.envRecipient} (from the server's .env file) is used.`}{" "}
                      Sending needs <Link to="/settings/email">Email (SMTP)</Link> to be set up.
                    </>
                  }
                  rules={[
                    {
                      validator: (_, value = []) =>
                        value.every((email) => EMAIL_PATTERN.test(email))
                          ? Promise.resolve()
                          : Promise.reject(new Error("One of these is not a valid email address")),
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    open={false}
                    suffixIcon={null}
                    tokenSeparators={[",", " ", ";"]}
                    placeholder="name@example.com"
                  />
                </Form.Item>
                <Form.Item
                  name="subjectPrefix"
                  label="Email subject"
                  extra="If the visitor fills in a subject it is added after this."
                >
                  <Input maxLength={150} />
                </Form.Item>
              </div>
            </Card>

            <Card title="Automatic reply to the visitor">
              <div style={{ maxWidth: 720 }}>
                <Form.Item
                  name={["autoReply", "enabled"]}
                  label="Send an automatic reply"
                  valuePropName="checked"
                  extra="Emails the visitor straight away to confirm their message arrived."
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name={["autoReply", "subject"]}
                  label="Subject"
                  rules={[{ required: autoReplyOn, message: "Enter a subject" }]}
                >
                  <Input maxLength={150} disabled={!autoReplyOn} />
                </Form.Item>
                <Form.Item
                  name={["autoReply", "body"]}
                  label="Message"
                  extra="{{name}} is replaced with the visitor's name."
                  rules={[{ required: autoReplyOn, message: "Enter the reply message" }]}
                >
                  <Input.TextArea autoSize={{ minRows: 5 }} maxLength={5000} disabled={!autoReplyOn} />
                </Form.Item>
              </div>
            </Card>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              disabled={!dirty}
            >
              Save contact form settings
            </Button>
          </Space>
        </Form>
      </PageState>
    </>
  );
};

export default ContactFormSettings;

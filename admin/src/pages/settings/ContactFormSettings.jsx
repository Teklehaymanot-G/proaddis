// src/pages/settings/ContactFormSettings.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, App, Button, Checkbox, Form, Input, Select, Space, Table } from "antd";
import { EyeOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import PageHeader from "../../components/PageHeader";
import PageState from "../../components/PageState";
import {
  FormActions,
  FormPanel,
  FormSection,
  SwitchField,
} from "../../components/FormLayout";
import useSettings from "./useSettings";
import EmailPreviewModal from "./EmailPreviewModal";

const OPTIONAL_FIELDS = [
  { key: "phone", label: "Phone number" },
  { key: "company", label: "Company" },
  { key: "subject", label: "Subject" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailListRule = {
  validator: (_, value = []) =>
    value.every((email) => EMAIL_PATTERN.test(email))
      ? Promise.resolve()
      : Promise.reject(new Error("One of these is not a valid email address")),
};

// A box where several email addresses can be typed
const EmailList = (props) => (
  <Select
    mode="tags"
    open={false}
    suffixIcon={null}
    tokenSeparators={[",", " ", ";"]}
    placeholder="name@example.com"
    {...props}
  />
);

const ContactFormSettings = () => {
  const { message } = App.useApp();
  const { settings, error, load, patch } = useSettings();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(null); // what the preview dialog shows
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

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

  // Sends the example notification to the saved addresses
  const sendTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await api.testContactEmail();
      const everyone = [...result.recipients, ...result.copyTo];
      setTestResult({
        type: "success",
        message: `Test email sent to ${everyone.join(", ")}. Check the inbox (and the spam folder).`,
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

  const fieldColumns = [
    { title: "Field", dataIndex: "label" },
    {
      title: "Shown",
      width: 110,
      align: "center",
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
      width: 110,
      align: "center",
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
          <FormPanel>
            <FormSection
              title="Availability"
              description="Whether visitors can send messages, and what they see after sending one."
            >
              <Form.Item name="enabled" valuePropName="checked" noStyle>
                <SwitchField
                  title="Accept messages"
                  description="When off, the website shows that the form is unavailable and nothing can be sent."
                />
              </Form.Item>
              <Form.Item
                name="successMessage"
                label="Confirmation shown after sending"
                rules={[{ required: true, message: "Enter a confirmation message" }]}
              >
                <Input.TextArea autoSize={{ minRows: 2 }} maxLength={500} showCount />
              </Form.Item>
            </FormSection>

            <FormSection
              title="Fields"
              description="Name, email and message are always asked. Choose which extra fields to show and whether they must be filled in."
            >
              <Table
                rowKey="key"
                columns={fieldColumns}
                dataSource={fieldRows}
                pagination={false}
                size="middle"
                bordered
              />
            </FormSection>

            <FormSection
              title="Notifications"
              description={
                <>
                  Who is emailed when a new message arrives. Sending needs{" "}
                  <Link to="/settings/email">Email (SMTP)</Link> to be set up.
                </>
              }
            >
              <Form.Item
                name="recipients"
                label="Send new messages to"
                extra={
                  <>
                    Type an email address and press Enter. You can add several.
                    {settings?.envRecipient &&
                      ` If empty, ${settings.envRecipient} (from the server's .env file) is used.`}
                  </>
                }
                rules={[emailListRule]}
              >
                <EmailList />
              </Form.Item>
              <Form.Item
                name="copyTo"
                label="Also send a copy to"
                extra="These addresses receive a copy (CC) of every message, for example a manager or a shared sales inbox."
                rules={[emailListRule]}
              >
                <EmailList />
              </Form.Item>
              <Form.Item
                name="subjectPrefix"
                label="Email subject"
                extra="If the visitor fills in a subject it is added after this."
              >
                <Input maxLength={150} />
              </Form.Item>

              <Space wrap>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() =>
                    setPreview({
                      type: "notification",
                      subjectPrefix: form.getFieldValue("subjectPrefix"),
                    })
                  }
                >
                  Preview email
                </Button>
                <Button
                  icon={<SendOutlined />}
                  loading={testing}
                  disabled={dirty}
                  onClick={sendTest}
                >
                  Send a test email
                </Button>
              </Space>
              {dirty && (
                <Alert
                  type="info"
                  showIcon
                  message="Save your changes first: the test goes to the saved addresses."
                  style={{ marginTop: 16 }}
                />
              )}
              {testResult && <Alert showIcon {...testResult} style={{ marginTop: 16 }} />}
            </FormSection>

            <FormSection
              title="Automatic reply"
              description="An email sent to the visitor straight away to confirm their message arrived."
            >
              <Form.Item name={["autoReply", "enabled"]} valuePropName="checked" noStyle>
                <SwitchField
                  title="Send an automatic reply"
                  description="Uses the subject and message below."
                />
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
                <Input.TextArea
                  autoSize={{ minRows: 5 }}
                  maxLength={5000}
                  disabled={!autoReplyOn}
                />
              </Form.Item>
              <Button
                icon={<EyeOutlined />}
                onClick={() =>
                  setPreview({
                    type: "autoReply",
                    subject: form.getFieldValue(["autoReply", "subject"]),
                    body: form.getFieldValue(["autoReply", "body"]),
                  })
                }
              >
                Preview automatic reply
              </Button>
            </FormSection>

            <FormActions hint={dirty ? "You have unsaved changes" : "All changes saved"}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                disabled={!dirty}
              >
                Save contact form settings
              </Button>
            </FormActions>
          </FormPanel>
        </Form>
      </PageState>

      <EmailPreviewModal request={preview} onClose={() => setPreview(null)} />
    </>
  );
};

export default ContactFormSettings;

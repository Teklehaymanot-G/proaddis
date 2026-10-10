// src/pages/settings/AnalyticsReportsCard.jsx
// Connects the admin to the Google Analytics Data API so the Analytics page
// can show visitor reports.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  App,
  Button,
  Collapse,
  Form,
  Input,
  Popconfirm,
  Space,
  Typography,
  Upload,
} from "antd";
import { ApiOutlined, FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import { FormPanel, FormSection } from "../../components/FormLayout";

const { Text, Link: ExternalLink } = Typography;

const AnalyticsReportsCard = ({ status, onChange }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [keyFile, setKeyFile] = useState(null); // { name, text }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fromEnv = status.source === "environment";

  useEffect(() => {
    form.setFieldsValue({ propertyId: status.propertyId });
  }, [status.propertyId, form]);

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setKeyFile({ name: file.name, text: String(reader.result) });
      setError("");
    };
    reader.readAsText(file);
    return false; // read here, not uploaded by antd
  };

  const connect = async ({ propertyId }) => {
    setSaving(true);
    setError("");
    try {
      const result = await api.saveAnalyticsReports({
        propertyId: propertyId.trim(),
        serviceAccountKey: keyFile?.text || "",
      });
      onChange(result.analyticsReports);
      setKeyFile(null);
      message.success("Connected to Google Analytics");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const disconnect = async () => {
    try {
      const result = await api.clearAnalyticsReports();
      onChange(result.analyticsReports);
      setKeyFile(null);
      message.success("Disconnected");
    } catch (clearError) {
      message.error(clearError.message);
    }
  };

  // A saved key can be reused; the first connection needs a file
  const needsKey = status.source !== "settings";

  return (
    <FormPanel>
      <FormSection
        title="Reports in this admin"
        description="Lets the Analytics page read visitor numbers from Google with a service account."
      >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {status.configured ? (
          <Alert
            type="success"
            showIcon
            message={
              <>
                Connected to property {status.propertyId}.{" "}
                <Link to="/analytics">Open the Analytics page</Link>
              </>
            }
            description={
              <>
                Reading as <Text code>{status.serviceAccount}</Text>
                {fromEnv && " (set in the server's .env file)"}
              </>
            }
          />
        ) : (
          <Alert
            type="info"
            showIcon
            message="Not connected"
            description="Connect a Google service account to see visitor numbers, traffic sources and top pages on the Analytics page."
          />
        )}

        <Form form={form} layout="vertical" requiredMark="optional" onFinish={connect}>
          <Form.Item
            name="propertyId"
            label="Property ID"
            extra="A number such as 123456789. In Google Analytics: Admin → Property details. This is not the G- Measurement ID."
            rules={[
              { required: true, message: "Enter the Property ID" },
              { pattern: /^\s*\d{4,15}\s*$/, message: "The Property ID contains only digits" },
            ]}
          >
            <Input placeholder="123456789" inputMode="numeric" />
          </Form.Item>

          <Form.Item
            label="Service account key (JSON file)"
            required={needsKey}
            extra={
              needsKey
                ? "The key file downloaded from Google Cloud. It is stored encrypted and never shown again."
                : "A key is saved. Choose a file only to replace it."
            }
          >
            <Space wrap>
              <Upload accept=".json,application/json" showUploadList={false} beforeUpload={readFile}>
                <Button icon={<UploadOutlined />}>Choose key file</Button>
              </Upload>
              {keyFile && (
                <Text>
                  <FileTextOutlined /> {keyFile.name}
                </Text>
              )}
            </Space>
          </Form.Item>

          {error && (
            <Alert
              type="error"
              showIcon
              message="Could not connect"
              description={error}
              style={{ marginBottom: 16 }}
            />
          )}

          <Space wrap>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ApiOutlined />}
              loading={saving}
              disabled={needsKey && !keyFile}
            >
              {status.source === "settings" ? "Save and test connection" : "Connect"}
            </Button>
            {status.source === "settings" && (
              <Popconfirm
                title="Disconnect Google Analytics reports?"
                description="The saved key is deleted. The Analytics page stops showing data."
                okText="Disconnect"
                okButtonProps={{ danger: true }}
                onConfirm={disconnect}
              >
                <Button danger>Disconnect</Button>
              </Popconfirm>
            )}
          </Space>
        </Form>

        <Collapse
          size="small"
          items={[
            {
              key: "howto",
              label: "How to get the Property ID and key file (one-time setup)",
              children: (
                <ol style={{ margin: 0, paddingInlineStart: 20, lineHeight: 1.9 }}>
                  <li>
                    Open{" "}
                    <ExternalLink href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                      Google Cloud Console
                    </ExternalLink>{" "}
                    and create a project (or pick an existing one).
                  </li>
                  <li>
                    In that project, enable the{" "}
                    <ExternalLink
                      href="https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Analytics Data API
                    </ExternalLink>
                    .
                  </li>
                  <li>
                    Go to IAM &amp; Admin → Service accounts → Create service account. No roles
                    are needed in Google Cloud.
                  </li>
                  <li>
                    Open the new service account → Keys → Add key → Create new key → JSON. A
                    file downloads: that is the key file.
                  </li>
                  <li>
                    In{" "}
                    <ExternalLink href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                      Google Analytics
                    </ExternalLink>
                    , open Admin → Property access management → add the service account&apos;s
                    email address (it ends with <Text code>iam.gserviceaccount.com</Text>) with
                    the Viewer role.
                  </li>
                  <li>
                    Still in Admin, open Property details and copy the Property ID. Enter it
                    above, choose the key file and press Connect.
                  </li>
                </ol>
              ),
            },
          ]}
        />
      </Space>
      </FormSection>
    </FormPanel>
  );
};

export default AnalyticsReportsCard;

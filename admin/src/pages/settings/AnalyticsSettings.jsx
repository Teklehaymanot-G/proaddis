// src/pages/settings/AnalyticsSettings.jsx
import { useEffect, useState } from "react";
import { Alert, App, Button, Card, Form, Input, Space, Steps, Switch, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import PageHeader from "../../components/PageHeader";
import PageState from "../../components/PageState";
import useSettings from "./useSettings";

const ID_PATTERN = /^G-[A-Za-z0-9]{4,20}$/;

const AnalyticsSettings = () => {
  const { message } = App.useApp();
  const { settings, error, load, patch } = useSettings();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const enabled = Form.useWatch("enabled", form);
  const analytics = settings?.analytics;
  const live = analytics?.enabled && analytics.measurementId;

  useEffect(() => {
    if (analytics) form.setFieldsValue(analytics);
  }, [analytics, form]);

  const save = async (values) => {
    setSaving(true);
    try {
      const result = await api.saveAnalytics({
        enabled: Boolean(values.enabled),
        measurementId: (values.measurementId || "").trim(),
      });
      patch({ analytics: result.analytics });
      setDirty(false);
      message.success("Google Analytics settings saved");
    } catch (saveError) {
      message.error(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Google Analytics"
        description="Measure how many people visit the website and what they look at."
      />

      <PageState loading={!settings && !error} error={error} onRetry={load}>
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <Alert
            showIcon
            type={live ? "success" : "info"}
            message={
              live
                ? `Tracking is on. Visits are reported to ${analytics.measurementId}.`
                : "Tracking is off. The website does not load Google Analytics."
            }
          />

          <Card title="Tracking">
            <Form
              form={form}
              layout="vertical"
              requiredMark="optional"
              onFinish={save}
              onValuesChange={() => setDirty(true)}
              style={{ maxWidth: 480 }}
            >
              <Form.Item
                name="measurementId"
                label="Measurement ID"
                extra="Starts with G- (Google Analytics 4)."
                rules={[
                  { required: enabled, message: "Enter a Measurement ID to turn tracking on" },
                  { pattern: ID_PATTERN, message: "A Measurement ID looks like G-XXXXXXXXXX" },
                ]}
              >
                <Input placeholder="G-XXXXXXXXXX" maxLength={30} />
              </Form.Item>
              <Form.Item name="enabled" label="Track visits" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                disabled={!dirty}
              >
                Save
              </Button>
            </Form>
          </Card>

          <Card title="Where to find the Measurement ID">
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: "Open Google Analytics",
                  description: (
                    <>
                      Go to{" "}
                      <Typography.Link href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                        analytics.google.com
                      </Typography.Link>{" "}
                      and sign in. Create a property for the website if you do not have one.
                    </>
                  ),
                },
                {
                  title: "Open the web data stream",
                  description: "Admin (gear icon) → Data streams → choose the website's stream, or add a Web stream.",
                },
                {
                  title: "Copy the Measurement ID",
                  description: "It is shown at the top right of the stream details and starts with G-.",
                },
                {
                  title: "Paste it above, turn on Track visits and save",
                  description: "Visits show up in Google Analytics under Reports → Realtime within a minute or two.",
                },
              ]}
            />
          </Card>
        </Space>
      </PageState>
    </>
  );
};

export default AnalyticsSettings;

// src/pages/settings/AnalyticsSettings.jsx
import { useEffect, useState } from "react";
import { Alert, App, Button, Card, Form, Input, Space, Steps, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
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
import AnalyticsReportsCard from "./AnalyticsReportsCard";

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
        description="Track visits to the website and show the reports in this admin."
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

          <Form
            form={form}
            layout="vertical"
            requiredMark="optional"
            onFinish={save}
            onValuesChange={() => setDirty(true)}
          >
            <FormPanel>
              <FormSection
                title="Tracking"
                description="Loads the Google tag on the website so visits are counted."
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
                <Form.Item name="enabled" valuePropName="checked" noStyle>
                  <SwitchField
                    title="Track visits"
                    description="When on, the website reports visits to this Measurement ID."
                  />
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
                  Save tracking settings
                </Button>
              </FormActions>
            </FormPanel>
          </Form>

          {settings?.analyticsReports && (
            <AnalyticsReportsCard
              status={settings.analyticsReports}
              onChange={(analyticsReports) => patch({ analyticsReports })}
            />
          )}

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

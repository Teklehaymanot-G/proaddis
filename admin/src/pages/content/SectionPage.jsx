// src/pages/content/SectionPage.jsx
import { useCallback, useEffect, useState } from "react";
import { Alert, App, Button, Card, Form, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import PageHeader from "../../components/PageHeader";
import PageState from "../../components/PageState";
import { FormFields } from "./fields";
import ListCard from "./ListCard";

const SectionPage = ({ section }) => {
  const { message } = App.useApp();
  const { can } = useAuth();
  const canEdit = can("content.edit");

  const [value, setValue] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [form] = Form.useForm();

  const textFields = section.fields.filter((field) => field.type !== "list");
  const listFields = section.fields.filter((field) => field.type === "list");

  const load = useCallback(async () => {
    setError("");
    try {
      const result = await api.getContent();
      setValue(result.content[section.key] || {});
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [section.key]);

  useEffect(() => {
    setValue(null);
    setDirty(false);
    load();
  }, [load]);

  useEffect(() => {
    if (value) form.setFieldsValue(value);
  }, [value, form]);

  // Saves the whole section; returns true when it worked
  const persist = async (next, successText) => {
    setSaving(true);
    try {
      const result = await api.saveSection(section.key, next);
      setValue(result.content);
      message.success(successText);
      return true;
    } catch (saveError) {
      message.error(`Could not save: ${saveError.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveText = async (values) => {
    if (await persist({ ...value, ...values }, "Changes saved")) setDirty(false);
  };

  return (
    <>
      <PageHeader title={section.label} description={section.description} />

      <PageState loading={!value && !error} error={error} onRetry={load}>
        {value && (
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {!canEdit && (
              <Alert
                type="info"
                showIcon
                message="You can view this content but not change it."
              />
            )}

            {textFields.length > 0 && (
              <Card title={listFields.length > 0 ? "Section text" : undefined}>
                <Form
                  form={form}
                  layout="vertical"
                  requiredMark="optional"
                  disabled={!canEdit}
                  onFinish={saveText}
                  onValuesChange={() => setDirty(true)}
                  style={{ maxWidth: 720 }}
                >
                  <FormFields fields={textFields} section={value} disabled={!canEdit} />
                  {canEdit && (
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={saving}
                        disabled={!dirty}
                      >
                        Save changes
                      </Button>
                      {dirty && (
                        <Button
                          onClick={() => {
                            form.setFieldsValue(value);
                            setDirty(false);
                          }}
                        >
                          Discard
                        </Button>
                      )}
                    </Space>
                  )}
                </Form>
              </Card>
            )}

            {listFields.map((field) => (
              <ListCard
                key={field.name}
                field={field}
                section={value}
                canEdit={canEdit}
                saving={saving}
                onChange={(items) =>
                  persist({ ...value, [field.name]: items }, `${field.label} updated`)
                }
              />
            ))}
          </Space>
        )}
      </PageState>
    </>
  );
};

export default SectionPage;

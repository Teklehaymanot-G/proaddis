// src/pages/content/SectionPage.jsx
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, App, Badge, Button, Form, Tabs } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import PageHeader from "../../components/PageHeader";
import PageState from "../../components/PageState";
import { FormActions, FormPanel, FormSection } from "../../components/FormLayout";
import { FormFields } from "./fields";
import ListCard from "./ListCard";

const TEXT_TAB = "section";

const SectionPage = ({ section }) => {
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const textPanel = textFields.length > 0 && (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      disabled={!canEdit}
      onFinish={saveText}
      onValuesChange={() => setDirty(true)}
    >
      <FormPanel>
        <FormSection
          title={listFields.length > 0 ? "Section text" : section.label}
          description={
            listFields.length > 0
              ? "Headings and text shown with this section on the website."
              : section.description
          }
        >
          <FormFields fields={textFields} section={value || {}} disabled={!canEdit} />
        </FormSection>
        {canEdit && (
          <FormActions hint={dirty ? "You have unsaved changes" : "All changes saved"}>
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
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              disabled={!dirty}
            >
              Save changes
            </Button>
          </FormActions>
        )}
      </FormPanel>
    </Form>
  );

  const listPanel = (field) => (
    <ListCard
      field={field}
      section={value}
      canEdit={canEdit}
      saving={saving}
      onChange={(items) =>
        persist({ ...value, [field.name]: items }, `${field.label} updated`)
      }
    />
  );

  // One tab for the section's text and one per list (projects, categories, …)
  const tabs = value
    ? [
        ...(textPanel
          ? [
              {
                key: TEXT_TAB,
                // Kept mounted so the form exists even when another tab opens first
                forceRender: true,
                label: (
                  <span>
                    {section.textTab || "Section"}
                    {dirty && <Badge status="warning" style={{ marginInlineStart: 8 }} />}
                    {dirty && <span className="sr-only"> (unsaved changes)</span>}
                  </span>
                ),
                children: textPanel,
              },
            ]
          : []),
        ...listFields.map((field) => ({
          key: field.name,
          label: (
            <span>
              {field.label}
              <span className="tab-count">{(value[field.name] || []).length}</span>
            </span>
          ),
          children: listPanel(field),
        })),
      ]
    : [];

  const requestedTab = searchParams.get("tab");
  const activeTab = tabs.some((tab) => tab.key === requestedTab)
    ? requestedTab
    : tabs[0]?.key;

  return (
    <>
      <PageHeader title={section.label} description={section.description} />

      <PageState loading={!value && !error} error={error} onRetry={load}>
        {value && (
          <>
            {!canEdit && (
              <Alert
                type="info"
                showIcon
                message="You can view this content but not change it."
                style={{ marginBottom: 16 }}
              />
            )}

            {tabs.length > 1 ? (
              <Tabs
                className="page-tabs"
                activeKey={activeTab}
                // The open tab is kept in the address so refresh and links keep it
                onChange={(key) => setSearchParams({ tab: key }, { replace: true })}
                items={tabs}
              />
            ) : (
              tabs[0]?.children
            )}
          </>
        )}
      </PageState>
    </>
  );
};

export default SectionPage;

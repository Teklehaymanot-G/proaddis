// src/pages/content/fields.jsx
// Ant Design form controls for each field type in schema.js
import { useState } from "react";
import { App, Button, Form, Input, InputNumber, Modal, Select, Space, Upload } from "antd";
import {
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getIcon, iconNames } from "@site/content/icons.js";
import { api, assetUrl } from "../../api/client";

const resolve = (value, section) =>
  typeof value === "function" ? value(section) : value;

const spaced = (name) => name.replace(/([a-z])([A-Z])/g, "$1 $2");

// ---- Icon picker ----

export const IconPreview = ({ name, size = 18 }) => {
  const Icon = getIcon(name);
  return <Icon size={size} strokeWidth={1.75} style={{ verticalAlign: "middle" }} />;
};

const IconSelect = ({ value, onChange, disabled }) => (
  <Select
    showSearch
    value={value}
    onChange={onChange}
    disabled={disabled}
    optionFilterProp="label"
    options={iconNames.map((name) => ({ value: name, label: spaced(name) }))}
    optionRender={(option) => (
      <Space>
        <IconPreview name={option.value} />
        {option.label}
      </Space>
    )}
    labelRender={(option) => (
      <Space>
        <IconPreview name={option.value} />
        {option.label}
      </Space>
    )}
  />
);

// ---- Image / video ----

const fileNameOf = (value) => decodeURIComponent(value.split(/[?#]/)[0].split("/").pop());

// Large view of an image, or a player for a video
export const MediaPreviewModal = ({ value, kind = "image", open, onClose }) => (
  <Modal
    open={open}
    onCancel={onClose}
    title={value ? fileNameOf(value) : "Preview"}
    width={kind === "video" ? 960 : 880}
    centered
    destroyOnClose // stops a playing video when the dialog closes
    footer={
      <Button icon={<ExportOutlined />} href={assetUrl(value)} target="_blank" rel="noopener noreferrer">
        Open in a new tab
      </Button>
    }
  >
    <div className="media-preview">
      {kind === "video" ? (
        <video src={assetUrl(value)} controls autoPlay playsInline />
      ) : (
        <img src={assetUrl(value)} alt={value ? fileNameOf(value) : ""} />
      )}
    </div>
  </Modal>
);

// Small thumbnail; click it to open the preview
export const MediaThumb = ({ value, kind = "image", size = 48 }) => {
  // The file that failed to load, so a new value gets a fresh try
  const [failed, setFailed] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const missing = !value || failed === value;

  const box = {
    width: size * (kind === "video" ? 1.6 : 1),
    height: size,
  };
  const fit = { width: "100%", height: "100%", objectFit: "contain" };

  if (missing) {
    return (
      <div className="media-thumb" style={box}>
        <PictureOutlined />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="media-thumb media-thumb--clickable"
        style={box}
        aria-label={`Preview ${kind}: ${fileNameOf(value)}`}
        onClick={(event) => {
          event.stopPropagation(); // not a click on the table row
          setPreviewOpen(true);
        }}
      >
        {kind === "video" ? (
          <video
            key={value}
            src={assetUrl(value)}
            muted
            playsInline
            preload="metadata"
            onError={() => setFailed(value)}
            style={{ ...fit, objectFit: "cover" }}
          />
        ) : (
          <img src={assetUrl(value)} alt="" onError={() => setFailed(value)} style={fit} />
        )}
        <span className="media-thumb__overlay">
          {kind === "video" ? <PlayCircleOutlined /> : <EyeOutlined />}
        </span>
      </button>
      <MediaPreviewModal
        value={value}
        kind={kind}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

const MediaInput = ({ value, onChange, disabled, kind }) => {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const isVideo = kind === "video";

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const result = await api.uploadMedia(file);
      onChange(result.url);
      message.success(`${isVideo ? "Video" : "Image"} uploaded`);
    } catch (error) {
      message.error(error.message);
    } finally {
      setUploading(false);
    }
    return false; // handled here, not by antd
  };

  return (
    <div className="media-input">
      <MediaThumb value={value} kind={kind} size={72} />
      <Space direction="vertical" size={8} className="media-input__controls">
        <Input
          value={value}
          disabled={disabled}
          placeholder="Upload a file or paste a link"
          onChange={(e) => onChange(e.target.value)}
        />
        <Space wrap>
          <Upload
            accept={
              isVideo
                ? "video/mp4,video/webm"
                : "image/jpeg,image/png,image/webp,image/gif,image/avif"
            }
            showUploadList={false}
            beforeUpload={handleUpload}
            disabled={disabled}
          >
            <Button icon={<UploadOutlined />} loading={uploading} disabled={disabled}>
              Upload {isVideo ? "video" : "image"}
            </Button>
          </Upload>
          {value && (
            <Button
              icon={isVideo ? <PlayCircleOutlined /> : <EyeOutlined />}
              // Stays usable in a read-only form: looking is always allowed
              disabled={false}
              onClick={() => setPreviewOpen(true)}
            >
              Preview
            </Button>
          )}
          {value && !disabled && (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onChange("")}>
              Remove
            </Button>
          )}
        </Space>
      </Space>
      {value && (
        <MediaPreviewModal
          value={value}
          kind={kind}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
};

// ---- Small repeating group inside a form (e.g. case study results) ----

const InlineList = ({ field, path, disabled }) => (
  <Form.List name={path}>
    {(rows, { add, remove }) => (
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        {rows.map((row) => (
          <Space key={row.key} align="baseline" wrap>
            {field.fields.map((sub) => (
              <Form.Item key={sub.name} name={[row.name, sub.name]} noStyle>
                <Input
                  placeholder={sub.placeholder || sub.label}
                  aria-label={sub.label}
                  disabled={disabled}
                  style={{ width: 180, maxWidth: "100%" }}
                />
              </Form.Item>
            ))}
            {!disabled && (
              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                aria-label={`Remove ${field.singular}`}
                onClick={() => remove(row.name)}
              />
            )}
          </Space>
        ))}
        {!disabled && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => add(structuredClone(field.newItem))}
          >
            Add {field.singular}
          </Button>
        )}
      </Space>
    )}
  </Form.List>
);

// ---- Dispatcher ----

const control = (field, section, disabled) => {
  switch (field.type) {
    case "textarea":
      return <Input.TextArea autoSize={{ minRows: 2, maxRows: 8 }} disabled={disabled} />;
    case "number":
      return <InputNumber disabled={disabled} style={{ width: 160 }} />;
    case "select":
      return <Select options={resolve(field.options, section) || []} disabled={disabled} />;
    case "icon":
      return <IconSelect disabled={disabled} />;
    case "image":
    case "video":
      return <MediaInput kind={field.type} disabled={disabled} />;
    case "tags":
      return (
        <Select
          mode="tags"
          open={false}
          suffixIcon={null}
          tokenSeparators={["\n"]}
          placeholder="Type an entry and press Enter"
          disabled={disabled}
        />
      );
    default:
      return <Input placeholder={field.placeholder} disabled={disabled} />;
  }
};

// Renders Form.Items for every non-table field in `fields`
export const FormFields = ({ fields, section, disabled }) =>
  fields.map((field) =>
    field.type === "list" ? (
      <Form.Item key={field.name} label={field.label} extra={field.help}>
        <InlineList field={field} path={field.name} disabled={disabled} />
      </Form.Item>
    ) : (
      <Form.Item
        key={field.name}
        name={field.name}
        label={field.label}
        extra={field.help}
        rules={
          field.required
            ? [{ required: true, message: `${field.label} is required` }]
            : undefined
        }
      >
        {control(field, section, disabled)}
      </Form.Item>
    ),
  );

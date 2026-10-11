// src/pages/settings/EmailPreviewModal.jsx
// Shows an email exactly as it will be sent, with example data
import { useEffect, useState } from "react";
import { Alert, Modal, Segmented, Skeleton, Space, Typography } from "antd";
import { DesktopOutlined, MobileOutlined } from "@ant-design/icons";
import { api } from "../../api/client";

const WIDTHS = { desktop: "100%", phone: 375 };

// `request`: what to preview, e.g. { type: "autoReply", subject, body }; null = closed
const EmailPreviewModal = ({ request, onClose }) => {
  const [email, setEmail] = useState(null);
  const [error, setError] = useState("");
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    if (!request) return;
    let cancelled = false;
    setEmail(null);
    setError("");

    api
      .previewContactEmail(request)
      .then((result) => !cancelled && setEmail(result))
      .catch((previewError) => !cancelled && setError(previewError.message));

    return () => {
      cancelled = true;
    };
  }, [request]);

  return (
    <Modal
      title="Email preview"
      open={Boolean(request)}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnClose
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Text type="secondary">
            Subject:{" "}
            <Typography.Text strong>{email ? email.subject : "…"}</Typography.Text>
          </Typography.Text>
          <Segmented
            value={device}
            onChange={setDevice}
            options={[
              { value: "desktop", icon: <DesktopOutlined />, label: "Desktop" },
              { value: "phone", icon: <MobileOutlined />, label: "Phone" },
            ]}
          />
        </Space>

        {error ? (
          <Alert type="error" showIcon message="Could not load the preview" description={error} />
        ) : !email ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <div className="email-preview">
            <iframe
              title="Email preview"
              // No scripts, forms or navigation: the email is only displayed
              sandbox=""
              srcDoc={email.html}
              style={{ width: WIDTHS[device] }}
            />
          </div>
        )}

        <Typography.Text type="secondary" style={{ fontSize: 12.5 }}>
          Shown with an example message. Real emails contain the visitor&apos;s own details.
        </Typography.Text>
      </Space>
    </Modal>
  );
};

export default EmailPreviewModal;

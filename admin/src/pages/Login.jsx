// src/pages/Login.jsx
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { SITE_URL } from "../api/client";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
  const { status, signIn, notice } = useAuth();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "signedIn") {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  const handleFinish = async ({ email, password }) => {
    setSubmitting(true);
    setError("");
    try {
      await signIn(email, password);
    } catch (loginError) {
      setError(loginError.message);
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "linear-gradient(160deg, #04182a 0%, #06304d 60%, #006AAB 140%)",
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}logo-light.png`}
        alt="ProAddis Marketing"
        style={{ height: 48, marginBottom: 24 }}
      />

      <Card style={{ width: "100%", maxWidth: 400 }}>
        <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
          Sign in
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Admin panel for the ProAddis Marketing website.
        </Typography.Paragraph>

        {(error || notice) && (
          <Alert
            type={error ? "error" : "warning"}
            message={error || notice}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" requiredMark={false} onFinish={handleFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Enter your email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              size="large"
              autoComplete="username"
              autoFocus
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
            Sign in
          </Button>
        </Form>
      </Card>

      <Typography.Link href={SITE_URL} style={{ marginTop: 24, color: "rgba(255, 255, 255, 0.75)" }}>
        ← Back to the website
      </Typography.Link>
    </div>
  );
};

export default Login;

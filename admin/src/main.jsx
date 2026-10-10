// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App as AntApp, ConfigProvider } from "antd";
import { AuthProvider } from "./auth/AuthContext";
import App from "./App";
import "./index.css";

const PAGE_BG = "#e9eef5";
const SIDEBAR_BG = "#04182a";
const FOCUS_RING = "0 0 0 4px rgba(0, 106, 171, 0.14)";

// ProAddis brand colours on top of the standard Ant Design look
const theme = {
  token: {
    colorPrimary: "#006AAB",
    colorLink: "#006AAB",
    borderRadius: 10,
    controlHeight: 40,
    colorBorder: "#d5dde8",
    colorTextPlaceholder: "#9aa7b8",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: PAGE_BG,
      headerBg: "#ffffff",
      headerHeight: 60,
      siderBg: SIDEBAR_BG,
    },
    // Form controls: roomier, with a soft brand-coloured focus ring
    Form: {
      labelColor: "#334155",
      labelFontSize: 13,
      verticalLabelPadding: "0 0 6px",
      itemMarginBottom: 22,
    },
    Input: { paddingInline: 14, activeShadow: FOCUS_RING },
    InputNumber: { paddingInline: 14, activeShadow: FOCUS_RING },
    Select: { activeOutlineColor: "rgba(0, 106, 171, 0.14)" },
    Button: { fontWeight: 500, primaryShadow: "0 1px 2px rgba(0, 106, 171, 0.35)" },
    Card: { borderRadiusLG: 16 },
    Table: { headerBg: "#f6f8fb", headerColor: "#475569" },
    // Dark navy sidebar
    Menu: {
      itemHeight: 40,
      darkItemBg: SIDEBAR_BG,
      darkSubMenuItemBg: "#031220",
      darkPopupBg: SIDEBAR_BG,
      darkItemColor: "rgba(255, 255, 255, 0.72)",
      darkItemHoverColor: "#ffffff",
      darkItemHoverBg: "rgba(255, 255, 255, 0.08)",
      darkItemSelectedBg: "#006AAB",
      darkItemSelectedColor: "#ffffff",
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <AntApp>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);

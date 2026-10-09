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

// ProAddis brand colours on top of the standard Ant Design look
const theme = {
  token: {
    colorPrimary: "#006AAB",
    colorLink: "#006AAB",
    borderRadius: 6,
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
    // Dark navy sidebar
    Menu: {
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

// src/navigation.jsx
// Single list of pages: the sidebar menu, breadcrumbs, routes and permission
// checks are all built from it. Add a new module by adding an entry here.
import {
  AppstoreOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  FileTextOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Backups from "./pages/Backups";
import SectionPage from "./pages/content/SectionPage";
import { sections, siteDetails } from "./pages/content/schema";
import SmtpSettings from "./pages/settings/SmtpSettings";
import ContactFormSettings from "./pages/settings/ContactFormSettings";
import AnalyticsSettings from "./pages/settings/AnalyticsSettings";

const CONTENT = ["content.view", "content.edit"];

// `permissions`: the page is available when the user holds any of them.
// An empty list means every signed-in user.
export const navigation = [
  {
    path: "/",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    permissions: [],
    element: <Dashboard />,
  },
  {
    path: "/content",
    label: "Website content",
    icon: <FileTextOutlined />,
    children: sections.map((section) => ({
      path: `/content/${section.path}`,
      label: section.label,
      permissions: CONTENT,
      element: <SectionPage key={section.key} section={section} />,
    })),
  },
  {
    path: "/messages",
    label: "Messages",
    icon: <InboxOutlined />,
    permissions: ["messages.view", "messages.manage"],
    element: <Messages />,
    badge: "unreadMessages",
  },
  {
    path: "/access",
    label: "Users & roles",
    icon: <TeamOutlined />,
    children: [
      {
        path: "/access/users",
        label: "Users",
        permissions: ["users.manage"],
        element: <Users />,
      },
      {
        path: "/access/roles",
        label: "Roles & permissions",
        icon: <SafetyCertificateOutlined />,
        permissions: ["roles.manage"],
        element: <Roles />,
      },
    ],
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      {
        path: "/settings/site",
        label: siteDetails.label,
        icon: <AppstoreOutlined />,
        permissions: CONTENT,
        element: <SectionPage key="settings" section={siteDetails} />,
      },
      {
        path: "/settings/email",
        label: "Email (SMTP)",
        permissions: ["settings.manage"],
        element: <SmtpSettings />,
      },
      {
        path: "/settings/contact-form",
        label: "Contact form",
        permissions: ["settings.manage"],
        element: <ContactFormSettings />,
      },
      {
        path: "/settings/analytics",
        label: "Google Analytics",
        permissions: ["settings.manage"],
        element: <AnalyticsSettings />,
      },
    ],
  },
  {
    path: "/backups",
    label: "Backup & restore",
    icon: <CloudServerOutlined />,
    permissions: ["backups.manage"],
    element: <Backups />,
  },
];

// Every page (groups flattened), each with its parent group's label
export const pages = navigation.flatMap((item) =>
  item.children
    ? item.children.map((child) => ({ ...child, group: item.label }))
    : [item],
);

export const isAllowed = (page, can) =>
  page.permissions.length === 0 || can(...page.permissions);

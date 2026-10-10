// src/layouts/AdminLayout.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Drawer,
  Dropdown,
  Flex,
  Grid,
  Layout,
  Menu,
  Space,
  Typography,
} from "antd";
import {
  ExportOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { api, SITE_URL } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { isAllowed, navigation, pages } from "../navigation";

const SIDER_WIDTH = 248;
const SIDEBAR_BG = "#04182a"; // same as the theme in main.jsx

const AdminLayout = () => {
  const { user, can, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isDesktop = screens.lg;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overview, setOverview] = useState(null);

  // Dashboard numbers and the unread badge; refreshed on every page change
  const refreshOverview = useCallback(async () => {
    try {
      setOverview((await api.overview()).overview);
    } catch {
      // The pages show their own errors; the badge just stays as it was
    }
  }, []);

  useEffect(() => {
    refreshOverview();
    setDrawerOpen(false);
  }, [location.pathname, refreshOverview]);

  const badges = { unreadMessages: overview?.messages?.unread || 0 };

  const menuItems = useMemo(() => {
    const toItem = (page) => ({
      key: page.path,
      icon: page.icon,
      label: page.badge ? (
        <Flex justify="space-between" align="center">
          {page.label}
          <Badge count={badges[page.badge]} size="small" />
        </Flex>
      ) : (
        page.label
      ),
    });

    return navigation
      .map((item) => {
        if (!item.children) return isAllowed(item, can) ? toItem(item) : null;
        const children = item.children.filter((child) => isAllowed(child, can));
        if (children.length === 0) return null;
        return {
          key: item.path,
          icon: item.icon,
          label: item.label,
          children: children.map((child) => ({ key: child.path, label: child.label })),
        };
      })
      .filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [can, badges.unreadMessages]);

  const currentPage = pages.find((page) => page.path === location.pathname);
  const openGroup = navigation.find((item) =>
    item.children?.some((child) => child.path === location.pathname),
  );

  // Keep the group of the current page open in the sidebar
  const [openKeys, setOpenKeys] = useState(["/content"]);
  useEffect(() => {
    if (openGroup) {
      setOpenKeys((keys) =>
        keys.includes(openGroup.path) ? keys : [...keys, openGroup.path],
      );
    }
  }, [openGroup]);

  const breadcrumb = [
    { title: <Link to="/">Home</Link> },
    ...(currentPage?.group ? [{ title: currentPage.group }] : []),
    ...(currentPage && currentPage.path !== "/"
      ? [{ title: currentPage.label }]
      : location.pathname === "/profile"
        ? [{ title: "My profile" }]
        : []),
  ];

  const menu = (
    <Menu
      mode="inline"
      theme="dark"
      items={menuItems}
      selectedKeys={[location.pathname]}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      onClick={({ key }) => navigate(key)}
      style={{ borderInlineEnd: 0 }}
    />
  );

  const logo = (
    <Link to="/" style={{ display: "block", padding: "20px 24px 16px" }}>
      <img
        src={`${import.meta.env.BASE_URL}logo-light.png`}
        alt="ProAddis Marketing"
        style={{ height: 34, display: "block" }}
      />
    </Link>
  );

  const userMenu = {
    items: [
      { key: "profile", icon: <UserOutlined />, label: "My profile" },
      { type: "divider" },
      { key: "signout", icon: <LogoutOutlined />, label: "Sign out", danger: true },
    ],
    onClick: ({ key }) => (key === "signout" ? signOut() : navigate("/profile")),
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isDesktop ? (
        <Layout.Sider
          width={SIDER_WIDTH}
          theme="dark"
          style={{
            position: "fixed",
            insetBlock: 0,
            insetInlineStart: 0,
            overflowY: "auto",
          }}
        >
          {logo}
          {menu}
        </Layout.Sider>
      ) : (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={SIDER_WIDTH + 32}
          styles={{ body: { padding: 0, background: SIDEBAR_BG } }}
          title={null}
          closable={false}
        >
          {logo}
          {menu}
        </Drawer>
      )}

      <Layout style={{ marginInlineStart: isDesktop ? SIDER_WIDTH : 0 }}>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#fff",
            boxShadow: "0 1px 4px rgba(4, 24, 42, 0.08)",
            paddingInline: isDesktop ? 24 : 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Space size={12} style={{ minWidth: 0 }}>
            {!isDesktop && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                aria-label="Open menu"
                onClick={() => setDrawerOpen(true)}
              />
            )}
            <Breadcrumb items={isDesktop ? breadcrumb : breadcrumb.slice(-1)} />
          </Space>

          <Space size={4}>
            <Button
              type="text"
              icon={<ExportOutlined />}
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isDesktop ? "View website" : null}
            </Button>
            <Dropdown menu={userMenu} trigger={["click"]} placement="bottomRight">
              <Button type="text" style={{ height: 44, paddingInline: 8 }}>
                <Space>
                  <Avatar size="small" style={{ background: "#006AAB" }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {isDesktop && (
                    <span style={{ textAlign: "left", lineHeight: 1.2 }}>
                      <Typography.Text strong style={{ display: "block" }}>
                        {user.name}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {user.role.name}
                      </Typography.Text>
                    </span>
                  )}
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Layout.Header>

        <Layout.Content style={{ padding: isDesktop ? 24 : 12 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Outlet context={{ overview, refreshOverview }} />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

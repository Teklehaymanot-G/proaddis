// src/App.jsx
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Button, Result, Spin } from "antd";
import { useAuth } from "./auth/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { isAllowed, pages } from "./navigation";

// Everything inside needs a signed-in user
const RequireAuth = ({ children }) => {
  const { status, signedOutByChoice } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <Spin size="large" fullscreen />;
  }
  if (status === "signedOut") {
    return (
      <Navigate
        to="/login"
        replace
        state={signedOutByChoice ? null : { from: location.pathname }}
      />
    );
  }
  return children;
};

// A page the signed-in user may not have permission for
const Guarded = ({ page }) => {
  const { can } = useAuth();

  if (!isAllowed(page, can)) {
    return (
      <Result
        status="403"
        title="No access"
        subTitle="Your role does not include this page. Ask an administrator if you need it."
        extra={
          <Link to="/">
            <Button type="primary">Back to dashboard</Button>
          </Link>
        }
      />
    );
  }
  return page.element;
};

const NotFound = () => (
  <Result
    status="404"
    title="Page not found"
    subTitle="This page does not exist or has been moved."
    extra={
      <Link to="/">
        <Button type="primary">Back to dashboard</Button>
      </Link>
    }
  />
);

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      element={
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      }
    >
      {pages.map((page) => (
        <Route key={page.path} path={page.path} element={<Guarded page={page} />} />
      ))}
      <Route path="/profile" element={<Profile />} />
      {/* Group URLs open their first page */}
      <Route path="/content" element={<Navigate to="/content/services" replace />} />
      <Route path="/settings" element={<Navigate to="/settings/site" replace />} />
      <Route path="/access" element={<Navigate to="/access/users" replace />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;

// src/api/client.js
export const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://proaddis.dealstoaddis.com" ||
  "http://localhost:5000"
).replace(/\/$/, "");

export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5173"
    : "https://proaddismarketing.com");

const TOKEN_KEY = "proaddis-admin-token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable: the session lasts until the page is closed
  }
};

// Fired when the server rejects the session so the app can show the login
export const SESSION_EXPIRED = "proaddis-admin-session-expired";

// Uploaded files live on the API server; website assets on the website
export const assetUrl = (value) => {
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${API_URL}${value}`;
  return `${SITE_URL.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
};

const send = async (path, { method = "GET", body, formData } = {}) => {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: formData || (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new Error(
      `Cannot reach the server at ${API_URL}. Check that it is running.`,
    );
  }

  if (response.status === 401 && path !== "/api/auth/login") {
    setToken(null);
    window.dispatchEvent(new Event(SESSION_EXPIRED));
  }

  return response;
};

const request = async (path, options) => {
  const response = await send(path, options);
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.error || `Request failed (${response.status})`);
  }
  return result;
};

const upload = (path, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return request(path, { method: "POST", formData });
};

// Fetches a protected file and hands it to the browser as a download
const download = async (path, fileName) => {
  const response = await send(path);
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Download failed (${response.status})`);
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const post = (path, body) => request(path, { method: "POST", body });
const put = (path, body) => request(path, { method: "PUT", body });
const del = (path) => request(path, { method: "DELETE" });

export const api = {
  // Session
  login: (email, password) => post("/api/auth/login", { email, password }),
  me: () => request("/api/auth/me"),
  updateProfile: (name) => put("/api/auth/profile", { name }),
  changePassword: (currentPassword, newPassword) =>
    post("/api/auth/password", { currentPassword, newPassword }),

  overview: () => request("/api/admin/overview"),

  // Website content
  getContent: () => request("/api/admin/content"),
  saveSection: (section, content) =>
    put(`/api/admin/content/${section}`, content),
  uploadMedia: (file) => upload("/api/admin/upload", file),

  // Messages
  getMessages: () => request("/api/admin/messages"),
  setMessagesRead: (ids, read) =>
    post("/api/admin/messages/read", { ids, read }),
  deleteMessages: (ids) => post("/api/admin/messages/delete", { ids }),

  // Users and roles
  getUsers: () => request("/api/admin/users"),
  createUser: (user) => post("/api/admin/users", user),
  updateUser: (id, user) => put(`/api/admin/users/${id}`, user),
  deleteUser: (id) => del(`/api/admin/users/${id}`),
  getRoles: () => request("/api/admin/roles"),
  createRole: (role) => post("/api/admin/roles", role),
  updateRole: (id, role) => put(`/api/admin/roles/${id}`, role),
  deleteRole: (id) => del(`/api/admin/roles/${id}`),

  // Settings
  getSettings: () => request("/api/admin/settings"),
  saveSmtp: (smtp) => put("/api/admin/settings/smtp", smtp),
  testSmtp: (to) => post("/api/admin/settings/smtp/test", { to }),
  saveContactForm: (form) => put("/api/admin/settings/contact-form", form),
  previewContactEmail: (request) =>
    post("/api/admin/settings/contact-form/preview", request),
  testContactEmail: () => post("/api/admin/settings/contact-form/test"),
  saveAnalytics: (analytics) => put("/api/admin/settings/analytics", analytics),
  saveAnalyticsReports: (connection) =>
    put("/api/admin/settings/analytics-reports", connection),
  clearAnalyticsReports: () => del("/api/admin/settings/analytics-reports"),

  // Analytics reports
  analyticsStatus: () => request("/api/admin/analytics/status"),
  analyticsReport: (days, fresh) =>
    request(
      `/api/admin/analytics/report?days=${days}${fresh ? "&fresh=1" : ""}`,
    ),

  // Backups
  getBackups: () => request("/api/admin/backups"),
  createBackup: () => post("/api/admin/backups"),
  uploadBackup: (file) => upload("/api/admin/backups/upload", file),
  downloadBackup: (name) =>
    download(`/api/admin/backups/${encodeURIComponent(name)}/download`, name),
  restoreBackup: (name, includeAccess) =>
    post(`/api/admin/backups/${encodeURIComponent(name)}/restore`, {
      includeAccess,
    }),
  deleteBackup: (name) => del(`/api/admin/backups/${encodeURIComponent(name)}`),
};

// src/lib/api.js

// Where the Express server (server/) is reachable. Override with VITE_API_URL.
export const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://proaddis.dealstoaddis.com" ||
  "http://localhost:5000"
).replace(/\/$/, "");

// Files uploaded through the dashboard live on the API server;
// everything else is a regular site asset.
export const assetUrl = (path) => {
  if (!path) return "";
  return path.startsWith("/uploads/") ? `${API_URL}${path}` : path;
};

export const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, "")}`;

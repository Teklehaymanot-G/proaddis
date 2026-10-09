const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./lib/db");
const { UPLOAD_DIR } = require("./lib/paths");

const app = express();
const PORT = process.env.PORT || 5000;

// Behind the hosting proxy: use the forwarded client IP for rate limiting
app.set("trust proxy", 1);

// Middleware
app.use(cors({ exposedHeaders: ["Content-Disposition"] }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Uploaded images and videos
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    maxAge: "30d",
    setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
  }),
);

// Public routes
app.use("/api", require("./routes/contact"));
app.use("/api", require("./routes/content"));

// Admin routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin/overview", require("./routes/overview"));
app.use("/api/admin/messages", require("./routes/messages"));
app.use("/api/admin/upload", require("./routes/uploads"));
app.use("/api/admin/users", require("./routes/users"));
app.use("/api/admin/roles", require("./routes/roles"));
app.use("/api/admin/settings", require("./routes/settings"));
app.use("/api/admin/backups", require("./routes/backups"));
app.use("/api/admin/analytics", require("./routes/analytics"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

// Error handler (invalid JSON bodies, unexpected failures)
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Invalid JSON" });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, error: "Content too large" });
  }
  console.error("Server error:", error);
  res.status(500).json({ success: false, error: "Internal server error" });
});

db.init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database: ${db.config.database} on ${db.config.host}`);
    });
  })
  .catch((error) => {
    console.error("Could not start: database is not available.");
    console.error(`  ${error.code || ""} ${error.message}`);
    console.error("  Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME in .env");
    process.exit(1);
  });

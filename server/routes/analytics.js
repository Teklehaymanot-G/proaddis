const express = require("express");
const auth = require("../lib/auth");
const analytics = require("../lib/analytics");

const router = express.Router();

router.use(auth.requirePermission("analytics.view"));

router.get("/status", async (req, res) => {
  const { configured } = await analytics.getStatus();
  res.json({ success: true, configured });
});

// Everything the Analytics page shows, for the last 7, 30 or 365 days
router.get("/report", async (req, res) => {
  const days = Number(req.query.days) || 30;

  if (!analytics.RANGES.includes(days)) {
    return res.status(400).json({ success: false, error: "Unknown date range" });
  }

  try {
    const report = await analytics.getReport(days, {
      fresh: req.query.fresh === "1",
    });
    res.json({ success: true, report });
  } catch (error) {
    if (!(error instanceof analytics.AnalyticsError)) throw error;
    res.status(502).json({ success: false, error: error.message });
  }
});

module.exports = router;

const jwt = require("jsonwebtoken");
const settings = require("./settings");
const { encrypt, decrypt } = require("./secret");

// Google Analytics 4 Data API, called directly over HTTPS with a service
// account (no Google SDK needed). The URLs can be overridden for testing.
const TOKEN_URL = process.env.GOOGLE_TOKEN_URL || "https://oauth2.googleapis.com/token";
const API_URL = (
  process.env.GA_DATA_API_URL || "https://analyticsdata.googleapis.com/v1beta"
).replace(/\/$/, "");
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

// Events the website sends (src/lib/analytics.js): one per section a visitor
// scrolls to, and one when a contact form is sent.
const SECTION_EVENT_PREFIX = "section_view_";
const CONTACT_SENT_EVENT = "contact_form_sent";

const CACHE_MS = 5 * 60 * 1000; // reports are reused for 5 minutes
const RANGES = [7, 30, 365];

// A problem the admin can act on (shown as-is in the admin)
class AnalyticsError extends Error {}

// ---- Configuration ----

// Checks a pasted / uploaded service account key and returns it parsed
const parseKey = (text) => {
  let key;
  try {
    key = JSON.parse(text);
  } catch {
    throw new AnalyticsError("The key file is not valid JSON");
  }
  if (key?.type !== "service_account" || !key.client_email || !key.private_key) {
    throw new AnalyticsError(
      "This is not a service account key. Download the JSON key of a service account from Google Cloud.",
    );
  }
  return key;
};

// Saved in the admin, or GA_PROPERTY_ID + GA_SERVICE_ACCOUNT_JSON_BASE64
const getConfig = async () => {
  const saved = await settings.get("analyticsReports");

  if (saved.propertyId && saved.credentials) {
    const text = decrypt(saved.credentials);
    if (text) {
      return { propertyId: saved.propertyId, key: JSON.parse(text), source: "settings" };
    }
  }

  const { GA_PROPERTY_ID, GA_SERVICE_ACCOUNT_JSON_BASE64 } = process.env;
  if (GA_PROPERTY_ID && GA_SERVICE_ACCOUNT_JSON_BASE64) {
    try {
      const text = Buffer.from(GA_SERVICE_ACCOUNT_JSON_BASE64, "base64").toString("utf8");
      return { propertyId: GA_PROPERTY_ID, key: parseKey(text), source: "environment" };
    } catch {
      return null;
    }
  }

  return null;
};

// What the admin may see: never the key itself
const getStatus = async () => {
  const config = await getConfig();
  return {
    configured: Boolean(config),
    propertyId: config?.propertyId || "",
    serviceAccount: config?.key.client_email || "",
    source: config?.source || "none",
  };
};

const cache = new Map();
const tokens = new Map();

// Saves the connection only after Google has answered a real report with it,
// so a wrong ID or key never replaces a working setup.
// `keyText` empty: keep the key that is already saved.
const saveConfig = async ({ propertyId, keyText }) => {
  const current = await settings.get("analyticsReports");
  const savedKeyText = current.credentials ? decrypt(current.credentials) : "";
  const key = keyText ? parseKey(keyText) : savedKeyText && JSON.parse(savedKeyText);

  if (!key) throw new AnalyticsError("Add the service account key file");

  tokens.clear();
  try {
    await fetchReport({ propertyId, key }, 7);
  } catch (error) {
    if (error instanceof AnalyticsError) throw error;
    throw new AnalyticsError(`Could not reach Google Analytics (${error.message})`);
  }

  await settings.set("analyticsReports", {
    propertyId,
    credentials: encrypt(JSON.stringify(key)),
  });
  cache.clear();
};

const clearConfig = async () => {
  await settings.set("analyticsReports", { propertyId: "", credentials: "" });
  cache.clear();
  tokens.clear();
};

// ---- Google API ----

const getAccessToken = async (key) => {
  const cached = tokens.get(key.client_email);
  if (cached && cached.expiresAt > Date.now() + 60 * 1000) return cached.value;

  let assertion;
  try {
    assertion = jwt.sign({ scope: SCOPE }, key.private_key, {
      algorithm: "RS256",
      issuer: key.client_email,
      audience: TOKEN_URL,
      expiresIn: "1h",
    });
  } catch {
    throw new AnalyticsError("The service account key is damaged. Upload the key file again.");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.access_token) {
    throw new AnalyticsError(
      `Google rejected the service account key (${result.error_description || result.error || response.status}). It may have been deleted; create a new key and upload it.`,
    );
  }

  tokens.set(key.client_email, {
    value: result.access_token,
    expiresAt: Date.now() + (result.expires_in || 3600) * 1000,
  });
  return result.access_token;
};

const explain = (status, error, config) => {
  const message = error?.message || `Google Analytics returned an error (${status})`;

  if (status === 403 && /has not been used|is disabled/i.test(message)) {
    return "The Google Analytics Data API is not enabled for the service account's Google Cloud project. Enable it in Google Cloud, wait a minute and try again.";
  }
  if (status === 403) {
    return `The service account cannot read this property. In Google Analytics open Admin → Property access management and add ${config.key.client_email} as a Viewer.`;
  }
  if (status === 404 || (status === 400 && /property/i.test(message))) {
    return `Google Analytics has no property with ID ${config.propertyId}. Check the Property ID (a number, not the G- Measurement ID).`;
  }
  if (status === 429) {
    return "Google Analytics is limiting requests right now. Try again in a few minutes.";
  }
  return message;
};

// Up to 5 reports per call
const batchRunReports = async (config, requests) => {
  const token = await getAccessToken(config.key);

  const response = await fetch(
    `${API_URL}/properties/${config.propertyId}:batchRunReports`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    },
  );
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AnalyticsError(explain(response.status, result.error, config));
  }
  return result.reports || [];
};

// ---- Reports ----

const dimensions = (...names) => names.map((name) => ({ name }));
const metrics = (...names) => names.map((name) => ({ name }));
const byMetric = (name) => [{ metric: { metricName: name }, desc: true }];

// Flattens a report into [{ d: [dimension values], m: [metric numbers] }]
const rows = (report) =>
  (report?.rows || []).map((row) => ({
    d: (row.dimensionValues || []).map((value) => value.value),
    m: (row.metricValues || []).map((value) => Number(value.value) || 0),
  }));

const EMPTY_SUMMARY = { activeUsers: 0, pageViews: 0, avgSessionDurationSeconds: 0 };

const buildRequests = (days) => {
  const range = [{ startDate: `${days - 1}daysAgo`, endDate: "today" }];
  const monthly = days > 90; // a year reads better per month than per day
  const timeDimension = monthly ? "yearMonth" : "date";

  return [
    // 0: headline numbers for four periods in one report
    {
      dateRanges: [
        { name: "today", startDate: "today", endDate: "today" },
        { name: "week", startDate: "6daysAgo", endDate: "today" },
        { name: "month", startDate: "29daysAgo", endDate: "today" },
        { name: "year", startDate: "364daysAgo", endDate: "today" },
      ],
      metrics: metrics("activeUsers", "screenPageViews", "averageSessionDuration"),
    },
    // 1: visitors over time
    {
      dateRanges: range,
      dimensions: dimensions(timeDimension),
      metrics: metrics("activeUsers"),
      orderBys: [{ dimension: { dimensionName: timeDimension } }],
      keepEmptyRows: true,
    },
    // 2: countries
    {
      dateRanges: range,
      dimensions: dimensions("country"),
      metrics: metrics("activeUsers"),
      orderBys: byMetric("activeUsers"),
      limit: 10,
    },
    // 3: cities
    {
      dateRanges: range,
      dimensions: dimensions("city", "country"),
      metrics: metrics("activeUsers"),
      orderBys: byMetric("activeUsers"),
      limit: 10,
    },
    // 4: pages
    {
      dateRanges: range,
      dimensions: dimensions("pagePath"),
      metrics: metrics("screenPageViews", "activeUsers"),
      orderBys: byMetric("screenPageViews"),
      limit: 10,
    },
    // 5: traffic sources
    {
      dateRanges: range,
      dimensions: dimensions("sessionDefaultChannelGroup"),
      metrics: metrics("activeUsers", "sessions"),
      orderBys: byMetric("activeUsers"),
    },
    // 6: devices
    {
      dateRanges: range,
      dimensions: dimensions("deviceCategory"),
      metrics: metrics("activeUsers"),
      orderBys: byMetric("activeUsers"),
    },
    // 7: new vs returning
    {
      dateRanges: range,
      dimensions: dimensions("newVsReturning"),
      metrics: metrics("activeUsers"),
    },
    // 8: sections reached and contact forms sent
    {
      dateRanges: range,
      dimensions: dimensions("eventName"),
      metrics: metrics("eventCount", "activeUsers"),
      dimensionFilter: {
        orGroup: {
          expressions: [
            {
              filter: {
                fieldName: "eventName",
                stringFilter: { matchType: "BEGINS_WITH", value: SECTION_EVENT_PREFIX },
              },
            },
            {
              filter: {
                fieldName: "eventName",
                stringFilter: { matchType: "EXACT", value: CONTACT_SENT_EVENT },
              },
            },
          ],
        },
      },
    },
    // 9: visitors in the selected range (the base for "% who reached")
    {
      dateRanges: range,
      metrics: metrics("activeUsers"),
    },
  ];
};

const fetchReport = async (config, days) => {
  const requests = buildRequests(days);
  const [first, second] = await Promise.all([
    batchRunReports(config, requests.slice(0, 5)),
    batchRunReports(config, requests.slice(5)),
  ]);
  const [summary, trend, countries, cities, pages, sources, devices, visitors, events, total] = [
    ...first,
    ...second,
  ].map(rows);

  const contactSent = events.find((row) => row.d[0] === CONTACT_SENT_EVENT);

  const summaryByRange = { today: EMPTY_SUMMARY, week: EMPTY_SUMMARY, month: EMPTY_SUMMARY, year: EMPTY_SUMMARY };
  for (const row of summary) {
    summaryByRange[row.d[0]] = {
      activeUsers: row.m[0],
      pageViews: row.m[1],
      avgSessionDurationSeconds: row.m[2],
    };
  }

  const visitorType = (type) => visitors.find((row) => row.d[0] === type)?.m[0] || 0;

  return {
    days,
    generatedAt: new Date(),
    summary: summaryByRange,
    // date is YYYYMMDD, or YYYYMM for the 12-month view
    trend: trend.map((row) => ({ date: row.d[0], activeUsers: row.m[0] })),
    countries: countries.map((row) => ({ country: row.d[0], activeUsers: row.m[0] })),
    cities: cities.map((row) => ({ city: row.d[0], country: row.d[1], activeUsers: row.m[0] })),
    pages: pages.map((row) => ({ path: row.d[0], pageViews: row.m[0], activeUsers: row.m[1] })),
    sources: sources.map((row) => ({ channel: row.d[0], activeUsers: row.m[0], sessions: row.m[1] })),
    devices: devices.map((row) => ({ device: row.d[0], activeUsers: row.m[0] })),
    newVsReturning: { new: visitorType("new"), returning: visitorType("returning") },
    visitors: total[0]?.m[0] || 0,
    // key is the section id with underscores, e.g. "case_studies"
    sections: events
      .filter((row) => row.d[0].startsWith(SECTION_EVENT_PREFIX))
      .map((row) => ({
        key: row.d[0].slice(SECTION_EVENT_PREFIX.length),
        views: row.m[0],
        visitors: row.m[1],
      })),
    contactForms: { sent: contactSent?.m[0] || 0, visitors: contactSent?.m[1] || 0 },
  };
};

// `fresh` skips the cache (used by the Refresh button and the connection test)
const getReport = async (days, { fresh = false } = {}) => {
  const config = await getConfig();
  if (!config) throw new AnalyticsError("Google Analytics reports are not connected yet");

  const key = `${config.propertyId}:${days}`;
  const cached = cache.get(key);
  if (!fresh && cached && cached.expiresAt > Date.now()) return cached.report;

  let report;
  try {
    report = await fetchReport(config, days);
  } catch (error) {
    if (error instanceof AnalyticsError) throw error;
    throw new AnalyticsError(`Could not reach Google Analytics (${error.message})`);
  }

  cache.set(key, { report, expiresAt: Date.now() + CACHE_MS });
  return report;
};

module.exports = {
  AnalyticsError,
  RANGES,
  parseKey,
  getStatus,
  saveConfig,
  clearConfig,
  getReport,
};

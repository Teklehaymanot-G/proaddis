// src/pages/Analytics.jsx
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Progress,
  Result,
  Row,
  Select,
  Skeleton,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import { formatDateTime } from "../components/format";

const RANGE_OPTIONS = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 365, label: "Last 12 months" },
];

const BRAND = "#006AAB";
// Colours that stay distinguishable next to each other in the donut charts
const SERIES_COLORS = ["#006AAB", "#E07A1F", "#059669", "#7C3AED", "#72BBDA", "#DC2626", "#6B7A99"];

// Website sections in page order. Keys match the events the website sends
// (TRACKED_SECTIONS in the site's src/lib/analytics.js, "-" as "_").
const SECTIONS = [
  { key: "about", label: "Why Choose Us" },
  { key: "services", label: "Services" },
  { key: "process", label: "Process" },
  { key: "clients", label: "Clients" },
  { key: "portfolio", label: "Portfolio" },
  { key: "case_studies", label: "Case Studies" },
  { key: "testimonials", label: "Testimonials" },
  { key: "contact", label: "Contact" },
];

const percentOf = (part, whole) => (whole > 0 ? Math.min(100, Math.round((part / whole) * 100)) : 0);

const CHANNEL_LABELS = { "Organic Social": "Social", Unassigned: "Other" };
const DEVICE_LABELS = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" };

// Google Analytics sends days as YYYYMMDD and months as YYYYMM
const formatPeriod = (value) => {
  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  if (value.length === 6) {
    return new Date(`${year}-${month}-01T00:00:00`).toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
  }
  return new Date(`${year}-${month}-${value.slice(6, 8)}T00:00:00`).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric" },
  );
};

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
};

const NoData = ({ text }) => (
  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text} />
);

const donutOptions = (labels) => ({
  chart: { type: "donut", toolbar: { show: false }, fontFamily: "inherit" },
  labels,
  colors: SERIES_COLORS,
  legend: { position: "bottom" },
  stroke: { width: 2 },
  dataLabels: { enabled: true, formatter: (value) => `${value.toFixed(0)}%` },
  tooltip: { y: { formatter: (value) => `${value} visitors` } },
});

const Analytics = () => {
  const { can } = useAuth();
  const canConfigure = can("settings.manage");

  const [configured, setConfigured] = useState(null); // null while checking
  const [days, setDays] = useState(30);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .analyticsStatus()
      .then((result) => setConfigured(result.configured))
      .catch((statusError) => {
        setConfigured(false);
        setError(statusError.message);
      });
  }, []);

  const load = useCallback(
    async (fresh = false) => {
      setLoading(true);
      setError("");
      try {
        setReport((await api.analyticsReport(days, fresh)).report);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    },
    [days],
  );

  useEffect(() => {
    if (configured) load();
  }, [configured, load]);

  const header = (
    <PageHeader
      title="Analytics"
      description="Visitor traffic for the public website, from Google Analytics."
      actions={
        configured && (
          <>
            <Select
              value={days}
              onChange={setDays}
              options={RANGE_OPTIONS}
              style={{ width: 170 }}
              aria-label="Date range"
            />
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => load(true)}>
              Refresh
            </Button>
          </>
        )
      }
    />
  );

  if (configured === null) {
    return (
      <>
        {header}
        <Skeleton active paragraph={{ rows: 8 }} />
      </>
    );
  }

  if (!configured) {
    return (
      <>
        {header}
        <Card>
          <Result
            status={error ? "error" : "info"}
            title={error ? "Could not check the connection" : "Reports are not connected yet"}
            subTitle={
              error ||
              (canConfigure
                ? "Connect this admin to your Google Analytics property to see visitor reports here."
                : "An administrator needs to connect Google Analytics under Settings before reports appear here.")
            }
            extra={
              canConfigure && (
                <Link to="/settings/analytics">
                  <Button type="primary">Connect Google Analytics</Button>
                </Link>
              )
            }
          />
        </Card>
      </>
    );
  }

  if (!report) {
    return (
      <>
        {header}
        {error ? (
          <Card>
            <Result
              status="error"
              title="Could not load the analytics data"
              subTitle={error}
              extra={
                <Space>
                  <Button type="primary" onClick={() => load(true)}>
                    Try again
                  </Button>
                  {canConfigure && (
                    <Link to="/settings/analytics">
                      <Button>Check the connection</Button>
                    </Link>
                  )}
                </Space>
              }
            />
          </Card>
        ) : (
          <Skeleton active paragraph={{ rows: 10 }} />
        )}
      </>
    );
  }

  const { summary, trend, countries, cities, pages, sources, devices, newVsReturning } = report;
  const { visitors, contactForms } = report;

  const sectionRows = SECTIONS.map((section) => {
    const found = report.sections.find((row) => row.key === section.key);
    return {
      ...section,
      visitors: found?.visitors || 0,
      percent: percentOf(found?.visitors || 0, visitors),
    };
  });
  const hasSectionData = report.sections.length > 0;
  const rangeLabel = RANGE_OPTIONS.find((option) => option.value === report.days).label.toLowerCase();

  const totalVisitors = newVsReturning.new + newVsReturning.returning;
  const newPercent = totalVisitors > 0 ? Math.round((newVsReturning.new / totalVisitors) * 100) : 0;

  const trendOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "inherit" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
    xaxis: {
      categories: trend.map((point) => formatPeriod(point.date)),
      tickAmount: Math.min(trend.length, 10),
      labels: { rotate: 0, hideOverlappingLabels: true },
    },
    yaxis: { labels: { formatter: (value) => Math.round(value) }, min: 0, forceNiceScale: true },
    colors: [BRAND],
    tooltip: { y: { formatter: (value) => `${value} visitors` } },
  };

  const countryOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: "60%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: countries.map((row) => row.country),
      labels: { formatter: (value) => Math.round(value) },
    },
    colors: [BRAND],
    tooltip: { y: { formatter: (value) => `${value} visitors` } },
  };

  const stats = [
    { title: "Today", value: summary.today.activeUsers },
    { title: "Last 7 days", value: summary.week.activeUsers },
    { title: "Last 30 days", value: summary.month.activeUsers },
    { title: "Last 12 months", value: summary.year.activeUsers },
  ];

  return (
    <>
      {header}

      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {error && (
          <Alert
            type="warning"
            showIcon
            message="Showing the last data that loaded"
            description={error}
          />
        )}

        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col key={stat.title} xs={12} lg={6}>
              <Card>
                <Statistic title={stat.title} value={stat.value} suffix={<span style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.45)" }}>visitors</span>} />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title={`Visitors over time (${rangeLabel})`} style={{ height: "100%" }}>
              {trend.length === 0 ? (
                <NoData text="No visitor data for this range yet." />
              ) : (
                <Chart
                  type="area"
                  height={280}
                  options={trendOptions}
                  series={[{ name: "Visitors", data: trend.map((point) => point.activeUsers) }]}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Engagement" style={{ height: "100%" }}>
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <Statistic
                  title="Average time on site (30 days)"
                  value={formatDuration(summary.month.avgSessionDurationSeconds)}
                />
                <Statistic title="Page views (30 days)" value={summary.month.pageViews} />
                <Statistic title="Page views (today)" value={summary.today.pageViews} />
                {totalVisitors > 0 && (
                  <div>
                    <Typography.Text type="secondary">
                      New vs returning ({rangeLabel})
                    </Typography.Text>
                    <Progress
                      percent={100}
                      success={{ percent: newPercent, strokeColor: BRAND }}
                      strokeColor={SERIES_COLORS[1]}
                      showInfo={false}
                    />
                    <Typography.Text>
                      {newPercent}% new · {100 - newPercent}% returning
                    </Typography.Text>
                  </div>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Traffic sources" style={{ height: "100%" }}>
              {sources.length === 0 ? (
                <NoData text="No traffic-source data for this range yet." />
              ) : (
                <Chart
                  type="donut"
                  height={300}
                  options={donutOptions(
                    sources.map((row) => CHANNEL_LABELS[row.channel] || row.channel),
                  )}
                  series={sources.map((row) => row.activeUsers)}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Devices" style={{ height: "100%" }}>
              {devices.length === 0 ? (
                <NoData text="No device data for this range yet." />
              ) : (
                <Chart
                  type="donut"
                  height={300}
                  options={donutOptions(
                    devices.map((row) => DEVICE_LABELS[row.device] || row.device),
                  )}
                  series={devices.map((row) => row.activeUsers)}
                />
              )}
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Top countries" style={{ height: "100%" }}>
              {countries.length === 0 ? (
                <NoData text="No location data for this range yet." />
              ) : (
                <Chart
                  type="bar"
                  height={Math.max(200, countries.length * 36)}
                  options={countryOptions}
                  series={[{ name: "Visitors", data: countries.map((row) => row.activeUsers) }]}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Top cities" style={{ height: "100%" }} styles={{ body: { padding: 0 } }}>
              <Table
                rowKey={(row) => `${row.city}-${row.country}`}
                size="middle"
                pagination={false}
                dataSource={cities}
                locale={{ emptyText: "No location data for this range yet." }}
                columns={[
                  { title: "City", dataIndex: "city" },
                  { title: "Country", dataIndex: "country" },
                  { title: "Visitors", dataIndex: "activeUsers", align: "right", width: 110 },
                ]}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title={`How far visitors scroll (${rangeLabel})`}
              style={{ height: "100%" }}
              styles={{ body: { padding: hasSectionData ? 0 : undefined } }}
            >
              {!hasSectionData ? (
                <NoData text="No section data yet. It appears once the updated website is live and has had visitors." />
              ) : (
                <Table
                  rowKey="key"
                  size="middle"
                  pagination={false}
                  dataSource={sectionRows}
                  scroll={{ x: 480 }}
                  columns={[
                    { title: "Section", dataIndex: "label", width: 170 },
                    {
                      title: "Share of visitors who reached it",
                      dataIndex: "percent",
                      render: (percent) => (
                        <Progress
                          percent={percent}
                          strokeColor={BRAND}
                          format={(value) => `${value}%`}
                          aria-label={`${percent}% of visitors`}
                        />
                      ),
                    },
                    {
                      title: "Visitors",
                      dataIndex: "visitors",
                      align: "right",
                      width: 110,
                      render: (value) => value.toLocaleString(),
                    },
                  ]}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={`Contact form (${rangeLabel})`} style={{ height: "100%" }}>
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <Statistic title="Messages sent" value={contactForms.sent} />
                <Statistic
                  title="Visitors who sent a message"
                  value={contactForms.visitors}
                  suffix={
                    <span style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.45)" }}>
                      of {visitors.toLocaleString()} ({percentOf(contactForms.visitors, visitors)}%)
                    </span>
                  }
                />
                <Typography.Text type="secondary">
                  Counted by Google Analytics, so visitors who block tracking are not
                  included. Every message itself is under{" "}
                  <Link to="/messages">Messages</Link>.
                </Typography.Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card title="Most visited pages" styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="path"
            size="middle"
            pagination={false}
            dataSource={pages}
            scroll={{ x: 520 }}
            locale={{ emptyText: "No page data for this range yet." }}
            columns={[
              { title: "Page", dataIndex: "path", ellipsis: true },
              {
                title: "Views",
                dataIndex: "pageViews",
                align: "right",
                width: 120,
                render: (value) => value.toLocaleString(),
              },
              {
                title: "Visitors",
                dataIndex: "activeUsers",
                align: "right",
                width: 120,
                render: (value) => value.toLocaleString(),
              },
            ]}
          />
        </Card>

        <Typography.Text type="secondary">
          Data from Google Analytics, loaded {formatDateTime(report.generatedAt)}. Figures are
          kept for 5 minutes; use Refresh for the latest. Today&apos;s numbers can lag by a few
          hours.
        </Typography.Text>
      </Space>
    </>
  );
};

export default Analytics;

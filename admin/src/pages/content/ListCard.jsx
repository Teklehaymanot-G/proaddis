// src/pages/content/ListCard.jsx
// A table of entries (services, projects, …) with add / edit / delete / reorder
import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import DataTable from "../../components/DataTable";
import { FormFields, IconPreview, MediaThumb } from "./fields";

const SEARCH_FROM = 8; // show the search box once a list is this long
const PAGE_SIZE = 10;

const resolve = (value, section) =>
  typeof value === "function" ? value(section) : value;

const renderCell = (field, section) => (value) => {
  if (field.type === "icon") return <IconPreview name={value} size={20} />;
  if (field.type === "image" || field.type === "video") {
    return <MediaThumb value={value} kind={field.type} size={40} />;
  }
  if (field.type === "select") {
    const option = (resolve(field.options, section) || []).find((o) => o.value === value);
    return option?.label || value || "—";
  }
  if (field.type === "url") {
    return value && /^https?:/i.test(value) ? (
      <Typography.Link href={value} target="_blank" rel="noopener noreferrer" ellipsis>
        {value.replace(/^https?:\/\/(www\.)?/i, "")}
      </Typography.Link>
    ) : (
      value || "—"
    );
  }
  return value === "" || value == null ? "—" : String(value);
};

const ListCard = ({ field, section, canEdit, saving, onChange }) => {
  const items = useMemo(() => section[field.name] || [], [section, field.name]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // { index } or { index: null } for new
  const [form] = Form.useForm();

  const rows = useMemo(() => {
    const all = items.map((item, index) => ({ ...item, __index: index }));
    const term = search.trim().toLowerCase();
    if (!term) return all;
    return all.filter((row) =>
      field.fields.some(
        (f) => typeof row[f.name] === "string" && row[f.name].toLowerCase().includes(term),
      ),
    );
  }, [items, search, field.fields]);

  const openEditor = (index) => {
    form.resetFields();
    form.setFieldsValue(
      index === null ? structuredClone(resolve(field.newItem, section)) : items[index],
    );
    setEditing({ index });
  };

  const submit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch {
      return; // the form shows which fields need attention
    }
    const next =
      editing.index === null
        ? [...items, { ...resolve(field.newItem, section), ...values }]
        : items.map((item, i) => (i === editing.index ? { ...item, ...values } : item));
    if (await onChange(next)) setEditing(null);
  };

  const move = (from, to) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const columns = [
    { title: "#", width: 56, mobile: "hidden", render: (_, row) => row.__index + 1 },
    ...field.columns.map((name) => {
      const column = field.fields.find((f) => f.name === name);
      const compact = ["icon", "image", "video", "number"].includes(column.type);
      return {
        title: column.label,
        mobile: ["icon", "image", "video"].includes(column.type) ? "media" : undefined,
        dataIndex: name,
        width: compact ? 90 : undefined,
        ellipsis: !compact,
        render: renderCell(column, section),
      };
    }),
  ];

  if (canEdit) {
    columns.push({
      title: "Actions",
      width: 170,
      align: "right",
      render: (_, row) => (
        <Space size={0}>
          <Tooltip title={search ? "Clear the search to reorder" : "Move up"}>
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              aria-label="Move up"
              disabled={Boolean(search) || row.__index === 0 || saving}
              onClick={() => move(row.__index, row.__index - 1)}
            />
          </Tooltip>
          <Tooltip title={search ? "Clear the search to reorder" : "Move down"}>
            <Button
              type="text"
              icon={<ArrowDownOutlined />}
              aria-label="Move down"
              disabled={Boolean(search) || row.__index === items.length - 1 || saving}
              onClick={() => move(row.__index, row.__index + 1)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label="Edit"
              onClick={() => openEditor(row.__index)}
            />
          </Tooltip>
          <Popconfirm
            title={`Delete this ${field.singular}?`}
            description="It is removed from the website straight away."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onChange(items.filter((_, i) => i !== row.__index))}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    });
  }

  return (
    <Card
      className="list-card"
      title={
        <Space>
          {field.label}
          <Typography.Text type="secondary" style={{ fontWeight: 400 }}>
            {items.length}
          </Typography.Text>
        </Space>
      }
      extra={
        <Space>
          {items.length >= SEARCH_FROM && (
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          )}
          {canEdit && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor(null)}>
              Add {field.singular}
            </Button>
          )}
        </Space>
      }
      styles={{ body: { padding: 0 } }}
    >
      <DataTable
        rowKey="__index"
        columns={columns}
        dataSource={rows}
        loading={saving}
        size="middle"
        scroll={{ x: 640 }}
        pagination={
          rows.length > PAGE_SIZE
            ? { pageSize: PAGE_SIZE, showSizeChanger: false, style: { marginRight: 16 } }
            : false
        }
        locale={{ emptyText: search ? "No matches" : `No ${field.label.toLowerCase()} yet` }}
      />

      <Drawer
        title={
          editing?.index === null
            ? `Add ${field.singular}`
            : `Edit ${field.singular}`
        }
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        width={520}
        destroyOnClose
        footer={
          <>
            <Button onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="primary" loading={saving} onClick={submit}>
              {editing?.index === null ? `Add ${field.singular}` : "Save changes"}
            </Button>
          </>
        }
      >
        <Form form={form} layout="vertical" requiredMark="optional" onFinish={submit}>
          <FormFields fields={field.fields} section={section} />
        </Form>
      </Drawer>
    </Card>
  );
};

export default ListCard;

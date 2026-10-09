// Everything a role can be allowed to do. Shown as checkboxes in the admin.
const PERMISSIONS = [
  {
    key: "content.view",
    group: "Website content",
    label: "View content",
    description: "Open the content pages in the admin.",
  },
  {
    key: "content.edit",
    group: "Website content",
    label: "Edit content",
    description: "Change website content and upload images and videos.",
  },
  {
    key: "messages.view",
    group: "Messages",
    label: "View messages",
    description: "Read messages sent through the contact form.",
  },
  {
    key: "messages.manage",
    group: "Messages",
    label: "Manage messages",
    description: "Mark messages as read or unread and delete them.",
  },
  {
    key: "users.manage",
    group: "Access",
    label: "Manage users",
    description: "Create, edit, deactivate and delete admin users.",
  },
  {
    key: "roles.manage",
    group: "Access",
    label: "Manage roles",
    description: "Create roles and choose what each role may do.",
  },
  {
    key: "settings.manage",
    group: "System",
    label: "Manage settings",
    description: "Email (SMTP), contact form and Google Analytics settings.",
  },
  {
    key: "backups.manage",
    group: "System",
    label: "Manage backups",
    description: "Create, download, delete and restore backups.",
  },
];

const PERMISSION_KEYS = PERMISSIONS.map((permission) => permission.key);

const DEFAULT_ROLES = [
  {
    name: "Administrator",
    description: "Full access to everything.",
    permissions: PERMISSION_KEYS,
    isSystem: true,
  },
  {
    name: "Editor",
    description: "Edits website content and handles messages.",
    permissions: [
      "content.view",
      "content.edit",
      "messages.view",
      "messages.manage",
    ],
    isSystem: false,
  },
];

module.exports = { PERMISSIONS, PERMISSION_KEYS, DEFAULT_ROLES };

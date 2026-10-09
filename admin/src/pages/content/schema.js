// src/pages/content/schema.js
// Describes every editable website section; SectionPage builds its forms and
// tables from this.
//
// Field types: text, textarea, url, number, select, icon, image, video,
// tags (list of short texts) and list (table of entries edited in a drawer).

const SOCIAL_PLATFORMS = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "Telegram",
];

const heading = [
  { name: "eyebrow", label: "Small label", type: "text" },
  { name: "title", label: "Heading", type: "text", required: true },
  { name: "description", label: "Intro text", type: "textarea" },
];

const iconCard = [
  { name: "icon", label: "Icon", type: "icon" },
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
];

export const sections = [
  {
    key: "about",
    path: "about",
    label: "Why Choose Us",
    description: "Introduction, strengths and the four headline numbers.",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text" },
      {
        name: "intro",
        label: "Intro text",
        type: "textarea",
        help: "Wrap words in **double asterisks** to highlight them.",
      },
      { name: "quote", label: "Quote", type: "text" },
      {
        name: "features",
        label: "Strengths",
        singular: "strength",
        type: "list",
        columns: ["icon", "title", "description"],
        newItem: { icon: "Sparkles", title: "", description: "" },
        fields: iconCard,
      },
      {
        name: "stats",
        label: "Numbers",
        singular: "number",
        type: "list",
        columns: ["number", "suffix", "label"],
        newItem: { number: 0, suffix: "+", label: "" },
        fields: [
          { name: "number", label: "Number", type: "number", required: true },
          {
            name: "suffix",
            label: "Symbol after the number",
            type: "text",
            help: "For example + or %",
          },
          { name: "label", label: "Label", type: "text", required: true },
        ],
      },
    ],
  },
  {
    key: "services",
    path: "services",
    label: "Services",
    description: "The services grid.",
    fields: [
      ...heading,
      { name: "tags", label: "Keyword tags", type: "tags" },
      {
        name: "items",
        label: "Services",
        singular: "service",
        type: "list",
        columns: ["icon", "title", "description"],
        newItem: { icon: "Target", title: "", description: "" },
        fields: iconCard,
      },
    ],
  },
  {
    key: "process",
    path: "process",
    label: "Process",
    description: "The step-by-step timeline.",
    fields: [
      ...heading,
      {
        name: "steps",
        label: "Steps",
        singular: "step",
        type: "list",
        columns: ["icon", "title", "description"],
        newItem: { icon: "Target", title: "", description: "" },
        fields: iconCard,
      },
    ],
  },
  {
    key: "clients",
    path: "clients",
    label: "Clients",
    description: "Logos in the scrolling client strip.",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text" },
      { name: "title", label: "Heading", type: "text", required: true },
      {
        name: "items",
        label: "Clients",
        singular: "client",
        type: "list",
        columns: ["logo", "name", "category", "project"],
        newItem: { name: "", logo: "", category: "", project: "" },
        fields: [
          { name: "name", label: "Client name", type: "text", required: true },
          { name: "logo", label: "Logo", type: "image", required: true },
          { name: "category", label: "Industry", type: "text" },
          { name: "project", label: "Work done", type: "text" },
        ],
      },
    ],
  },
  {
    key: "portfolio",
    path: "portfolio",
    label: "Portfolio",
    description: "Projects and the filter buttons above them.",
    fields: [
      ...heading,
      {
        name: "projects",
        label: "Projects",
        singular: "project",
        type: "list",
        columns: ["image", "title", "category", "liveUrl"],
        newItem: (section) => ({
          title: "",
          category: section.categories?.[0]?.key || "",
          image: "",
          description: "",
          technologies: [],
          liveUrl: "",
        }),
        fields: [
          { name: "title", label: "Project title", type: "text", required: true },
          {
            name: "category",
            label: "Category",
            type: "select",
            required: true,
            options: (section) =>
              (section.categories || []).map((category) => ({
                value: category.key,
                label: category.label || "(unnamed category)",
              })),
          },
          { name: "image", label: "Image", type: "image" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "technologies", label: "Tags", type: "tags" },
          {
            name: "liveUrl",
            label: "Link to the project",
            type: "url",
            help: 'Leave empty to show "Coming Soon".',
          },
        ],
      },
      {
        name: "categories",
        label: "Filter categories",
        singular: "category",
        type: "list",
        columns: ["label"],
        newItem: () => ({ key: `category-${Date.now()}`, label: "" }),
        fields: [
          { name: "label", label: "Button label", type: "text", required: true },
        ],
      },
    ],
  },
  {
    key: "caseStudies",
    path: "case-studies",
    label: "Case Studies",
    description: "Detailed success stories with results.",
    fields: [
      ...heading,
      {
        name: "items",
        label: "Case studies",
        singular: "case study",
        type: "list",
        columns: ["image", "client", "industry"],
        newItem: {
          client: "",
          industry: "",
          challenge: "",
          solution: "",
          image: "",
          metrics: [],
          services: [],
        },
        fields: [
          { name: "client", label: "Client", type: "text", required: true },
          { name: "industry", label: "Industry", type: "text" },
          { name: "image", label: "Image", type: "image" },
          { name: "challenge", label: "Challenge", type: "textarea" },
          { name: "solution", label: "Solution", type: "textarea" },
          {
            name: "metrics",
            label: "Results",
            singular: "result",
            type: "list",
            help: "Three results fit best.",
            newItem: { value: "", label: "" },
            fields: [
              { name: "value", label: "Figure", type: "text", placeholder: "+40%" },
              { name: "label", label: "Label", type: "text", placeholder: "Sales Growth" },
            ],
          },
          { name: "services", label: "Services provided", type: "tags" },
        ],
      },
    ],
  },
  {
    key: "testimonials",
    path: "testimonials",
    label: "Testimonials",
    description: "Client quotes.",
    fields: [
      ...heading,
      {
        name: "items",
        label: "Testimonials",
        singular: "testimonial",
        type: "list",
        columns: ["author", "position", "quote"],
        newItem: { quote: "", author: "", position: "" },
        fields: [
          { name: "quote", label: "Quote", type: "textarea", required: true },
          { name: "author", label: "Company or person", type: "text", required: true },
          { name: "position", label: "Role", type: "text" },
        ],
      },
    ],
  },
  {
    key: "hero",
    path: "hero",
    label: "Hero Video",
    description: "The video shown at the very top of the home page.",
    fields: [
      {
        name: "videoUrl",
        label: "Video",
        type: "video",
        required: true,
        help: "MP4 or WebM, up to 60 MB. It plays muted and loops.",
      },
    ],
  },
  {
    key: "contact",
    path: "contact",
    label: "Contact Section",
    description:
      "Headings and notes in the contact section. Phone numbers, emails and the map are under Settings → Site details.",
    fields: [
      ...heading,
      { name: "formTitle", label: "Form heading", type: "text" },
      { name: "formNote", label: "Note under the form heading", type: "textarea" },
      { name: "mapTitle", label: "Map heading", type: "text" },
      { name: "mapDescription", label: "Map note", type: "text" },
    ],
  },
  {
    key: "footer",
    path: "footer",
    label: "Footer",
    description: "Closing call to action and footer details.",
    fields: [
      { name: "ctaTitle", label: "Closing headline", type: "text" },
      { name: "ctaLabel", label: "Button label", type: "text" },
      { name: "description", label: "About text", type: "textarea" },
      { name: "serviceLinks", label: "Services list", type: "tags" },
      { name: "location", label: "Location", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
    ],
  },
];

// Shown under Settings rather than Content, but stored the same way
export const siteDetails = {
  key: "settings",
  label: "Site details",
  description:
    "Contact details, social links and search-engine text used across the website.",
  fields: [
    {
      name: "seoTitle",
      label: "Browser tab title",
      type: "text",
      help: "Shown in the browser tab and in search results.",
    },
    { name: "seoDescription", label: "Search description", type: "textarea" },
    { name: "phones", label: "Phone numbers", type: "tags" },
    { name: "emails", label: "Email addresses", type: "tags" },
    {
      name: "addressLines",
      label: "Address",
      type: "tags",
      help: "One entry per line of the address.",
    },
    { name: "hours", label: "Business hours", type: "tags", help: "One entry per line." },
    {
      name: "mapUrl",
      label: "Google Maps embed link",
      type: "url",
      help: 'In Google Maps: Share → Embed a map → copy the link inside src="…". Leave empty to hide the map.',
    },
    {
      name: "socials",
      label: "Social media links",
      singular: "link",
      type: "list",
      columns: ["platform", "url"],
      newItem: { platform: "Facebook", url: "" },
      fields: [
        {
          name: "platform",
          label: "Platform",
          type: "select",
          required: true,
          options: SOCIAL_PLATFORMS.map((value) => ({ value, label: value })),
        },
        {
          name: "url",
          label: "Profile link",
          type: "url",
          help: "Leave empty to hide this icon on the website.",
        },
      ],
    },
  ],
};

export const sectionByPath = Object.fromEntries(
  sections.map((section) => [section.path, section]),
);

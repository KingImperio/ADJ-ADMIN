/* Table registry: every content table the dashboard can edit.
   field kinds: text | textarea | select | lines (string[], one per line) |
   json (JSONB, edited as validated JSON text). pk/metered lists noted. */

export type Field =
  | { name: string; label: string; kind: "text" }
  | { name: string; label: string; kind: "textarea"; rows?: number }
  | { name: string; label: string; kind: "select"; options: string[] }
  | { name: string; label: string; kind: "lines"; hint?: string }
  | { name: string; label: string; kind: "json"; hint?: string };

export interface Table {
  name: string;
  label: string;
  pk: string;
  serial?: boolean;
  orderBy: string;
  list: string;
  fields: Field[];
  readonly?: string[];
  allowNew?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  desc?: boolean;
}

const TONES = ["emerald", "navy", "indigo", "amber", "neutral"];

export const TABLES: Table[] = [
  {
    name: "site_settings",
    label: "Site settings",
    pk: "key",
    orderBy: "key",
    allowNew: false,
    list: "key",
    fields: [{ name: "value", label: "Value", kind: "textarea", rows: 2 }],
    readonly: ["key"],
  },
  {
    name: "tracks",
    label: "Programme track cards",
    pk: "slug",
    orderBy: "sort",
    allowNew: false,
    list: "title",
    fields: [
      { name: "title", label: "Title", kind: "text" },
      { name: "badge", label: "Badge", kind: "text" },
      { name: "tone", label: "Tone", kind: "select", options: TONES },
      { name: "side", label: "Side tag", kind: "text" },
      { name: "description", label: "Description", kind: "textarea", rows: 3 },
      { name: "bullets", label: "Bullets", kind: "lines", hint: "One bullet per line." },
      { name: "foot_label", label: "Footer label", kind: "text" },
      { name: "cta_label", label: "Button label", kind: "text" },
      { name: "sort", label: "Order", kind: "text" },
    ],
    readonly: ["slug"],
  },
  {
    name: "pillars",
    label: "Why-ADJ pillars",
    pk: "id",
    serial: true,
    orderBy: "sort",
    list: "title",
    fields: [
      { name: "icon", label: "Icon name", kind: "text" },
      { name: "title", label: "Title", kind: "text" },
      { name: "copy", label: "Body", kind: "textarea", rows: 3 },
      { name: "tag", label: "Tag", kind: "text" },
      { name: "tag_icon", label: "Tag icon", kind: "text" },
      { name: "tone", label: "Tone", kind: "select", options: ["primary", "secondary"] },
      { name: "sort", label: "Order", kind: "text" },
    ],
  },
  {
    name: "wall_entries",
    label: "Results wall",
    pk: "id",
    serial: true,
    orderBy: "sort",
    list: "name",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "badge", label: "Badge", kind: "text" },
      { name: "tone", label: "Tone", kind: "select", options: TONES },
      { name: "area", label: "Area", kind: "text" },
      { name: "perf", label: "Score line", kind: "text" },
      { name: "place", label: "Placement", kind: "text" },
      { name: "reg", label: "Reg line", kind: "text" },
      { name: "photo_url", label: "Photo URL", kind: "text" },
      { name: "sort", label: "Order", kind: "text" },
    ],
  },
  {
    name: "testimonials",
    label: "Testimonials",
    pk: "id",
    serial: true,
    orderBy: "sort",
    list: "name",
    fields: [
      { name: "scope", label: "Shows on", kind: "select", options: ["home", "parents"] },
      { name: "quote", label: "Quote", kind: "textarea", rows: 4 },
      { name: "initials", label: "Initials", kind: "text" },
      { name: "name", label: "Name", kind: "text" },
      { name: "detail", label: "Detail", kind: "text" },
      { name: "area", label: "Area", kind: "text" },
      { name: "sort", label: "Order", kind: "text" },
    ],
  },
  {
    name: "program_pages",
    label: "Programme pages",
    pk: "slug",
    orderBy: "slug",
    allowNew: false,
    list: "slug",
    fields: [
      { name: "h1", label: "Heading", kind: "text" },
      { name: "lead", label: "Lead paragraph", kind: "textarea", rows: 3 },
      {
        name: "stats",
        label: "Stat cards",
        kind: "json",
        hint: '{"numbers":["a","b","c"],"labels":["x","y","z"]}',
      },
      {
        name: "sections",
        label: "Sections",
        kind: "json",
        hint: '[{title, blocks:[{t:p|h3|h4|list, v}]}]',
      },
    ],
    readonly: ["slug"],
  },
  {
    name: "page_sections",
    label: "Index pages",
    pk: "page",
    orderBy: "page",
    allowNew: false,
    list: "page",
    fields: [
      { name: "h1", label: "Heading", kind: "text" },
      { name: "lead", label: "Lead paragraph", kind: "textarea", rows: 3 },
      {
        name: "sections",
        label: "Sections",
        kind: "json",
        hint: '[{title, blocks:[{t:p|h3|h4|list|table, v}]}]',
      },
    ],
    readonly: ["page"],
  },
  {
    name: "metrics",
    label: "Hero metrics",
    pk: "id",
    serial: true,
    orderBy: "sort",
    list: "label",
    fields: [
      { name: "value", label: "Value", kind: "text" },
      { name: "label", label: "Label", kind: "text" },
      { name: "accent", label: "Accent", kind: "select", options: ["primary", "secondary", "tertiary"] },
      { name: "sort", label: "Order", kind: "text" },
    ],
  },
  {
    name: "catchments",
    label: "Catchment chips",
    pk: "id",
    serial: true,
    orderBy: "sort",
    list: "name",
    fields: [
      { name: "name", label: "Name", kind: "text" },
      { name: "sort", label: "Order", kind: "text" },
    ],
  },
  {
    name: "directions",
    label: "Direction steps",
    pk: "id",
    serial: true,
    orderBy: "sort",
    list: "heading",
    fields: [
      { name: "heading", label: "Heading", kind: "text" },
      { name: "copy", label: "Body", kind: "textarea", rows: 3 },
      { name: "sort", label: "Order", kind: "text" },
    ],
  },
  {
    name: "consultation_submissions",
    label: "Booking requests",
    pk: "id",
    serial: true,
    orderBy: "created_at",
    desc: true,
    list: "name",
    allowNew: false,
    allowEdit: false,
    allowDelete: true,
    fields: [
      { name: "name", label: "Student / parent", kind: "text" },
      { name: "phone", label: "Phone", kind: "text" },
      { name: "exam", label: "Target exam", kind: "select", options: ["JAMB / UTME Clinic", "WAEC / NECO Intensive", "JUPEB Direct Entry", "IELTS / SAT Prep", "CAPS Admissions Advisory", "CBT Simulator Lab Only"] },
      { name: "level", label: "Level", kind: "text" },
      { name: "mode", label: "Attendance", kind: "text" },
      { name: "notes", label: "Course / school", kind: "textarea", rows: 3 },
      { name: "source", label: "Source page", kind: "text" },
      { name: "created_at", label: "Submitted", kind: "text" },
    ],
  },
  {
    name: "faqs",
    label: "FAQs",
    pk: "id",
    serial: true,
    orderBy: "sort",
    list: "q",
    fields: [
      { name: "grp", label: "Group", kind: "select", options: ["home", "programmes", "results", "contact"] },
      { name: "q", label: "Question", kind: "text" },
      { name: "a", label: "Answer", kind: "textarea", rows: 4 },
      { name: "sort", label: "Order", kind: "text" },
    ],
  },
];

export const table = (name: string) => TABLES.find((t) => t.name === name);

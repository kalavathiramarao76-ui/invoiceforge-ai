export interface Template {
  id: string;
  name: string;
  description: string;
  style: {
    accentColor: string;
    headerBg: string;
    fontStyle: string;
    layout: string;
  };
}

export const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Clean, whitespace-heavy design. Perfect for designers and creatives who value simplicity.",
    style: {
      accentColor: "#09090b",
      headerBg: "bg-white",
      fontStyle: "font-sans tracking-tight",
      layout: "minimal",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    description:
      "Professional and structured. Ideal for enterprise clients and large organizations.",
    style: {
      accentColor: "#1e40af",
      headerBg: "bg-blue-900",
      fontStyle: "font-serif",
      layout: "corporate",
    },
  },
  {
    id: "creative",
    name: "Creative",
    description:
      "Bold colors and modern layout. Great for agencies and creative professionals.",
    style: {
      accentColor: "#9333ea",
      headerBg: "bg-purple-900",
      fontStyle: "font-sans font-bold",
      layout: "creative",
    },
  },
  {
    id: "tech",
    name: "Tech",
    description:
      "Dark theme with monospace accents. Built for developers and tech consultants.",
    style: {
      accentColor: "#22c55e",
      headerBg: "bg-zinc-900",
      fontStyle: "font-mono",
      layout: "tech",
    },
  },
  {
    id: "agency",
    name: "Agency",
    description:
      "Sleek and premium. Designed for marketing agencies and consulting firms.",
    style: {
      accentColor: "#f59e0b",
      headerBg: "bg-amber-900",
      fontStyle: "font-sans uppercase tracking-widest",
      layout: "agency",
    },
  },
  {
    id: "consulting",
    name: "Consulting",
    description:
      "Elegant and trustworthy. Perfect for management consultants and advisors.",
    style: {
      accentColor: "#0f766e",
      headerBg: "bg-teal-900",
      fontStyle: "font-serif italic",
      layout: "consulting",
    },
  },
];

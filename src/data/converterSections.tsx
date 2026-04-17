import { converters } from "./converters";

/**
 * Grouped converter tools — each section shows a title (Office, Office 2, …) and its cards.
 * Slugs stay unique across the app for `/home/converter/:slug` routes.
 */
export const converterSections = [
  {
    id: "pdf",
    title: "PDF",
    converters: converters.slice(0, 8),
  },
  {
    id: "image",
    title: "Image",
    converters: converters.slice(8, 16),
  },
  {
    id: "other",
    title: "Other",
    converters: converters.slice(16),
  },
];

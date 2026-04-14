import { converters } from "./converters";

/**
 * Grouped converter tools — each section shows a title (Office, Office 2, …) and its cards.
 * Slugs stay unique across the app for `/home/converter/:slug` routes.
 */
export const converterSections = [
  {
    id: "office",
    title: "Office",
    converters: converters.slice(0, 8),
  },
  {
    id: "office-2",
    title: "Office 2",
    converters: converters.slice(8, 16),
  },
  {
    id: "office-3",
    title: "Office 3",
    converters: converters.slice(16),
  },
];

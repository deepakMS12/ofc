import { converters } from "./converters";

/** Tools listed under “Other” instead of PDF / Image slices (order preserved). */
const OTHER_SECTION_SLUGS = new Set(["lock-pdf"]);

/**
 * Grouped converter tools — each section shows a title (Office, Office 2, …) and its cards.
 * Slugs stay unique across the app for `/home/converter/:slug` routes.
 */
const convertersMain = converters.filter((c) => !OTHER_SECTION_SLUGS.has(c.slug));
const convertersOther = converters.filter((c) => OTHER_SECTION_SLUGS.has(c.slug));

export const converterSections = [
  {
    id: "pdf",
    title: "PDF",
    converters: convertersMain.slice(0, 8),
  },
  {
    id: "image",
    title: "Image",
    converters: convertersMain.slice(8, 16),
  },
  {
    id: "other",
    title: "Other",
    converters: convertersOther,
  },
];

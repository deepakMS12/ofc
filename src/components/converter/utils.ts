import type { WorkspaceVariant } from "./types";

export const getWorkspaceVariant = (slug?: string): WorkspaceVariant => {
  if (!slug) return "default";
  if (
    slug.includes("pdf-compress") ||
    slug.includes("pdf-editor") ||
    slug.includes("pdf-edit") ||
    slug.includes("pdf-split")
  ) {
    return "pdf-canvas";
  }
  if (slug === "compressor" || slug === "image-compressor") return "compressor";
  if (slug.includes("resizer")) return "resizer";
  return "default";
};

export const helperTextByVariant: Record<WorkspaceVariant, string> = {
  default: "Upload files and run conversion with default settings.",
  compressor: "Tune output quality and keep file size under control.",
  resizer: "Resize dimensions while preserving visual clarity.",
  "pdf-canvas": "Arrange pages on canvas before final export.",
};

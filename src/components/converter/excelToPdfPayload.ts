import { buildHtmlOfficeFormData } from "./htmlToOfficePayload";

/** Same multipart shape as HTML → Office: `file`, optional `baseName`, `mode` preview|download. */
export function buildExcelToPdfFormData(
  file: File,
  outputBaseName: string,
  mode: "download" | "preview",
): FormData {
  return buildHtmlOfficeFormData(file, outputBaseName, mode);
}

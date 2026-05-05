import { buildHtmlOfficeFormData } from "./htmlToOfficePayload";

export function buildPdfToHtmlFormData(
  file: File,
  pdfPassword: string,
  outputBaseName: string,
  mode: "download" | "preview",
): FormData {
  const fd = buildHtmlOfficeFormData(file, outputBaseName, mode);
  if (pdfPassword.trim()) {
    fd.append("password", pdfPassword.trim());
  }
  return fd;
}

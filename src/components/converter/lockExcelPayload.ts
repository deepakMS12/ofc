import { buildHtmlOfficeFormData } from "./htmlToOfficePayload";

export function buildLockExcelFormData(
  file: File,
  sheetPassword: string,
  outputBaseName: string,
  mode: "download" | "preview",
): FormData {
  const fd = buildHtmlOfficeFormData(file, outputBaseName, mode);
  fd.append("password", sheetPassword.trim());
  return fd;
}

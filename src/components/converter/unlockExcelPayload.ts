import { buildHtmlOfficeFormData } from "./htmlToOfficePayload";

export function buildUnlockExcelFormData(
  file: File,
  currentSheetPassword: string,
  outputBaseName: string,
  mode: "download" | "preview",
): FormData {
  const fd = buildHtmlOfficeFormData(file, outputBaseName, mode);
  if (currentSheetPassword.trim()) {
    fd.append("password", currentSheetPassword.trim());
  }
  return fd;
}

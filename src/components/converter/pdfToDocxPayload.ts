export function buildPdfToDocxFormData(
  file: File,
  outputBaseName: string,
  pdfPassword: string,
  mode: "download" | "preview",
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (outputBaseName.trim()) {
    fd.append("baseName", outputBaseName.trim());
  }
  if (pdfPassword.trim()) {
    fd.append("password", pdfPassword.trim());
  }
  fd.append("mode", mode);
  return fd;
}

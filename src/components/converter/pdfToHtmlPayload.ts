export function buildPdfToHtmlFormData(
  file: File,
  pdfPassword: string,
  outputFileName: string,
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (pdfPassword.trim()) {
    fd.append("password", pdfPassword.trim());
  }
  if (outputFileName.trim()) {
    fd.append("fileName", outputFileName.trim());
  }
  return fd;
}

export function buildPdfToDocxFormData(
  file: File,
  outputFileName: string,
  pdfPassword: string,
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (outputFileName.trim()) {
    fd.append("fileName", outputFileName.trim());
  }
  if (pdfPassword.trim()) {
    fd.append("password", pdfPassword.trim());
  }
  return fd;
}

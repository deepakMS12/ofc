export function buildPdfCompressFormData(
  file: File,
  outputName: string,
  pdfPassword: string,
  mode: "download" | "preview",
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (pdfPassword.trim()) {
    fd.append("password", pdfPassword.trim());
  }
  if (outputName.trim()) {
    fd.append("outputName", outputName.trim());
  }
  fd.append("mode", mode);
  return fd;
}

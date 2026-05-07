export function buildLockExcelFormData(
  file: File,
  sheetPassword: string,
  outputFileName: string,
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (outputFileName.trim()) {
    fd.append("fileName", outputFileName.trim());
  }
  fd.append("password", sheetPassword.trim());
  return fd;
}

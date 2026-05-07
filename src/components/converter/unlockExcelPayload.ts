export function buildUnlockExcelFormData(
  file: File,
  currentSheetPassword: string,
  outputFileName: string,
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (outputFileName.trim()) {
    fd.append("fileName", outputFileName.trim());
  }
  if (currentSheetPassword.trim()) {
    fd.append("password", currentSheetPassword.trim());
  }
  return fd;
}

export type HtmlOfficeTarget = "word" | "excel";

export function buildHtmlOfficeFormData(
  file: File,
  baseName: string,
  mode: "download" | "preview",
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (baseName.trim()) {
    fd.append("baseName", baseName.trim());
  }
  fd.append("mode", mode);
  return fd;
}

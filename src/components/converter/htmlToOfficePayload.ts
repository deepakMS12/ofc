export type HtmlOfficeTarget = "word" | "excel";

/** Multipart body: `file` + optional `fileName` (used by LibreOffice html_doc / html_excel routes). */
function buildLibreHtmlOfficeMultipart(file: File, fileName: string): FormData {
  const fd = new FormData();
  fd.append("file", file);
  const name = fileName.trim();
  if (name) fd.append("fileName", name);
  return fd;
}

/** POST /libreoffice/html_doc?type=<d|p>&r=0025 */
export function buildHtmlToWordFormData(file: File, fileName: string): FormData {
  return buildLibreHtmlOfficeMultipart(file, fileName);
}

/** POST /libreoffice/html_excel?type=<d|p>&r=0026 */
export function buildHtmlToExcelFormData(file: File, fileName: string): FormData {
  return buildLibreHtmlOfficeMultipart(file, fileName);
}

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

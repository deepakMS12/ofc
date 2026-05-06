import type { UrlToPdfQueryType } from "./urlToPdfPayload";

export type WkhtmlVariant = "url" | "html-code" | "html-file";

export type WkhtmlUrlLoadMode = "auto" | "server_fetch" | "direct_qt";

export type WkhtmlFormState = {
  variant: WkhtmlVariant;
  url: string;
  urlLoadMode: WkhtmlUrlLoadMode;
  html: string;
  baseUrl: string;
  outputName: string;
  pdfPassword: string;
};

export function buildWkhtmlPayload(
  state: WkhtmlFormState,
  _queryType: UrlToPdfQueryType,
  files: File[],
): Record<string, unknown> | FormData {
  const out = state.outputName.trim();
  const pwd = state.pdfPassword.trim();

  /** POST /wkhtmltopdf/url_pdf?type=<d|p>&r=0022 — body uses urlFetchMode / fileName per API. */
  if (state.variant === "url") {
    const body: Record<string, unknown> = {
      url: state.url.trim(),
      urlFetchMode: state.urlLoadMode,
    };
    if (out) body.fileName = out;
    if (pwd) body.password = pwd;
    return body;
  }

  /** POST /wkhtmltopdf/html_pdf?type=<d|p>&r=0023 — body uses htmlCode / fileName per API. */
  if (state.variant === "html-code") {
    const body: Record<string, unknown> = {
      htmlCode: state.html,
    };
    const bu = state.baseUrl.trim();
    if (bu) body.baseUrl = bu;
    if (out) body.fileName = out;
    if (pwd) body.password = pwd;
    return body;
  }

  /** POST /wkhtmltopdf/htmlfile_pdf?type=<d|p>&r=0024 — multipart file + fields (no mode body param). */
  const fd = new FormData();
  const file = files[0];
  if (!file) {
    throw new Error("HTML file is required.");
  }
  fd.append("file", file);
  if (out) fd.append("fileName", out);
  if (pwd) fd.append("password", pwd);
  if (state.baseUrl.trim()) fd.append("baseUrl", state.baseUrl.trim());
  return fd;
}

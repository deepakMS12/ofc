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

function modeFromQuery(queryType: UrlToPdfQueryType): "preview" | "download" {
  return queryType === "d" ? "preview" : "download";
}

export function buildWkhtmlPayload(
  state: WkhtmlFormState,
  queryType: UrlToPdfQueryType,
  files: File[],
): Record<string, unknown> | FormData {
  const mode = modeFromQuery(queryType);
  const out = state.outputName.trim();
  const pwd = state.pdfPassword.trim();
  const base: Record<string, unknown> = {
    mode,
    ...(out ? { outputFileName: out } : {}),
    ...(pwd ? { password: pwd } : {}),
  };

  if (state.variant === "url") {
    return {
      ...base,
      url: state.url.trim(),
      urlLoadMode: state.urlLoadMode,
    };
  }

  if (state.variant === "html-code") {
    return {
      ...base,
      html: state.html,
      ...(state.baseUrl.trim() ? { baseUrl: state.baseUrl.trim() } : {}),
    };
  }

  const fd = new FormData();
  const file = files[0];
  if (!file) {
    throw new Error("HTML file is required.");
  }
  fd.append("file", file);
  fd.append("mode", mode);
  if (out) fd.append("outputFileName", out);
  if (pwd) fd.append("password", pwd);
  if (state.baseUrl.trim()) fd.append("baseUrl", state.baseUrl.trim());
  return fd;
}

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  UrlToPdfQueryType,
  UrlToPdfRequestBody,
} from "@/components/converter/urlToPdfPayload";
import { urlToPdfClient } from "@/lib/api/urlToPdfClient";

export type ConvertUrlToPdfArg = {
  queryType: UrlToPdfQueryType;
  body: UrlToPdfRequestBody | FormData;
  downloadFileName: string;
  /** For JSON `{ data: { buffer } }` image responses, pick the decoded MIME/extension. */
  responseBodyFixedExt?: ".jpg" | ".png" | ".webp" | ".json";
  sourceType?:
    | "url"
    | "html"
    | "html-file"
    | "html-variable"
    | "docx-file"
    | "images-pdf"
    | "merge-pdf"
    | "pdf-to-image"
    | "pdf-compress"
    | "wkhtml-url"
    | "wkhtml-html-code"
    | "wkhtml-html-file"
    | "html-to-word"
    | "html-to-excel"
    | "pdf-lock-url"
    | "pdf-unlock-upload"
    | "pdf-to-docx"
    | "excel-to-pdf"
    | "lock-excel"
    | "unlock-excel"
    | "pdf-to-html"
    | "text-to-qr"
    | "text-to-barcode"
    | "scan-qr-barcode-upload"
    | "scan-qr-barcode-url";
};

export type ConvertUrlToPdfResult = {
  blob: Blob;
  downloadFileName: string;
};

async function messageFromBlob(blob: Blob): Promise<string> {
  const text = await blob.text();
  try {
    const o = JSON.parse(text) as { message?: string; error?: string };
    if (typeof o?.message === "string" && o.message.trim()) return o.message;
    if (typeof o?.error === "string" && o.error.trim()) return o.error;
  } catch {
    /* not JSON */
  }
  return text.trim() || "Conversion failed.";
}

type UrlToPdfSuccessJson = {
  success?: boolean;
  status?: string;
  message?: string;
  error?: string;
  data?: { buffer?: string; url?: string };
};

type OutputFileExt =
  | ".pdf"
  | ".zip"
  | ".docx"
  | ".xlsx"
  | ".json"
  | ".jpg"
  | ".png"
  | ".webp";

function mimeForExtension(ext: OutputFileExt): string {
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".zip") return "application/zip";
  if (ext === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (ext === ".xlsx") {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  if (ext === ".json") return "application/json";
  if (ext === ".jpg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  return "image/webp";
}

function base64ToBlob(base64: string, mime: string): Blob {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

type ParsedDownload =
  | { ok: true; blob: Blob; fileExt: OutputFileExt }
  | { ok: false; message: string };

type ParseOptions = {
  /** When set, JSON `{ data: { buffer } }` or ambiguous raw bytes use this extension/MIME. */
  fixedExt?: OutputFileExt;
};

/** API may return raw bytes or JSON with `{ data: { buffer: base64 } }`. */
async function responseBodyToDownloadBlob(
  body: Blob,
  options?: ParseOptions,
): Promise<ParsedDownload> {
  const buf = await body.arrayBuffer();
  const view = new Uint8Array(buf);
  const fixed = options?.fixedExt;

  if (view.length >= 1 && view[0] === 0x7b) {
    try {
      const text = new TextDecoder().decode(buf);
      const json = JSON.parse(text) as UrlToPdfSuccessJson;
      if (fixed === ".json") {
        return {
          ok: true,
          blob: new Blob([text], { type: "application/json" }),
          fileExt: ".json",
        };
      }
      const b64 = json.data?.buffer;
      if (typeof b64 === "string" && b64.length > 0) {
        if (fixed) {
          return {
            ok: true,
            blob: base64ToBlob(b64, mimeForExtension(fixed)),
            fileExt: fixed,
          };
        }
        return {
          ok: true,
          blob: base64ToBlob(b64, mimeForExtension(".pdf")),
          fileExt: ".pdf",
        };
      }
      const msg =
        (typeof json.message === "string" && json.message.trim()) ||
        (typeof json.error === "string" && json.error.trim()) ||
        "Conversion failed.";
      return { ok: false, message: msg };
    } catch {
      return { ok: false, message: "Invalid JSON response from server." };
    }
  }

  if (view.length >= 3 && view[0] === 0xff && view[1] === 0xd8 && view[2] === 0xff) {
    return {
      ok: true,
      blob: new Blob([buf], { type: "image/jpeg" }),
      fileExt: ".jpg",
    };
  }

  if (
    view.length >= 4 &&
    view[0] === 0x89 &&
    view[1] === 0x50 &&
    view[2] === 0x4e &&
    view[3] === 0x47
  ) {
    return {
      ok: true,
      blob: new Blob([buf], { type: "image/png" }),
      fileExt: ".png",
    };
  }

  if (
    view.length >= 12 &&
    view[0] === 0x52 &&
    view[1] === 0x49 &&
    view[2] === 0x46 &&
    view[3] === 0x46 &&
    view[8] === 0x57 &&
    view[9] === 0x45 &&
    view[10] === 0x42 &&
    view[11] === 0x50
  ) {
    return {
      ok: true,
      blob: new Blob([buf], { type: "image/webp" }),
      fileExt: ".webp",
    };
  }

  if (
    view.length >= 4 &&
    view[0] === 0x25 &&
    view[1] === 0x50 &&
    view[2] === 0x44 &&
    view[3] === 0x46
  ) {
    if (fixed) {
      return {
        ok: false,
        message: "Unexpected PDF response for this conversion.",
      };
    }
    return {
      ok: true,
      blob: new Blob([buf], { type: "application/pdf" }),
      fileExt: ".pdf",
    };
  }

  if (view.length >= 4 && view[0] === 0x50 && view[1] === 0x4b) {
    if (fixed) {
      return {
        ok: true,
        blob: new Blob([buf], { type: mimeForExtension(fixed) }),
        fileExt: fixed,
      };
    }
    return {
      ok: true,
      blob: new Blob([buf], { type: "application/zip" }),
      fileExt: ".zip",
    };
  }

  if (fixed && view.length > 0) {
    return {
      ok: true,
      blob: new Blob([buf], { type: mimeForExtension(fixed) }),
      fileExt: fixed,
    };
  }

  return {
    ok: false,
    message: "Unexpected response format (not JSON, JPEG, PNG, WebP, PDF, or ZIP).",
  };
}

function normalizeDownloadFileName(rawName: string, fileExt: OutputFileExt): string {
  const trimmed = rawName.trim();
  const fallback =
    fileExt === ".docx"
      ? "document"
      : fileExt === ".xlsx"
        ? "workbook"
        : fileExt === ".json"
          ? "scan-result"
        : fileExt === ".zip"
          ? "archive"
          : fileExt === ".jpg" || fileExt === ".png" || fileExt === ".webp"
            ? "export"
            : "export";
  const base = (trimmed || fallback).replace(
    /\.(pdf|zip|docx|xlsx|json|jpe?g|png|webp)$/i,
    "",
  );
  return `${base}${fileExt}`;
}

export const convertUrlToPdf = createAsyncThunk<
  ConvertUrlToPdfResult,
  ConvertUrlToPdfArg,
  { rejectValue: string }
>("urlToPdf/convert", async (arg, { rejectWithValue }) => {
  try {
    const endpoint =
      arg.sourceType === "url"
        ? "/convert/url"
        : arg.sourceType === "docx-file"
          ? "/convert/docx"
          : arg.sourceType === "images-pdf"
            ? "/convert/images-pdf"
            : arg.sourceType === "merge-pdf"
              ? "/convert/merge-pdf"
              : arg.sourceType === "pdf-to-image"
                ? "/convert/pdf-jpg"
                : arg.sourceType === "pdf-compress"
                  ? "/convert/pdf-compress"
                : arg.sourceType === "wkhtml-url"
              ? "/wkhtmltopdf/url_pdf"
              : arg.sourceType === "wkhtml-html-code"
                ? "/wkhtmltopdf/html_pdf"
                : arg.sourceType === "wkhtml-html-file"
                  ? "/wkhtmltopdf/htmlfile_pdf"
                  : arg.sourceType === "html-to-word"
                    ? "/libreoffice/html_doc"
                    : arg.sourceType === "html-to-excel"
                      ? "/libreoffice/html_excel"
                      : arg.sourceType === "pdf-lock-url"
                        ? "/convert/pdf-url"
                        : arg.sourceType === "pdf-unlock-upload"
                          ? "/convert/pdf-unlock"
                          : arg.sourceType === "pdf-to-docx"
                            ? "/libreoffice/pdf_doc"
                            : arg.sourceType === "excel-to-pdf"
                              ? "/libreoffice/xlsx_pdf"
                              : arg.sourceType === "lock-excel"
                                ? "/libreoffice/lock_excel"
                                : arg.sourceType === "unlock-excel"
                                  ? "/libreoffice/unlock_excel"
                                  : arg.sourceType === "pdf-to-html"
                                    ? "/libreoffice/pdf_html"
                                    : arg.sourceType === "text-to-qr"
                                      ? "/qrcode/text"
                                      : arg.sourceType === "text-to-barcode"
                                        ? "/barcode/text"
                                        : arg.sourceType ===
                                              "scan-qr-barcode-upload" ||
                                            arg.sourceType === "scan-qr-barcode-url"
                                          ? "/qrcode/scan"
                              : arg.sourceType === "html-variable"
                              ? "/convert/html/variable"
                              : "/convert/html";
    const isFormData = typeof FormData !== "undefined" && arg.body instanceof FormData;
    const skipQueryParam =
      arg.sourceType === "docx-file" ||
      arg.sourceType === "wkhtml-url" ||
      arg.sourceType === "wkhtml-html-code" ||
      arg.sourceType === "wkhtml-html-file" ||
      arg.sourceType === "html-to-word" ||
      arg.sourceType === "html-to-excel" ||
      arg.sourceType === "pdf-lock-url" ||
      arg.sourceType === "pdf-unlock-upload" ||
      arg.sourceType === "pdf-to-docx" ||
      arg.sourceType === "pdf-compress" ||
      arg.sourceType === "excel-to-pdf" ||
      arg.sourceType === "lock-excel" ||
      arg.sourceType === "unlock-excel" ||
      arg.sourceType === "pdf-to-html" ||
      arg.sourceType === "text-to-qr" ||
      arg.sourceType === "text-to-barcode" ||
      arg.sourceType === "scan-qr-barcode-upload" ||
      arg.sourceType === "scan-qr-barcode-url";
    const response = await urlToPdfClient.post<Blob>(
      endpoint,
      arg.body,
      {
        params: skipQueryParam ? undefined : { type: arg.queryType },
        responseType: "blob",
        headers: {
          Accept: "*/*",
          ...(isFormData ? { "Content-Type": false as unknown as string } : {}),
        },
      },
    );

    const raw = response.data;
    const parseOpts: ParseOptions | undefined =
      arg.sourceType === "html-to-word"
        ? { fixedExt: ".docx" }
        : arg.sourceType === "pdf-to-docx"
          ? { fixedExt: ".docx" }
          : arg.sourceType === "pdf-compress"
            ? { fixedExt: ".pdf" }
          : arg.sourceType === "excel-to-pdf"
            ? { fixedExt: ".pdf" }
            : arg.sourceType === "lock-excel"
              ? { fixedExt: ".xlsx" }
              : arg.sourceType === "unlock-excel"
                ? { fixedExt: ".xlsx" }
                : arg.sourceType === "pdf-to-html"
                  ? { fixedExt: ".zip" }
                  : arg.sourceType === "text-to-qr" && arg.responseBodyFixedExt
                    ? { fixedExt: arg.responseBodyFixedExt }
                    : arg.sourceType === "text-to-barcode" && arg.responseBodyFixedExt
                      ? { fixedExt: arg.responseBodyFixedExt }
                      : arg.sourceType === "scan-qr-barcode-upload" ||
                          arg.sourceType === "scan-qr-barcode-url"
                        ? { fixedExt: ".json" }
        : arg.sourceType === "html-to-excel"
          ? { fixedExt: ".xlsx" }
          : arg.responseBodyFixedExt
            ? { fixedExt: arg.responseBodyFixedExt }
            : undefined;
    const parsed = await responseBodyToDownloadBlob(raw, parseOpts);
    if (!parsed.ok) {
      return rejectWithValue(parsed.message);
    }

    const downloadFileName = normalizeDownloadFileName(
      arg.downloadFileName,
      parsed.fileExt,
    );

    return {
      blob: parsed.blob,
      downloadFileName,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
      return rejectWithValue(await messageFromBlob(err.response.data));
    }
    if (axios.isAxiosError(err) && typeof err.response?.data === "string") {
      return rejectWithValue(err.response.data || "Conversion failed.");
    }
    if (err instanceof Error && err.message) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Conversion failed.");
  }
});

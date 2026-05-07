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
    | "pdf-unlock-url"
    | "pdf-to-docx"
    | "excel-to-pdf"
    | "lock-excel"
    | "unlock-excel"
    | "pdf-to-html"
    | "text-to-qr"
    | "text-to-barcode"
    | "scan-qr-barcode-upload"
    | "scan-qr-barcode-url"
    | "docx-template";
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

type SourceType = NonNullable<ConvertUrlToPdfArg["sourceType"]>;

const SOURCE_ENDPOINT_MAP: Partial<Record<SourceType, string>> = {
    url: "/convert/url",
    "docx-file": "/convert/docx",
    "html-file": "/convert/html-file",
    "html-variable": "/convert/html-variable",
    "images-pdf": "/convert/images-pdf",
    "merge-pdf": "/convert/merge-pdf",
    "pdf-to-image": "/convert/pdf-jpg",
    "pdf-compress": "/convert/pdf-compress",
    "wkhtml-url": "/wkhtmltopdf/url_pdf",
    "wkhtml-html-code": "/wkhtmltopdf/html_pdf",
    "wkhtml-html-file": "/wkhtmltopdf/htmlfile_pdf",
    "html-to-word": "/libreoffice/html_doc",
    "html-to-excel": "/libreoffice/html_excel",
    "pdf-lock-url": "/convert/pdf-url",
    "pdf-unlock-url": "/convert/pdf-unlock-url",
    "pdf-unlock-upload": "/convert/pdf-unlock",
    "pdf-to-docx": "/convert/pdf-doc",
    "excel-to-pdf": "/convert/excel-pdf",
    "lock-excel": "/convert/excel-lock",
    "unlock-excel": "/convert/excel-unlock",
    "pdf-to-html": "/convert/pdf-html",
    "text-to-qr": "/qrcode/text",
    "text-to-barcode": "/barcode/text",
    "scan-qr-barcode-upload": "/qrcode/scan",
    "scan-qr-barcode-url": "/qrcode/scan",
    "docx-template": "/convert/docx-template",
};

const SOURCES_WITHOUT_QUERY_PARAM = new Set<SourceType>([
  "pdf-compress",
  "text-to-qr",
  "text-to-barcode",
  "scan-qr-barcode-upload",
  "scan-qr-barcode-url",
]);

const SOURCE_QUERY_R_MAP: Partial<Record<SourceType, string>> = {
    url: "0001",
    "wkhtml-url": "0022",
    "wkhtml-html-code": "0023",
    "wkhtml-html-file": "0024",
    html: "0002",
    "html-file": "0003",
    "docx-file": "0004",
    "docx-template": "0006",
    "images-pdf": "0011",
    "merge-pdf": "0010",
    "pdf-to-image": "0012",
    "html-variable": "0028",
    "html-to-word": "0025",
    "html-to-excel": "0026",
    "pdf-lock-url": "0007",
    "pdf-unlock-url": "0008",
    "pdf-unlock-upload": "0009",
    "pdf-to-docx": "0013",
    "excel-to-pdf": "0014",
    "pdf-to-html": "0016",
    "lock-excel": "0020",
    "unlock-excel": "0021",
};

const SOURCE_FIXED_EXT_MAP: Partial<Record<SourceType, OutputFileExt>> = {
  "html-to-word": ".docx",
  "pdf-to-docx": ".docx",
  "pdf-compress": ".pdf",
  "excel-to-pdf": ".pdf",
  "lock-excel": ".xlsx",
  "unlock-excel": ".xlsx",
  "pdf-to-html": ".zip",
  "scan-qr-barcode-upload": ".json",
  "scan-qr-barcode-url": ".json",
  "html-to-excel": ".xlsx",
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

  if (
    view.length >= 3 &&
    view[0] === 0xff &&
    view[1] === 0xd8 &&
    view[2] === 0xff
  ) {
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
    message:
      "Unexpected response format (not JSON, JPEG, PNG, WebP, PDF, or ZIP).",
  };
}

function normalizeDownloadFileName(
  rawName: string,
  fileExt: OutputFileExt,
): string {
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
    // UI currently emits queryType with opposite semantics; normalize to API contract:
    // download => d, preview => p.
    const apiQueryType: UrlToPdfQueryType = arg.queryType === "d" ? "p" : "d";

    const endpoint = arg.sourceType
      ? SOURCE_ENDPOINT_MAP[arg.sourceType] ?? "/convert/html"
      : "/convert/html";
    const isFormData =
      typeof FormData !== "undefined" && arg.body instanceof FormData;
    const skipQueryParam =
      !!arg.sourceType && SOURCES_WITHOUT_QUERY_PARAM.has(arg.sourceType);
    const queryCode = arg.sourceType
      ? SOURCE_QUERY_R_MAP[arg.sourceType]
      : undefined;
    const response = await urlToPdfClient.post<Blob>(endpoint, arg.body, {
      params: skipQueryParam
        ? undefined
        : queryCode
          ? { type: apiQueryType, r: queryCode }
          : { type: apiQueryType },
      responseType: "blob",
      headers: {
        Accept: "*/*",
        ...(isFormData ? { "Content-Type": false as unknown as string } : {}),
      },
    });

    const raw = response.data;
    const fixedExtFromSource = arg.sourceType
      ? SOURCE_FIXED_EXT_MAP[arg.sourceType]
      : undefined;
    const parseOpts: ParseOptions | undefined = fixedExtFromSource
      ? { fixedExt: fixedExtFromSource }
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

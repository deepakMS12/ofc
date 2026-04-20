import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  UrlToPdfQueryType,
  UrlToPdfRequestBody,
} from "@/components/converter/urlToPdfPayload";
import { urlToPdfClient } from "@/lib/api/urlToPdfClient";

export type ConvertUrlToPdfArg = {
  queryType: UrlToPdfQueryType;
  body: UrlToPdfRequestBody;
  downloadFileName: string;
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

function base64ToPdfBlob(base64: string): Blob {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/pdf" });
}

/** API may return raw PDF bytes or JSON with `{ data: { buffer: base64 } }`. */
async function responseBodyToPdfBlob(body: Blob): Promise<
  | { ok: true; pdf: Blob }
  | { ok: false; message: string }
> {
  const buf = await body.arrayBuffer();
  const view = new Uint8Array(buf);
  if (view.length >= 1 && view[0] === 0x7b) {
    try {
      const text = new TextDecoder().decode(buf);
      const json = JSON.parse(text) as UrlToPdfSuccessJson;
      const b64 = json.data?.buffer;
      if (typeof b64 === "string" && b64.length > 0) {
        return { ok: true, pdf: base64ToPdfBlob(b64) };
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
    view.length >= 4 &&
    view[0] === 0x25 &&
    view[1] === 0x50 &&
    view[2] === 0x44 &&
    view[3] === 0x46
  ) {
    return { ok: true, pdf: new Blob([buf], { type: "application/pdf" }) };
  }
  return { ok: false, message: "Unexpected response format (not PDF or JSON)." };
}

export const convertUrlToPdf = createAsyncThunk<
  ConvertUrlToPdfResult,
  ConvertUrlToPdfArg,
  { rejectValue: string }
>("urlToPdf/convert", async (arg, { rejectWithValue }) => {
  try {
    const response = await urlToPdfClient.post<Blob>(
      "/convert/url",
      arg.body,
      {
        params: { type: arg.queryType },
        responseType: "blob",
        headers: { Accept: "*/*" },
      },
    );

    const raw = response.data;
    const parsed = await responseBodyToPdfBlob(raw);
    if (!parsed.ok) {
      return rejectWithValue(parsed.message);
    }

    return {
      blob: parsed.pdf,
      downloadFileName: arg.downloadFileName,
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



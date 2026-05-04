import type { UrlToPdfQueryType } from "./urlToPdfPayload";
import type {
  WatermarkFontOption,
  WatermarkPositionId,
  WatermarkStampType,
  WatermarkTextLayoutId,
} from "./watermarkStampOptions";

export type PdfToImageDownloadFormatId = "jpeg" | "png" | "webp";

export type PdfToImageFormFields = {
  pdfPassword: string;
  dpi: string;
  downloadFormat: PdfToImageDownloadFormatId;
  outputFileName: string;
  watermarkType: WatermarkStampType;
  watermarkPosition: WatermarkPositionId;
  watermarkImageUrl: string;
  watermarkImageScaleX: number;
  watermarkImageScaleY: number;
  watermarkImageOpacity: number;
  watermarkImageRotation: number;
  watermarkText: string;
  watermarkTextLayout: WatermarkTextLayoutId;
  watermarkFont: WatermarkFontOption;
  watermarkTextSizePx: string;
  watermarkTextColor: string;
  watermarkTextOpacity: number;
  stampFooter: string;
};

export function downloadFormatToFileExt(
  f: PdfToImageDownloadFormatId,
): ".jpg" | ".png" | ".webp" {
  if (f === "jpeg") return ".jpg";
  if (f === "png") return ".png";
  return ".webp";
}

export function isDpiInRange(raw: string): boolean {
  const t = raw.trim();
  if (!/^\d+$/.test(t)) return false;
  const n = Number(t);
  return n >= 72 && n <= 600;
}

function buildWatermarkJson(
  fields: PdfToImageFormFields,
): Record<string, unknown> | null {
  if (fields.watermarkType === "image") {
    const url = fields.watermarkImageUrl.trim();
    if (!url) return null;
    return {
      type: "image",
      url,
      position: fields.watermarkPosition,
      scaleX: String(fields.watermarkImageScaleX),
      scaleY: String(fields.watermarkImageScaleY),
      opacity: String(fields.watermarkImageOpacity),
      rotation: String(fields.watermarkImageRotation),
    };
  }
  const text = fields.watermarkText.trim();
  if (!text) return null;
  const size =
    fields.watermarkTextSizePx.trim() === ""
      ? "64"
      : fields.watermarkTextSizePx.trim();
  return {
    type: "text",
    text,
    layout: fields.watermarkTextLayout,
    font: fields.watermarkFont,
    size,
    color: fields.watermarkTextColor,
    opacity: String(fields.watermarkTextOpacity),
    position: fields.watermarkPosition,
  };
}

export function buildPdfToImageFormData(
  file: File,
  fields: PdfToImageFormFields,
  mode: "preview" | "download",
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (fields.pdfPassword.trim()) {
    fd.append("password", fields.pdfPassword.trim());
  }
  fd.append("dpi", fields.dpi.trim() || "300");
  fd.append("format", fields.downloadFormat);
  if (fields.outputFileName.trim()) {
    fd.append("outputFileName", fields.outputFileName.trim());
  }
  fd.append("mode", mode);

  const wm = buildWatermarkJson(fields);
  if (wm) {
    fd.append("watermark", JSON.stringify(wm));
  }
  if (fields.stampFooter.trim()) {
    fd.append("stamp", fields.stampFooter.trim());
  }

  return fd;
}

export function buildPdfToImagePayload(
  file: File,
  fields: PdfToImageFormFields,
  queryType: UrlToPdfQueryType,
): { queryType: UrlToPdfQueryType; body: FormData } {
  const mode: "preview" | "download" = queryType === "d" ? "preview" : "download";
  return {
    queryType,
    body: buildPdfToImageFormData(file, fields, mode),
  };
}

export type BarcodeExportFormat = "png" | "jpeg" | "webp";

export type TextToBarcodeFormState = {
  symbology: string;
  moduleWidth: string;
  barHeight: string;
  quietZone: string;
  foreground: string;
  background: string;
  textSize: string;
  textDistance: string;
  hideCaptionUnderBars: boolean;
  widthPx: string;
  heightPx: string;
  paddingPx: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  exportFormat: BarcodeExportFormat;
  data: string;
  outputName: string;
  mode: "download" | "preview";
};

export function barcodeExportFormatToExt(
  format: BarcodeExportFormat,
): ".png" | ".jpg" | ".webp" {
  if (format === "jpeg") return ".jpg";
  if (format === "webp") return ".webp";
  return ".png";
}

export function buildTextToBarcodeFormData(state: TextToBarcodeFormState): FormData {
  const fd = new FormData();
  const parseOptionalNumber = (raw: string): number | undefined => {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
  };
  const normalizeSymbology = (raw: string): string => {
    const v = raw.trim().toUpperCase();
    if (v === "CODE128") return "code128";
    if (v === "CODE39") return "code39";
    if (v === "EAN13") return "ean13";
    if (v === "EAN8") return "ean8";
    if (v === "ITF") return "itf";
    if (v === "CODABAR") return "codabar";
    return raw.toLowerCase();
  };
  const normalizedExportFormat =
    state.exportFormat === "jpeg" ? "jpg" : state.exportFormat;

  const options = {
    symbology: normalizeSymbology(state.symbology),
    text: state.data,
    module_width: Number(state.moduleWidth) || 0.25,
    module_height: Number(state.barHeight) || 12,
    quiet_zone: Number(state.quietZone) || 2.5,
    foreground: state.foreground,
    background: state.background,
    font_size: Number(state.textSize) || 11,
    text_distance: Number(state.textDistance) || 4,
    hide_caption: state.hideCaptionUnderBars,
    padding_px: Number(state.paddingPx) || 0,
    margin_top: Number(state.marginTop) || 0,
    margin_right: Number(state.marginRight) || 0,
    margin_bottom: Number(state.marginBottom) || 0,
    margin_left: Number(state.marginLeft) || 0,
    export_format: normalizedExportFormat,
    width: parseOptionalNumber(state.widthPx),
    height: parseOptionalNumber(state.heightPx),
  };

  // New API contract for /convert/barcode?type=d&r=0018
  fd.append("options", JSON.stringify(options));
  fd.append("fileName", state.outputName.trim() || "barcode");

  // Backward-compatible fields kept for older backends.
  fd.append("symbology", state.symbology);
  fd.append("moduleWidth", state.moduleWidth);
  fd.append("barHeight", state.barHeight);
  fd.append("quietZone", state.quietZone);
  fd.append("foreground", state.foreground);
  fd.append("background", state.background);
  fd.append("textSize", state.textSize);
  fd.append("textDistance", state.textDistance);
  fd.append("hideCaptionUnderBars", String(state.hideCaptionUnderBars));
  fd.append("widthPx", state.widthPx);
  fd.append("heightPx", state.heightPx);
  fd.append("paddingPx", state.paddingPx);
  fd.append("marginTop", state.marginTop);
  fd.append("marginRight", state.marginRight);
  fd.append("marginBottom", state.marginBottom);
  fd.append("marginLeft", state.marginLeft);
  fd.append("exportFormat", state.exportFormat);
  fd.append("data", state.data);
  fd.append("outputName", state.outputName);
  fd.append("mode", state.mode);
  return fd;
}

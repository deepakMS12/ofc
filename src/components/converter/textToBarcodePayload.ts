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

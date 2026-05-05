export type QrExportFormat = "png" | "jpeg" | "webp";

export type TextToQrFormState = {
  qrType: string;
  rawPayload: string;
  errorCorrection: string;
  moduleBoxSize: string;
  quietBorder: string;
  paddingPx: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  logoSizeRatio: string;
  logoPaddingPx: string;
  logoPlateColor: string;
  centerImageUrl: string;
  foreground: string;
  background: string;
  gradientSecondColor: string;
  gradientDirection: string;
  moduleStyle: string;
  scanTracking: boolean;
  utmMedium: string;
  utmCampaign: string;
  colorOverlaysJson: string;
  outputWidthPx: string;
  outputHeightPx: string;
  outputName: string;
  mode: "download" | "preview";
  exportFormat: QrExportFormat;
};

export function qrExportFormatToExt(
  format: QrExportFormat,
): ".png" | ".jpg" | ".webp" {
  if (format === "jpeg") return ".jpg";
  if (format === "webp") return ".webp";
  return ".png";
}

export function buildTextToQrFormData(
  state: TextToQrFormState,
  centerIconFile: File | null,
): FormData {
  const fd = new FormData();
  fd.append("qrType", state.qrType);
  fd.append("rawPayload", state.rawPayload);
  fd.append("errorCorrection", state.errorCorrection);
  fd.append("moduleBoxSize", state.moduleBoxSize);
  fd.append("quietBorder", state.quietBorder);
  fd.append("paddingPx", state.paddingPx);
  fd.append("marginTop", state.marginTop);
  fd.append("marginRight", state.marginRight);
  fd.append("marginBottom", state.marginBottom);
  fd.append("marginLeft", state.marginLeft);
  fd.append("logoSizeRatio", state.logoSizeRatio);
  fd.append("logoPaddingPx", state.logoPaddingPx);
  fd.append("logoPlateColor", state.logoPlateColor);
  fd.append("centerImageUrl", state.centerImageUrl);
  fd.append("foreground", state.foreground);
  fd.append("background", state.background);
  fd.append("gradientSecondColor", state.gradientSecondColor);
  fd.append("gradientDirection", state.gradientDirection);
  fd.append("moduleStyle", state.moduleStyle);
  fd.append("scanTracking", String(state.scanTracking));
  fd.append("utmMedium", state.utmMedium);
  fd.append("utmCampaign", state.utmCampaign);
  fd.append("colorOverlaysJson", state.colorOverlaysJson);
  fd.append("outputWidthPx", state.outputWidthPx);
  fd.append("outputHeightPx", state.outputHeightPx);
  fd.append("outputName", state.outputName);
  fd.append("mode", state.mode);
  fd.append("exportFormat", state.exportFormat);
  if (centerIconFile) {
    fd.append("centerIcon", centerIconFile);
  }
  return fd;
}

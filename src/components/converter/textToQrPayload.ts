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
  const normalizeGradientDirection = (v: string): string => {
    if (v === "diagonal") return "diag";
    if (v === "horizontal") return "h";
    if (v === "vertical") return "v";
    return "none";
  };
  const parseColorLayers = (raw: string): Array<Record<string, unknown>> => {
    if (!raw.trim()) return [{}];
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed as Array<Record<string, unknown>>;
      return [{}];
    } catch {
      return [{}];
    }
  };

  const options = {
    mode: state.qrType,
    payload: state.rawPayload,
    error_correction: state.errorCorrection,
    box_size: Number(state.moduleBoxSize) || 10,
    border: Number(state.quietBorder) || 1,
    fg_color: state.foreground,
    bg_color: state.background,
    module_style: state.moduleStyle,
    logo_ratio: Number(state.logoSizeRatio) || 0.22,
    padding_px: Number(state.paddingPx) || 0,
    margin_top: Number(state.marginTop) || 0,
    margin_right: Number(state.marginRight) || 0,
    margin_bottom: Number(state.marginBottom) || 0,
    margin_left: Number(state.marginLeft) || 0,
    export_format: state.exportFormat,
    logo_padding_px: Number(state.logoPaddingPx) || 0,
    logo_bg_color: state.logoPlateColor,
    gradient_direction: normalizeGradientDirection(state.gradientDirection),
    color_layers: parseColorLayers(state.colorOverlaysJson),
    hashtag: state.utmCampaign.trim() ? `#${state.utmCampaign.trim().replace(/^#/, "")}` : "#QRCode",
    site_url: state.centerImageUrl.trim() || "https://localhost",
    twitter_handle: state.utmMedium.trim() || "user",
  };

  // New API contract for /qr-code?type=d&r=0017
  fd.append("options", JSON.stringify(options));
  fd.append("fileName", state.outputName.trim() || "qr-out");
  if (centerIconFile) {
    fd.append("logo", centerIconFile);
  }

  // Backward-compatible fields kept for older backends.
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

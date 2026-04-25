import type { PdfDimensionUnitId } from "./pdfDimensionUnits";
import type { PdfPageFormatId } from "./pdfPageFormats";
import type { EncryptionLevelId } from "./rightsEncryptionOptions";
import type {
  WatermarkFontOption,
  WatermarkPositionId,
  WatermarkStampType,
  WatermarkTextLayoutId,
} from "./watermarkStampOptions";

export type UrlToPdfConversionSettingId =
  | "usePrintLayout"
  | "optimizeLayout"
  | "removeBackground"
  | "removeHyperlinks"
  | "blockAds"
  | "hideCookieNotices";

export type UrlToPdfRightsRestrictionId =
  | "disallowPrint"
  | "disallowAnnotation"
  | "disallowContentCopy"
  | "disableEditingPdf";

export type UrlToPdfMargins = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

/** API query: `d` = draft (simple body); `p` = full options (watermark, rights, password, …). */
export type UrlToPdfQueryType = "d" | "p";

export type UrlToPdfRequestBody = Record<string, unknown>;

export type UrlToPdfFormState = {
  sourceValue: string;
  sourceType: "url" | "html" | "html-file";
  /** When true → `?type=d`; when false → `?type=p`. */
  isPreview: boolean;
  alignment: string;
  pageFormat: PdfPageFormatId;
  dimensionUnit: PdfDimensionUnitId;
  pageWidth: string;
  pageHeight: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  conversionSettings: Record<UrlToPdfConversionSettingId, boolean>;
  waitTimeMs: string;
  headerHtml: string;
  footerHtml: string;
  headerEveryPage: boolean;
  footerEveryPage: boolean;
  customCss: string;
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
  encryptionLevel: EncryptionLevelId;
  userPassword: string;
  ownerPassword: string;
  rightsRestrictions: Record<UrlToPdfRightsRestrictionId, boolean>;
};

function emptyToNull(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : s;
}

function mapEncryption(level: EncryptionLevelId): string {
  if (level === "aes-128") return "128";
  if (level === "aes-256") return "256";
  return "none";
}

type ImageWm = {
  type: "image";
  url: string;
  position: WatermarkPositionId;
  scaleX: string;
  scaleY: string;
  opacity: string;
  rotation: string;
};

type TextWm = {
  type: "text";
  text: string;
  layout: WatermarkTextLayoutId;
  font: WatermarkFontOption;
  size: string;
  color: string;
  opacity: string;
  position: WatermarkPositionId;
};

function buildWatermark(
  state: UrlToPdfFormState,
): ImageWm | TextWm | null {
  if (state.watermarkType === "image") {
    const url = state.watermarkImageUrl.trim();
    if (!url) return null;
    return {
      type: "image",
      url,
      position: state.watermarkPosition,
      scaleX: String(state.watermarkImageScaleX),
      scaleY: String(state.watermarkImageScaleY),
      opacity: String(state.watermarkImageOpacity),
      rotation: String(state.watermarkImageRotation),
    };
  }
  const text = state.watermarkText.trim();
  if (!text) return null;
  const size =
    state.watermarkTextSizePx.trim() === ""
      ? "64"
      : state.watermarkTextSizePx.trim();
  return {
    type: "text",
    text,
    layout: state.watermarkTextLayout,
    font: state.watermarkFont,
    size,
    color: state.watermarkTextColor,
    opacity: String(state.watermarkTextOpacity),
    position: state.watermarkPosition,
  };
}

function buildRights(state: UrlToPdfFormState): Record<string, unknown> | null {
  const {
    encryptionLevel,
    userPassword,
    ownerPassword,
    rightsRestrictions,
  } = state;
  const hasPasswords = Boolean(userPassword.trim() || ownerPassword.trim());
  const hasRestrictions = Object.values(rightsRestrictions).some(Boolean);
  const hasEncryption = encryptionLevel !== "none";

  if (!hasPasswords && !hasRestrictions && !hasEncryption) return null;

  const encLevel: EncryptionLevelId =
    encryptionLevel !== "none"
      ? encryptionLevel
      : hasPasswords || hasRestrictions
        ? "aes-128"
        : "none";

  return {
    encryption: mapEncryption(encLevel),
    userPassword: userPassword.trim(),
    ownerPassword: ownerPassword.trim(),
    disallowPrint: rightsRestrictions.disallowPrint,
    disallowCopy: rightsRestrictions.disallowContentCopy,
    disallowAnnotation: rightsRestrictions.disallowAnnotation,
    disallowEdit: rightsRestrictions.disableEditingPdf,
  };
}

function baseMargins(state: UrlToPdfFormState): UrlToPdfMargins {
  return {
    top: state.marginTop.trim() || "0",
    right: state.marginRight.trim() || "0",
    bottom: state.marginBottom.trim() || "0",
    left: state.marginLeft.trim() || "0",
  };
}

export function buildUrlToPdfPayload(state: UrlToPdfFormState): {
  queryType: UrlToPdfQueryType;
  body: UrlToPdfRequestBody;
} {
  const orientation =
    state.alignment === "android" ? "landscape" : "portrait";
  const margins = baseMargins(state);
  const waitTime =
    state.waitTimeMs.trim() === "" ? "0" : state.waitTimeMs.trim();
  const pageFormatApi =
    state.pageFormat === "custom" ? "custom" : state.pageFormat;

  const sourceKey = state.sourceType === "url" ? "url" : "html";
  const common: UrlToPdfRequestBody = {
    [sourceKey]: state.sourceValue.trim(),
    pageFormat: pageFormatApi,
    orientation,
    unit: state.dimensionUnit,
    margins,
    waitTime,
    printLayout: state.conversionSettings.usePrintLayout,
    optimizeLayout: state.conversionSettings.optimizeLayout,
    removeBackground: state.conversionSettings.removeBackground,
    removeHyperlinks: state.conversionSettings.removeHyperlinks,
    blockAds: state.conversionSettings.blockAds,
    hideCookieNotices: state.conversionSettings.hideCookieNotices,
  };

  if (state.isPreview) {
    return {
      queryType: "d",
      body: {
        ...common,
        ...(state.pageFormat === "custom"
          ? {
              customWidth: state.pageWidth.trim() || "210",
              customHeight: state.pageHeight.trim() || "297",
            }
          : {}),
        header: emptyToNull(state.headerHtml),
        headerEveryPage: state.headerEveryPage,
        footer: emptyToNull(state.footerHtml),
        footerEveryPage: state.footerEveryPage,
        customCss: emptyToNull(state.customCss),
        watermark: null,
        rights: null,
      },
    };
  }

  const pwd = state.userPassword.trim();
  const watermark = buildWatermark(state);
  const rights = buildRights(state);

  const body: UrlToPdfRequestBody = {
    ...common,
    ...(pwd ? { password: pwd } : {}),
    ...(state.pageFormat === "custom"
      ? {
          customWidth: state.pageWidth.trim() || "210",
          customHeight: state.pageHeight.trim() || "297",
        }
      : {}),
    header: emptyToNull(state.headerHtml),
    headerEveryPage: state.headerEveryPage,
    footer: emptyToNull(state.footerHtml),
    footerEveryPage: state.footerEveryPage,
    customCss: emptyToNull(state.customCss),
    watermark: watermark ?? null,
    rights: rights ?? null,
  };

  return { queryType: "p", body };
}

export const DEFAULT_URL_TO_PDF_API_BASE = "https://hostinger.apiportal.online";

export type URLtoPDFHandle = {
  getPayload: () => {
    queryType: UrlToPdfQueryType;
    body: UrlToPdfRequestBody;
  };
  getSourceValue: () => string;
  getOutputFileName: () => string;
};

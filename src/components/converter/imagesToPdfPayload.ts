import type { PdfDimensionUnitId } from "./pdfDimensionUnits";
import type { PdfPageFormatId } from "./pdfPageFormats";
import type { EncryptionLevelId } from "./rightsEncryptionOptions";
import {
  buildPdfRightsFromFields,
  type UrlToPdfQueryType,
  type UrlToPdfRightsRestrictionId,
} from "./urlToPdfPayload";

export type ImagesToPdfRightsRestrictionId = UrlToPdfRightsRestrictionId;

export type ImagesToPdfFormFields = {
  merge: boolean;
  simpleOpenPassword: string;
  outputFileName: string;
  pageFormat: PdfPageFormatId;
  alignment: "web" | "android";
  dimensionUnit: PdfDimensionUnitId;
  pageWidth: string;
  pageHeight: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  encryptionLevel: EncryptionLevelId;
  userPassword: string;
  ownerPassword: string;
  rightsRestrictions: Record<ImagesToPdfRightsRestrictionId, boolean>;
};

export function buildImagesToPdfFormData(
  files: File[],
  fields: ImagesToPdfFormFields,
  queryType: UrlToPdfQueryType,
): FormData {
  const fd = new FormData();
  for (const f of files) {
    fd.append("files", f);
  }
  const pageFormatApi =
    fields.pageFormat === "custom" ? "custom" : fields.pageFormat;
  const rights = buildPdfRightsFromFields(
    fields.encryptionLevel,
    fields.userPassword,
    fields.ownerPassword,
    fields.rightsRestrictions,
  );
  const options = {
    pageFormat: pageFormatApi,
    orientation: fields.alignment === "android" ? "landscape" : "portrait",
    unit: fields.dimensionUnit,
    customWidth: Number(fields.pageWidth.trim() || "210"),
    customHeight: Number(fields.pageHeight.trim() || "297"),
    margins: {
      top: fields.marginTop.trim() || "0",
      right: fields.marginRight.trim() || "0",
      bottom: fields.marginBottom.trim() || "0",
      left: fields.marginLeft.trim() || "0",
    },
    merge: fields.merge,
    ...(queryType === "p" ? { rights } : {}),
  };
  fd.append("options", JSON.stringify(options));

  return fd;
}

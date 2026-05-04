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
  fd.append("merge", String(fields.merge));
  const pageFormatApi =
    fields.pageFormat === "custom" ? "custom" : fields.pageFormat;
  fd.append("pageFormat", pageFormatApi);
  fd.append(
    "orientation",
    fields.alignment === "android" ? "landscape" : "portrait",
  );
  fd.append("unit", fields.dimensionUnit);
  fd.append(
    "margins",
    JSON.stringify({
      top: fields.marginTop.trim() || "0",
      right: fields.marginRight.trim() || "0",
      bottom: fields.marginBottom.trim() || "0",
      left: fields.marginLeft.trim() || "0",
    }),
  );
  if (fields.pageFormat === "custom") {
    fd.append("customWidth", fields.pageWidth.trim() || "210");
    fd.append("customHeight", fields.pageHeight.trim() || "297");
  }
  if (fields.outputFileName.trim()) {
    fd.append("outputFileName", fields.outputFileName.trim());
  }
  if (fields.simpleOpenPassword.trim()) {
    fd.append("password", fields.simpleOpenPassword.trim());
  }
  fd.append("mode", queryType === "d" ? "preview" : "download");

  if (queryType === "p") {
    const rights = buildPdfRightsFromFields(
      fields.encryptionLevel,
      fields.userPassword,
      fields.ownerPassword,
      fields.rightsRestrictions,
    );
    if (rights) {
      fd.append("rights", JSON.stringify(rights));
    }
  }

  return fd;
}

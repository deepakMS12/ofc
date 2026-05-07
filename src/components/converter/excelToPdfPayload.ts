import type { EncryptionLevelId } from "./rightsEncryptionOptions";
import { buildPdfRightsFromFields } from "./urlToPdfPayload";

type ExcelToPdfFields = {
  outputFileName: string;
  scaling: string;
  pageSize: string;
  orientation: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  watermarkType: "image" | "text";
  watermarkPosition: string;
  watermarkUrl: string;
  stampText: string;
  simpleOpenPassword: string;
  encryptionLevel: EncryptionLevelId;
  userPassword: string;
  ownerPassword: string;
  disallowPrint: boolean;
  disallowAnnotation: boolean;
  disallowContentCopy: boolean;
  disableEditingPdf: boolean;
};

export function buildExcelToPdfFormData(
  file: File,
  fields: ExcelToPdfFields,
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (fields.outputFileName.trim()) {
    fd.append("fileName", fields.outputFileName.trim());
  }
  if (fields.simpleOpenPassword.trim()) {
    fd.append("password", fields.simpleOpenPassword.trim());
  }

  const options: Record<string, unknown> = {
    scaleMode: fields.scaling,
    pageSize: fields.pageSize.toLowerCase(),
    orientation: fields.orientation,
    margins: {
      top: fields.marginTop.trim() || "12",
      right: fields.marginRight.trim() || "12",
      bottom: fields.marginBottom.trim() || "12",
      left: fields.marginLeft.trim() || "12",
    },
  };
  if (fields.watermarkType === "image" && fields.watermarkUrl.trim()) {
    options.watermark = {
      type: "image",
      url: fields.watermarkUrl.trim(),
      position: fields.watermarkPosition,
      scaleX: "100",
      scaleY: "100",
      opacity: "50",
      rotation: "0",
    };
  } else if (fields.watermarkType === "text" && fields.stampText.trim()) {
    options.watermark = {
      type: "text",
      text: fields.stampText.trim(),
      position: fields.watermarkPosition,
    };
  }
  fd.append("options", JSON.stringify(options));

  const rights = buildPdfRightsFromFields(
    fields.encryptionLevel,
    fields.userPassword,
    fields.ownerPassword,
    {
      disallowPrint: fields.disallowPrint,
      disallowAnnotation: fields.disallowAnnotation,
      disallowContentCopy: fields.disallowContentCopy,
      disableEditingPdf: fields.disableEditingPdf,
    },
  );
  if (rights) {
    fd.append("rights", JSON.stringify(rights));
  }
  return fd;
}

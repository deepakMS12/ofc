import type { EncryptionLevelId } from "./rightsEncryptionOptions";
import {
  buildPdfRightsFromFields,
  type UrlToPdfQueryType,
  type UrlToPdfRightsRestrictionId,
} from "./urlToPdfPayload";

export type MergePdfRightsRestrictionId = UrlToPdfRightsRestrictionId;

export type MergePdfFormFields = {
  inputPasswordsJson: string;
  simpleOpenPassword: string;
  outputFileName: string;
  encryptionLevel: EncryptionLevelId;
  userPassword: string;
  ownerPassword: string;
  rightsRestrictions: Record<MergePdfRightsRestrictionId, boolean>;
};

export function isValidMergeInputPasswordsJson(raw: string): boolean {
  const s = raw.trim();
  if (s === "") return true;
  try {
    const v = JSON.parse(s) as unknown;
    return Array.isArray(v) && v.every((x) => typeof x === "string");
  } catch {
    return false;
  }
}

export function buildMergePdfFormData(
  files: File[],
  fields: MergePdfFormFields,
  queryType: UrlToPdfQueryType,
): FormData {
  const fd = new FormData();
  for (const f of files) {
    fd.append("files", f);
  }
  if (fields.inputPasswordsJson.trim()) {
    fd.append("inputPasswords", fields.inputPasswordsJson.trim());
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

export type PdfUrlSecurityMode = "lock" | "unlock";

export type PdfUrlSecurityFormState = {
  pdfUrl: string;
  password: string;
  outputFileName: string;
};

const defaultBaseName = (mode: PdfUrlSecurityMode) =>
  mode === "lock" ? "locked" : "unlocked";

/** JSON body for POST /convert/pdf-url (lock). */
export function buildPdfUrlSecurityBody(
  mode: PdfUrlSecurityMode,
  state: PdfUrlSecurityFormState,
): Record<string, string> {
  if (mode !== "lock") {
    throw new Error("buildPdfUrlSecurityBody is only used for lock mode.");
  }
  const output = state.outputFileName.trim() || defaultBaseName(mode);
  const body: Record<string, string> = {
    pdfUrl: state.pdfUrl.trim(),
    outputFileName: output,
    userPassword: state.password.trim(),
  };
  return body;
}

/** FormData for POST /convert/pdf-unlock (upload). */
export function buildPdfUnlockUploadFormData(
  file: File,
  unlockPassword: string,
  outputFileName: string,
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (unlockPassword.trim()) {
    fd.append("password", unlockPassword.trim());
  }
  const out = outputFileName.trim() || defaultBaseName("unlock");
  fd.append("outputFileName", out);
  return fd;
}

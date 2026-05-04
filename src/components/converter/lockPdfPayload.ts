export type LockPdfFormState = {
  pdfUrl: string;
  userPassword: string;
  /** Optional output base name (`.pdf` added by download normalization). */
  outputFileName: string;
};

/** POST /convert/pdf-url — body keys align with typical PDF-from-URL lock flows. */
export function buildLockPdfRequestBody(state: LockPdfFormState): Record<string, string> {
  const output = state.outputFileName.trim() || "locked";
  return {
    pdfUrl: state.pdfUrl.trim(),
    userPassword: state.userPassword.trim(),
    outputFileName: output,
  };
}

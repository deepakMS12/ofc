export type ScanQrSourceMode = "upload" | "url";

export function buildScanQrUploadFormData(
  file: File,
  outputName: string,
  mode: "download" | "preview",
): FormData {
  const fd = new FormData();
  fd.append("file", file);
  if (outputName.trim()) fd.append("outputName", outputName.trim());
  fd.append("mode", mode);
  return fd;
}

export function buildScanQrUrlBody(
  imageUrl: string,
  outputName: string,
  mode: "download" | "preview",
): Record<string, string> {
  const body: Record<string, string> = {
    imageUrl: imageUrl.trim(),
    mode,
  };
  if (outputName.trim()) body.outputName = outputName.trim();
  return body;
}

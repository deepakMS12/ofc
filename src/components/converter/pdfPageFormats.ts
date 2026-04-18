import type { PdfDimensionUnitId } from "./pdfDimensionUnits";

export type PdfPageFormatId =
  | "letter"
  | "a2"
  | "a3"
  | "a4"
  | "a5"
  | "a6"
  | "custom";

export type PdfPagePresetId = Exclude<PdfPageFormatId, "custom">;
export const PDF_PRESET_DIMENSIONS_MM: Record<
  PdfPagePresetId,
  { widthMm: number; heightMm: number }
> = {
  letter: { widthMm: 216, heightMm: 279 },
  a2: { widthMm: 420, heightMm: 594 },
  a3: { widthMm: 298, heightMm: 420 },
  a4: { widthMm: 210, heightMm: 298 },
  a5: { widthMm: 148, heightMm: 210 },
  a6: { widthMm: 105, heightMm: 148 },
};

export type PdfPageFormatOption = {
  id: PdfPageFormatId;
  label: string;
};

export const PDF_PAGE_FORMAT_OPTIONS: readonly PdfPageFormatOption[] = [
  { id: "letter", label: "Letter (216 × 279 mm, 8.5 × 11 inches)" },
  { id: "a2", label: "A2 (420 × 594 mm, 16.5 × 23.4 inches)" },
  { id: "a3", label: "A3 (298 × 420 mm, 11.7 × 16.5 inches)" },
  { id: "a4", label: "A4 (210 × 298 mm, 8.3 × 11.7 inches)" },
  { id: "a5", label: "A5 (148 × 210 mm, 5.8 × 8.3 inches)" },
  { id: "a6", label: "A6 (105 × 148 mm, 4.1 × 5.8 inches)" },
  { id: "custom", label: "Custom..." },
] as const;

/** Preset formats always display mm; landscape swaps displayed width/height. */
export function getPresetPageSizeFields(
  format: PdfPageFormatId,
  isLandscape: boolean,
): { unit: PdfDimensionUnitId; width: string; height: string } | null {
  if (format === "custom") return null;
  const { widthMm, heightMm } = PDF_PRESET_DIMENSIONS_MM[format];
  if (isLandscape) {
    return {
      unit: "mm",
      width: String(heightMm),
      height: String(widthMm),
    };
  }
  return {
    unit: "mm",
    width: String(widthMm),
    height: String(heightMm),
  };
}

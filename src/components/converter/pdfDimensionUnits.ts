export type PdfDimensionUnitId = "mm" | "cm" | "px" | "in";

export type PdfDimensionUnitOption = {
  id: PdfDimensionUnitId;
  label: string;
};

export const PDF_DIMENSION_UNIT_OPTIONS: readonly PdfDimensionUnitOption[] = [
  { id: "mm", label: "mm" },
  { id: "cm", label: "cm" },
  { id: "px", label: "px" },
  { id: "in", label: "in" },
] as const;

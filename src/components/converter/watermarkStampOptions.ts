export type WatermarkStampType = "image" | "text";

export type WatermarkPositionId =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export const WATERMARK_POSITION_OPTIONS: readonly {
  id: WatermarkPositionId;
  label: string;
}[] = [
  { id: "top-left", label: "Top Left" },
  { id: "top-center", label: "Top Center" },
  { id: "top-right", label: "Top Right" },
  { id: "middle-left", label: "Middle Left" },
  { id: "middle-center", label: "Middle Center" },
  { id: "middle-right", label: "Middle Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "bottom-center", label: "Bottom Center" },
  { id: "bottom-right", label: "Bottom Right" },
];

export type WatermarkTextLayoutId = "diagonal" | "horizontal";

export const WATERMARK_TEXT_LAYOUT_OPTIONS: readonly {
  id: WatermarkTextLayoutId;
  label: string;
}[] = [
  { id: "diagonal", label: "Diagonal" },
  { id: "horizontal", label: "Horizontal" },
];

export const WATERMARK_FONT_OPTIONS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
] as const;

export type WatermarkFontOption = (typeof WATERMARK_FONT_OPTIONS)[number];

export const WATERMARK_STAMP_TYPE_OPTIONS: readonly {
  id: WatermarkStampType;
  label: string;
}[] = [
  { id: "image", label: "Image" },
  { id: "text", label: "Text" },
];

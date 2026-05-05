import { memo } from "react";
import type { RefObject } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RotateRightRoundedIcon from "@mui/icons-material/RotateRightRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { colors } from "@/utils/customColor";
import type { ImageOutputFormat } from "./types";
import MergePdfPanel, { type MergePdfHandle } from "./MergePdfPanel";
import PdfToImagePanel, { type PdfToImageHandle } from "./PdfToImagePanel";
import PdfCompressPanel, { type PdfCompressHandle } from "./PdfCompressPanel";
import type { URLtoPDFHandle } from "./urlToPdfPayload";
import URLtoPDF from "./URLtoPDF";
import HtmlVariableToPDF, { type HtmlVariableToPdfHandle } from "./HtmlVariableToPDF";
import DocxToPDF, { type DocxToPdfHandle } from "./DocxToPDF";
import TemplateFillToPDF from "./TemplateFillToPDF";
import ImagesToPDF, { type ImagesToPdfHandle } from "./ImagesToPDF";
import WkhtmlToPdfPanel, {
  type WkhtmlToPdfHandle,
  wkhtmlSlugToVariant,
} from "./WkhtmlToPdfPanel";
import HtmlToOfficePanel, {
  type HtmlToOfficeHandle,
  htmlOfficeSlugToTarget,
} from "./HtmlToOfficePanel";
import PdfUrlSecurityPanel, {
  type PdfUrlSecurityHandle,
  pdfUrlSecuritySlugToMode,
} from "./PdfUrlSecurityPanel";
import PdfToDocxPanel, { type PdfToDocxHandle } from "./PdfToDocxPanel";
import ExcelToPdfPanel, { type ExcelToPdfHandle } from "./ExcelToPdfPanel";
import LockExcelPanel, { type LockExcelHandle } from "./LockExcelPanel";
import UnlockExcelPanel, { type UnlockExcelHandle } from "./UnlockExcelPanel";
import PdfToHtmlPanel, { type PdfToHtmlHandle } from "./PdfToHtmlPanel";
import TextToQrPanel, { type TextToQrHandle } from "./TextToQrPanel";
import TextToBarcodePanel, { type TextToBarcodeHandle } from "./TextToBarcodePanel";
import ScanQrBarcodePanel, {
  type ScanQrBarcodeHandle,
} from "./ScanQrBarcodePanel";

type ImagesToPdfSidebarBundle = {
  ref: RefObject<ImagesToPdfHandle | null>;
};

type MergePdfSidebarBundle = {
  ref: RefObject<MergePdfHandle | null>;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type PdfToImageSidebarBundle = {
  ref: RefObject<PdfToImageHandle | null>;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type PdfCompressSidebarBundle = {
  ref: RefObject<PdfCompressHandle | null>;
  selectedFileName: string | undefined;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type WkhtmlToPdfSidebarBundle = {
  ref: RefObject<WkhtmlToPdfHandle | null>;
  selectedFileName: string | undefined;
  onRequestPickFile: () => void;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type HtmlToOfficeSidebarBundle = {
  ref: RefObject<HtmlToOfficeHandle | null>;
  selectedFileName: string | undefined;
  onRequestPickFile: () => void;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type PdfUrlSecuritySidebarBundle = {
  ref: RefObject<PdfUrlSecurityHandle | null>;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
  selectedFileName?: string;
  onRequestPickFile?: () => void;
};

type PdfToDocxSidebarBundle = {
  ref: RefObject<PdfToDocxHandle | null>;
  selectedFileName: string | undefined;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type ExcelToPdfSidebarBundle = {
  ref: RefObject<ExcelToPdfHandle | null>;
  selectedFileName: string | undefined;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type LockExcelSidebarBundle = {
  ref: RefObject<LockExcelHandle | null>;
  selectedFileName: string | undefined;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type UnlockExcelSidebarBundle = {
  ref: RefObject<UnlockExcelHandle | null>;
  selectedFileName: string | undefined;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type PdfToHtmlSidebarBundle = {
  ref: RefObject<PdfToHtmlHandle | null>;
  selectedFileName: string | undefined;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type TextToQrSidebarBundle = {
  ref: RefObject<TextToQrHandle | null>;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type TextToBarcodeSidebarBundle = {
  ref: RefObject<TextToBarcodeHandle | null>;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type ScanQrBarcodeSidebarBundle = {
  ref: RefObject<ScanQrBarcodeHandle | null>;
  mode: "upload" | "url";
  selectedFileName?: string | undefined;
  onRequestPickFile?: () => void;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

type WorkspaceSidebarProps = {
  toolSlug?: string;
  urlToPdfRef?: RefObject<URLtoPDFHandle | null>;
  htmlVariableToPdfRef?: RefObject<HtmlVariableToPdfHandle | null>;
  docxToPdfRef?: RefObject<DocxToPdfHandle | null>;
  imagesToPdf?: ImagesToPdfSidebarBundle;
  mergePdf?: MergePdfSidebarBundle;
  pdfToImage?: PdfToImageSidebarBundle;
  pdfCompress?: PdfCompressSidebarBundle;
  wkhtmlToPdf?: WkhtmlToPdfSidebarBundle;
  htmlToOffice?: HtmlToOfficeSidebarBundle;
  pdfUrlSecurity?: PdfUrlSecuritySidebarBundle;
  pdfToDocx?: PdfToDocxSidebarBundle;
  excelToPdf?: ExcelToPdfSidebarBundle;
  lockExcel?: LockExcelSidebarBundle;
  unlockExcel?: UnlockExcelSidebarBundle;
  pdfToHtml?: PdfToHtmlSidebarBundle;
  textToQr?: TextToQrSidebarBundle;
  textToBarcode?: TextToBarcodeSidebarBundle;
  scanQrBarcode?: ScanQrBarcodeSidebarBundle;
  onUrlToPdfSourceChange?: (value: string) => void;
  files: File[];
  miniCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  activePageIndex: number;
  zoomLevel: number;
  rotation: number;
  imageResizePercent: number;
  imageCompressionQuality: number;
  imageOutputFormat: ImageOutputFormat;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onRotate: () => void;
  onRemoveFile: (index: number) => void;
  onImageResizePercentChange: (value: number) => void;
  onImageCompressionQualityChange: (value: number) => void;
  onImageOutputFormatChange: (value: ImageOutputFormat) => void;
};

const WorkspaceSidebar = memo(
  ({
    toolSlug,
    urlToPdfRef,
    htmlVariableToPdfRef,
    docxToPdfRef,
    imagesToPdf,
    mergePdf,
    pdfToImage,
    pdfCompress,
    wkhtmlToPdf,
    htmlToOffice,
    pdfUrlSecurity,
    pdfToDocx,
    excelToPdf,
    lockExcel,
    unlockExcel,
    pdfToHtml,
    textToQr,
    textToBarcode,
    scanQrBarcode,
    onUrlToPdfSourceChange,
    files,
    activePageIndex,
    zoomLevel,
    rotation,
    imageResizePercent,
    imageCompressionQuality,
    imageOutputFormat,
    onZoomOut,
    onZoomIn,
    onRotate,
    onRemoveFile,
    onImageResizePercentChange,
    onImageCompressionQualityChange,
    onImageOutputFormatChange,
  }: WorkspaceSidebarProps) => {
    // const getTitle = (slug?: string) => {
    //   if (slug === "pdf-compressor") return "PDF Compress";
    //   if (slug === "resizer") return "Resizer";
    //   return "Tools";
    // };
    return (
      <Paper
        elevation={0}
        sx={{
      height: "100%",
          p: 0,
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 1.6,
        }}
      >
        {/* <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
          {getTitle(toolSlug)}
        </Typography> */}

        {toolSlug === "pdf-compressor" && pdfCompress && (
          <PdfCompressPanel
            ref={pdfCompress.ref}
            selectedFileName={pdfCompress.selectedFileName}
            onValidityChange={pdfCompress.onValidityChange}
            onFieldsDirty={pdfCompress.onFieldsDirty}
          />
        )}
        {toolSlug === "pdf-merge" && mergePdf && (
          <MergePdfPanel
            ref={mergePdf.ref}
            fileCount={files.length}
            onValidityChange={mergePdf.onValidityChange}
            onFieldsDirty={mergePdf.onFieldsDirty}
          />
        )}
        {toolSlug === "pdf-to-image" && pdfToImage && (
          <PdfToImagePanel
            ref={pdfToImage.ref}
            fileCount={files.length}
            onValidityChange={pdfToImage.onValidityChange}
            onFieldsDirty={pdfToImage.onFieldsDirty}
          />
        )}
        {(toolSlug === "url-to-pdf" ||
          toolSlug === "html-code-to-pdf" ||
          toolSlug === "HTML code to PDF" ||
          toolSlug === "html-file-to-pdf") && (
          <URLtoPDF
            ref={urlToPdfRef}
            sourceType={
              toolSlug === "html-code-to-pdf" ||
              toolSlug === "HTML code to PDF"
                ? "html"
                : toolSlug === "html-file-to-pdf"
                  ? "html-file"
                  : "url"
            }
            onSourceChange={onUrlToPdfSourceChange}
          />
        )}
        {toolSlug === "html-variable-to-pdf" && (
          <HtmlVariableToPDF ref={htmlVariableToPdfRef} />
        )}
        {toolSlug === "docx-to-pdf" && (
          <DocxToPDF ref={docxToPdfRef} selectedFile={files[0] ?? null} />
        )}
        {toolSlug === "template-fill-to-pdf" && <TemplateFillToPDF />}
        {toolSlug === "images-to-pdf" && imagesToPdf && (
          <ImagesToPDF ref={imagesToPdf.ref} fileCount={files.length} />
        )}
        {wkhtmlSlugToVariant(toolSlug) && wkhtmlToPdf && (
          <WkhtmlToPdfPanel
            ref={wkhtmlToPdf.ref}
            variant={wkhtmlSlugToVariant(toolSlug)!}
            selectedFileName={wkhtmlToPdf.selectedFileName}
            onRequestPickFile={wkhtmlToPdf.onRequestPickFile}
            onValidityChange={wkhtmlToPdf.onValidityChange}
            onFieldsDirty={wkhtmlToPdf.onFieldsDirty}
          />
        )}
        {htmlOfficeSlugToTarget(toolSlug) && htmlToOffice && (
          <HtmlToOfficePanel
            ref={htmlToOffice.ref}
            target={htmlOfficeSlugToTarget(toolSlug)!}
            selectedFileName={htmlToOffice.selectedFileName}
            onRequestPickFile={htmlToOffice.onRequestPickFile}
            onValidityChange={htmlToOffice.onValidityChange}
            onFieldsDirty={htmlToOffice.onFieldsDirty}
          />
        )}
        {pdfUrlSecuritySlugToMode(toolSlug) && pdfUrlSecurity && (
          <PdfUrlSecurityPanel
            ref={pdfUrlSecurity.ref}
            mode={pdfUrlSecuritySlugToMode(toolSlug)!}
            selectedFileName={pdfUrlSecurity.selectedFileName}
            onRequestPickFile={pdfUrlSecurity.onRequestPickFile}
            onValidityChange={pdfUrlSecurity.onValidityChange}
            onFieldsDirty={pdfUrlSecurity.onFieldsDirty}
          />
        )}
        {toolSlug === "pdf-to-docx" && pdfToDocx && (
          <PdfToDocxPanel
            ref={pdfToDocx.ref}
            selectedFileName={pdfToDocx.selectedFileName}
            onValidityChange={pdfToDocx.onValidityChange}
            onFieldsDirty={pdfToDocx.onFieldsDirty}
          />
        )}
        {toolSlug === "excel-to-pdf" && excelToPdf && (
          <ExcelToPdfPanel
            ref={excelToPdf.ref}
            selectedFileName={excelToPdf.selectedFileName}
            onValidityChange={excelToPdf.onValidityChange}
            onFieldsDirty={excelToPdf.onFieldsDirty}
          />
        )}
        {toolSlug === "lock-excel" && lockExcel && (
          <LockExcelPanel
            ref={lockExcel.ref}
            selectedFileName={lockExcel.selectedFileName}
            onValidityChange={lockExcel.onValidityChange}
            onFieldsDirty={lockExcel.onFieldsDirty}
          />
        )}
        {toolSlug === "unlock-excel" && unlockExcel && (
          <UnlockExcelPanel
            ref={unlockExcel.ref}
            selectedFileName={unlockExcel.selectedFileName}
            onValidityChange={unlockExcel.onValidityChange}
            onFieldsDirty={unlockExcel.onFieldsDirty}
          />
        )}
        {toolSlug === "pdf-to-html" && pdfToHtml && (
          <PdfToHtmlPanel
            ref={pdfToHtml.ref}
            selectedFileName={pdfToHtml.selectedFileName}
            onValidityChange={pdfToHtml.onValidityChange}
            onFieldsDirty={pdfToHtml.onFieldsDirty}
          />
        )}
        {toolSlug === "text-to-qr" && textToQr && (
          <TextToQrPanel
            ref={textToQr.ref}
            onValidityChange={textToQr.onValidityChange}
            onFieldsDirty={textToQr.onFieldsDirty}
          />
        )}
        {toolSlug === "text-to-barcode" && textToBarcode && (
          <TextToBarcodePanel
            ref={textToBarcode.ref}
            onValidityChange={textToBarcode.onValidityChange}
            onFieldsDirty={textToBarcode.onFieldsDirty}
          />
        )}
        {(toolSlug === "scan-qr-barcode-upload" ||
          toolSlug === "scan-qr-barcode-url") &&
          scanQrBarcode && (
            <ScanQrBarcodePanel
              ref={scanQrBarcode.ref}
              mode={scanQrBarcode.mode}
              selectedFileName={scanQrBarcode.selectedFileName}
              onRequestPickFile={scanQrBarcode.onRequestPickFile}
              onValidityChange={scanQrBarcode.onValidityChange}
              onFieldsDirty={scanQrBarcode.onFieldsDirty}
            />
          )}

        {toolSlug === "pdf-canvas" && (
          <Stack spacing={1.2}>
            <Stack direction="row" spacing={0.8} flexWrap="wrap">
              <IconButton size="small" onClick={onZoomOut}>
                <ZoomOutRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={onZoomIn}>
                <ZoomInRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={onRotate}>
                <RotateRightRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small">
                <SwapVertRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
            <Typography
              sx={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}
            >
              Zoom {zoomLevel}% | Rotation {rotation}deg
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                disabled={!files.length}
                onClick={() => onRemoveFile(activePageIndex)}
                sx={{
                  minWidth: "auto",
                  px: 1.2,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Remove
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                disabled={!files.length}
                onClick={() => onRemoveFile(activePageIndex)}
                sx={{
                  minWidth: "auto",
                  px: 1.2,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        )}

        {toolSlug === "resizer" && (
          <Box>
            <Typography
              sx={{ fontSize: 12, color: "#374151", fontWeight: 700 }}
            >
              Resize ({imageResizePercent}%)
            </Typography>
            <Slider
              value={imageResizePercent}
              min={10}
              max={200}
              step={5}
              valueLabelDisplay="auto"
              onChange={(_, value) =>
                onImageResizePercentChange(value as number)
              }
              sx={{ mt: 1, color: colors.primary }}
            />
          </Box>
        )}

        {(toolSlug === "compressor" || toolSlug === "resizer") && (
          <Box>
            <Typography
              sx={{ fontSize: 12, color: "#374151", fontWeight: 700 }}
            >
              Output format
            </Typography>
            <Box
              component="select"
              value={imageOutputFormat}
              onChange={(event) =>
                onImageOutputFormatChange(
                  event.target.value as ImageOutputFormat,
                )
              }
              sx={{
                mt: 1,
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: 1,
                px: 1,
                py: 1,
                fontSize: 13,
                color: "#1f2937",
                outline: "none",
              }}
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WEBP</option>
            </Box>
          </Box>
        )}

        {imageOutputFormat !== "image/png" &&
          (toolSlug === "compressor" || toolSlug === "resizer") && (
            <Box>
              <Typography
                sx={{ fontSize: 12, color: "#374151", fontWeight: 700 }}
              >
                Quality ({imageCompressionQuality}%)
              </Typography>
              <Slider
                value={imageCompressionQuality}
                min={10}
                max={100}
                step={5}
                valueLabelDisplay="auto"
                onChange={(_, value) =>
                  onImageCompressionQualityChange(value as number)
                }
                sx={{ mt: 1, color: colors.primary }}
              />
            </Box>
          )}


      </Paper>
    );
  },
);

WorkspaceSidebar.displayName = "WorkspaceSidebar";

export default WorkspaceSidebar;

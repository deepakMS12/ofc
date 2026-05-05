import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { URLtoPDFHandle } from "@/components/converter/urlToPdfPayload";
import type { HtmlVariableToPdfHandle } from "@/components/converter/HtmlVariableToPDF";
import type { DocxToPdfHandle } from "@/components/converter/DocxToPDF";
import type { ImagesToPdfHandle } from "@/components/converter/ImagesToPDF";
import type { MergePdfHandle } from "@/components/converter/MergePdfPanel";
import type { PdfToImageHandle } from "@/components/converter/PdfToImagePanel";
import type { PdfCompressHandle } from "@/components/converter/PdfCompressPanel";
import type { WkhtmlToPdfHandle } from "@/components/converter/WkhtmlToPdfPanel";
import { wkhtmlSlugToVariant } from "@/components/converter/WkhtmlToPdfPanel";
import type { HtmlToOfficeHandle } from "@/components/converter/HtmlToOfficePanel";
import { htmlOfficeSlugToTarget } from "@/components/converter/HtmlToOfficePanel";
import {
  pdfUrlSecuritySlugToMode,
  type PdfUrlSecurityHandle,
} from "@/components/converter/PdfUrlSecurityPanel";
import type { PdfToDocxHandle } from "@/components/converter/PdfToDocxPanel";
import type { ExcelToPdfHandle } from "@/components/converter/ExcelToPdfPanel";
import type { LockExcelHandle } from "@/components/converter/LockExcelPanel";
import type { UnlockExcelHandle } from "@/components/converter/UnlockExcelPanel";
import type { PdfToHtmlHandle } from "@/components/converter/PdfToHtmlPanel";
import type { TextToQrHandle } from "@/components/converter/TextToQrPanel";
import type { TextToBarcodeHandle } from "@/components/converter/TextToBarcodePanel";
import type { ScanQrBarcodeHandle } from "@/components/converter/ScanQrBarcodePanel";
import { convertUrlToPdf } from "@/store/thunks/urlToPdfThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ChangeEvent } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Link as RouterLink, useParams } from "react-router-dom";
import EmptyWorkspaceState from "@/components/converter/EmptyWorkspaceState";
import FileTile from "@/components/converter/FileTile";
import WorkspaceSidebar from "@/components/converter/WorkspaceSidebar";
import type { ImageOutputFormat } from "@/components/converter/types";
import { getWorkspaceVariant } from "@/components/converter/utils";
import { colors } from "@/utils/customColor";
import { converters } from "../data/converters";
import ConverterLoadingWorkspace from "@/components/converter/ConverterLoadingWorkspace";
import UrlToPdfDownloadSuccess from "@/components/converter/DownloadSuccess";
import { useToast } from "@/hooks/useToast";

const ConverterTool = () => {
  const { slug } = useParams();
  const tool = converters.find((c) => c.slug === slug);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const urlToPdfLoading = useAppSelector(
    (s) => s.urlToPdf.status === "loading",
  );
  const [urlToPdfDownloadComplete, setUrlToPdfDownloadComplete] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlToPdfRef = useRef<URLtoPDFHandle | null>(null);
  const htmlVariableToPdfRef = useRef<HtmlVariableToPdfHandle | null>(null);
  const docxToPdfRef = useRef<DocxToPdfHandle | null>(null);
  const imagesToPdfRef = useRef<ImagesToPdfHandle | null>(null);
  const mergePdfRef = useRef<MergePdfHandle | null>(null);
  const pdfToImageRef = useRef<PdfToImageHandle | null>(null);
  const pdfCompressRef = useRef<PdfCompressHandle | null>(null);
  const wkhtmlToPdfRef = useRef<WkhtmlToPdfHandle | null>(null);
  const htmlToOfficeRef = useRef<HtmlToOfficeHandle | null>(null);
  const pdfUrlSecurityRef = useRef<PdfUrlSecurityHandle | null>(null);
  const pdfToDocxRef = useRef<PdfToDocxHandle | null>(null);
  const excelToPdfRef = useRef<ExcelToPdfHandle | null>(null);
  const lockExcelRef = useRef<LockExcelHandle | null>(null);
  const unlockExcelRef = useRef<UnlockExcelHandle | null>(null);
  const pdfToHtmlRef = useRef<PdfToHtmlHandle | null>(null);
  const textToQrRef = useRef<TextToQrHandle | null>(null);
  const textToBarcodeRef = useRef<TextToBarcodeHandle | null>(null);
  const scanQrBarcodeRef = useRef<ScanQrBarcodeHandle | null>(null);
  const [wkhtmlCanConvert, setWkhtmlCanConvert] = useState(false);
  const [wkhtmlFieldsEpoch, setWkhtmlFieldsEpoch] = useState(0);
  const [htmlOfficeCanConvert, setHtmlOfficeCanConvert] = useState(false);
  const [htmlOfficeFieldsEpoch, setHtmlOfficeFieldsEpoch] = useState(0);
  const [pdfUrlSecurityCanConvert, setPdfUrlSecurityCanConvert] =
    useState(false);
  const [pdfUrlSecurityFieldsEpoch, setPdfUrlSecurityFieldsEpoch] =
    useState(0);
  const [mergePdfCanConvert, setMergePdfCanConvert] = useState(true);
  const [mergePdfFieldsEpoch, setMergePdfFieldsEpoch] = useState(0);
  const [pdfToImageCanConvert, setPdfToImageCanConvert] = useState(false);
  const [pdfToImageFieldsEpoch, setPdfToImageFieldsEpoch] = useState(0);
  const [pdfCompressCanConvert, setPdfCompressCanConvert] = useState(false);
  const [pdfCompressFieldsEpoch, setPdfCompressFieldsEpoch] = useState(0);
  const [pdfToDocxCanConvert, setPdfToDocxCanConvert] = useState(false);
  const [pdfToDocxFieldsEpoch, setPdfToDocxFieldsEpoch] = useState(0);
  const [excelToPdfCanConvert, setExcelToPdfCanConvert] = useState(false);
  const [excelToPdfFieldsEpoch, setExcelToPdfFieldsEpoch] = useState(0);
  const [lockExcelCanConvert, setLockExcelCanConvert] = useState(false);
  const [lockExcelFieldsEpoch, setLockExcelFieldsEpoch] = useState(0);
  const [unlockExcelCanConvert, setUnlockExcelCanConvert] = useState(false);
  const [unlockExcelFieldsEpoch, setUnlockExcelFieldsEpoch] = useState(0);
  const [pdfToHtmlCanConvert, setPdfToHtmlCanConvert] = useState(false);
  const [pdfToHtmlFieldsEpoch, setPdfToHtmlFieldsEpoch] = useState(0);
  const [textToQrCanConvert, setTextToQrCanConvert] = useState(false);
  const [textToQrFieldsEpoch, setTextToQrFieldsEpoch] = useState(0);
  const [textToBarcodeCanConvert, setTextToBarcodeCanConvert] = useState(false);
  const [textToBarcodeFieldsEpoch, setTextToBarcodeFieldsEpoch] = useState(0);
  const [scanQrBarcodeCanConvert, setScanQrBarcodeCanConvert] = useState(false);
  const [scanQrBarcodeFieldsEpoch, setScanQrBarcodeFieldsEpoch] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [urlToPdfSource, setUrlToPdfSource] = useState("");
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageResizePercent, setImageResizePercent] = useState(100);
  const [imageCompressionQuality, setImageCompressionQuality] = useState(80);
  const [imageOutputFormat, setImageOutputFormat] =
    useState<ImageOutputFormat>("image/png");

  const { sourceLabel, targetLabel } = useMemo(() => {
    const t = tool?.title?.trim() ?? "";
    if (!t) return { sourceLabel: "File", targetLabel: "Output" };
    if (t.includes(" TO ")) {
      const i = t.indexOf(" TO ");
      return {
        sourceLabel: t.slice(0, i).trim(),
        targetLabel: t.slice(i + 4).trim(),
      };
    }
    const arrowParts = t.split(/\s*→\s*/);
    if (arrowParts.length >= 2) {
      return {
        sourceLabel: arrowParts[0]?.trim() || "File",
        targetLabel: arrowParts.slice(1).join(" → ").trim(),
      };
    }
    return { sourceLabel: t, targetLabel: "Output" };
  }, [tool?.title]);
  const isPdfMergeTool = tool?.slug === "pdf-merge";
  const isPdfToImageTool = tool?.slug === "pdf-to-image";
  const isPdfCompressTool = tool?.slug === "pdf-compressor";
  const isUrlToPdfTool = tool?.slug === "url-to-pdf";
  const isHtmlCodeToPdfTool =
    tool?.slug === "html-code-to-pdf" ||
    tool?.slug === "HTML code to PDF" ||
    tool?.slug === "html-to-pdf";
  const isHtmlFileToPdfTool = tool?.slug === "html-file-to-pdf";
  const isHtmlVariableToPdfTool = tool?.slug === "html-variable-to-pdf";
  const isDocxToPdfTool = tool?.slug === "docx-to-pdf";
  const isImagesToPdfTool = tool?.slug === "images-to-pdf";
  const wkhtmlVariant = useMemo(() => wkhtmlSlugToVariant(tool?.slug), [tool?.slug]);
  const isAnyWkhtmlTool = wkhtmlVariant != null;
  const htmlOfficeTarget = useMemo(
    () => htmlOfficeSlugToTarget(tool?.slug),
    [tool?.slug],
  );
  const isAnyHtmlOfficeTool = htmlOfficeTarget != null;
  const pdfUrlSecurityMode = useMemo(
    () => pdfUrlSecuritySlugToMode(tool?.slug),
    [tool?.slug],
  );
  const isPdfUrlSecurityTool = pdfUrlSecurityMode != null;
  const isUnlockPdfTool = tool?.slug === "unlock-pdf";
  const isPdfToDocxTool = tool?.slug === "pdf-to-docx";
  const isExcelToPdfTool = tool?.slug === "excel-to-pdf";
  const isLockExcelTool = tool?.slug === "lock-excel";
  const isUnlockExcelTool = tool?.slug === "unlock-excel";
  const isPdfToHtmlTool = tool?.slug === "pdf-to-html";
  const isTextToQrTool = tool?.slug === "text-to-qr";
  const isTextToBarcodeTool = tool?.slug === "text-to-barcode";
  const isScanQrUploadTool = tool?.slug === "scan-qr-barcode-upload";
  const isScanQrUrlTool = tool?.slug === "scan-qr-barcode-url";
  const isScanQrBarcodeTool = isScanQrUploadTool || isScanQrUrlTool;
  const isTemplateFillToPdfTool = tool?.slug === "template-fill-to-pdf";
  const workspaceVariant = useMemo(
    () => getWorkspaceVariant(tool?.slug),
    [tool?.slug],
  );
  const convertButtonLabel = useMemo(() => {
    if (!tool) return "Convert";
    if (tool.title.includes(" TO ") || tool.title.includes("→")) {
      return `Convert to ${targetLabel}`;
    }
    return tool.title;
  }, [targetLabel, tool]);

  const convertDisabled = useMemo(() => {
    if (!tool) return true;
    if (isPdfMergeTool) {
      return files.length < 2 || !mergePdfCanConvert || urlToPdfLoading;
    }
    if (isPdfToImageTool) {
      return !pdfToImageCanConvert || urlToPdfLoading;
    }
    if (isPdfCompressTool) {
      return !pdfCompressCanConvert || urlToPdfLoading;
    }
    if (isUrlToPdfTool || isHtmlCodeToPdfTool) {
      return !urlToPdfSource.trim() || urlToPdfLoading;
    }
    if (isHtmlFileToPdfTool) {
      return files.length === 0 || urlToPdfLoading;
    }
    if (isHtmlVariableToPdfTool) {
      return urlToPdfLoading;
    }
    if (isDocxToPdfTool) {
      return files.length === 0 || urlToPdfLoading;
    }
    if (isImagesToPdfTool) {
      return files.length === 0 || urlToPdfLoading;
    }
    if (isAnyWkhtmlTool) {
      return !wkhtmlCanConvert || urlToPdfLoading;
    }
    if (isAnyHtmlOfficeTool) {
      return !htmlOfficeCanConvert || urlToPdfLoading;
    }
    if (isPdfUrlSecurityTool) {
      return !pdfUrlSecurityCanConvert || urlToPdfLoading;
    }
    if (isPdfToDocxTool) {
      return !pdfToDocxCanConvert || urlToPdfLoading;
    }
    if (isExcelToPdfTool) {
      return !excelToPdfCanConvert || urlToPdfLoading;
    }
    if (isLockExcelTool) {
      return !lockExcelCanConvert || urlToPdfLoading;
    }
    if (isUnlockExcelTool) {
      return !unlockExcelCanConvert || urlToPdfLoading;
    }
    if (isPdfToHtmlTool) {
      return !pdfToHtmlCanConvert || urlToPdfLoading;
    }
    if (isTextToQrTool) {
      return !textToQrCanConvert || urlToPdfLoading;
    }
    if (isTextToBarcodeTool) {
      return !textToBarcodeCanConvert || urlToPdfLoading;
    }
    if (isScanQrBarcodeTool) {
      return !scanQrBarcodeCanConvert || urlToPdfLoading;
    }
    if (isTemplateFillToPdfTool) {
      return urlToPdfLoading;
    }
    return !files.length;
  }, [
    tool,
    isPdfMergeTool,
    mergePdfCanConvert,
    isPdfToImageTool,
    pdfToImageCanConvert,
    isPdfCompressTool,
    pdfCompressCanConvert,
    isUrlToPdfTool,
    isHtmlCodeToPdfTool,
    isHtmlFileToPdfTool,
    isHtmlVariableToPdfTool,
    isDocxToPdfTool,
    isImagesToPdfTool,
    isAnyWkhtmlTool,
    wkhtmlCanConvert,
    isAnyHtmlOfficeTool,
    htmlOfficeCanConvert,
    isPdfUrlSecurityTool,
    pdfUrlSecurityCanConvert,
    isPdfToDocxTool,
    pdfToDocxCanConvert,
    isExcelToPdfTool,
    excelToPdfCanConvert,
    isLockExcelTool,
    lockExcelCanConvert,
    isUnlockExcelTool,
    unlockExcelCanConvert,
    isPdfToHtmlTool,
    pdfToHtmlCanConvert,
    isTextToQrTool,
    textToQrCanConvert,
    isTextToBarcodeTool,
    textToBarcodeCanConvert,
    isScanQrBarcodeTool,
    scanQrBarcodeCanConvert,
    isTemplateFillToPdfTool,
    files.length,
    urlToPdfSource,
    urlToPdfLoading,
  ]);

  const handleUrlToPdfConvert = useCallback(async () => {
    if (
      !tool ||
      (!isUrlToPdfTool &&
        !isHtmlCodeToPdfTool &&
        !isHtmlFileToPdfTool &&
        !isHtmlVariableToPdfTool &&
        !isDocxToPdfTool &&
        !isTemplateFillToPdfTool)
    ) {
      return;
    }
    setUrlToPdfDownloadComplete(false);
    const handle = urlToPdfRef.current;
    const variableHandle = htmlVariableToPdfRef.current;
    const docxHandle = docxToPdfRef.current;
    let payloadBody: Record<string, unknown> | null = null;
    if (isHtmlVariableToPdfTool) {
      if (!variableHandle) {
        showToast("Form is not ready.", "error");
        return;
      }
    } else if (isDocxToPdfTool) {
      if (!docxHandle) {
        showToast("Form is not ready.", "error");
        return;
      }
    } else if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }

    if (isHtmlFileToPdfTool) {
      const selected = files[0];
      if (!selected) {
        showToast("Select an HTML file to convert.", "info");
        return;
      }
      const htmlText = (await selected.text()).trim();
      if (!htmlText) {
        showToast("Selected HTML file is empty.", "error");
        return;
      }
      payloadBody = { html: htmlText };
    } else if (!isDocxToPdfTool) {
      const rawSource = handle!.getSourceValue().trim();
      if (!rawSource) {
        showToast(
          isHtmlCodeToPdfTool ? "Enter HTML code to convert." : "Enter a URL to convert.",
          "info",
        );
        return;
      }
    }

    let downloadFileName =
      (isHtmlVariableToPdfTool
        ? variableHandle!.getOutputFileName()
        : isDocxToPdfTool
          ? docxHandle!.getOutputFileName()
        : handle!.getOutputFileName()
      ).trim() || "url-convert.pdf";
    if (!downloadFileName.toLowerCase().endsWith(".pdf")) {
      downloadFileName = `${downloadFileName}.pdf`;
    }
    try {
      const { queryType, body } = isHtmlVariableToPdfTool
        ? variableHandle!.getPayload()
        : isDocxToPdfTool
          ? docxHandle!.getPayload()
        : handle!.getPayload();
      const requestBody =
        payloadBody ??
        (body as Record<string, unknown>);

      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body: requestBody,
          downloadFileName,
          sourceType: isHtmlFileToPdfTool
            ? "html-file"
            : isHtmlVariableToPdfTool
              ? "html-variable"
            : isDocxToPdfTool
              ? "docx-file"
            : isHtmlCodeToPdfTool
              ? "html"
              : "url",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast("PDF download started.", "success");
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [
    dispatch,
    files,
    isHtmlCodeToPdfTool,
    isHtmlFileToPdfTool,
    isHtmlVariableToPdfTool,
    isDocxToPdfTool,
    isTemplateFillToPdfTool,
    isUrlToPdfTool,
    showToast,
    tool,
  ]);

  const handleImagesToPdfConvert = useCallback(async () => {
    if (!tool || !isImagesToPdfTool) return;
    const handle = imagesToPdfRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files.length) {
      showToast("Select at least one image.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    const { queryType, body } = handle.getPayload(files);
    const downloadFileName = handle.getOutputFileName().trim() || "photos";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "images-pdf",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "PDF download started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isImagesToPdfTool, showToast, tool]);

  const handleMergePdfConvert = useCallback(async () => {
    if (!tool || !isPdfMergeTool) return;
    const handle = mergePdfRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (files.length < 2) {
      showToast("Select at least two PDF files.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    const { queryType, body } = handle.getPayload(files);
    const downloadFileName = handle.getOutputFileName().trim() || "merged";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "merge-pdf",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "PDF download started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isPdfMergeTool, showToast, tool]);

  const handlePdfToImageConvert = useCallback(async () => {
    if (!tool || !isPdfToImageTool) return;
    const handle = pdfToImageRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select a PDF file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let queryType: "d" | "p";
    let body: FormData;
    try {
      ({ queryType, body } = handle.getPayload(files));
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const downloadFileName = handle.getOutputFileName().trim() || "export";
    const responseBodyFixedExt = handle.getOutputImageExt();
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "pdf-to-image",
          responseBodyFixedExt,
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your file download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isPdfToImageTool, showToast, tool]);

  const bumpWkhtmlFields = useCallback(() => {
    setWkhtmlFieldsEpoch((n) => n + 1);
  }, []);

  const bumpHtmlOfficeFields = useCallback(() => {
    setHtmlOfficeFieldsEpoch((n) => n + 1);
  }, []);

  const handleHtmlOfficeConvert = useCallback(async () => {
    if (!tool || !htmlOfficeTarget) return;
    const handle = htmlToOfficeRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select an HTML file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    const body = handle.getPayload(files);
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "output";
    const sourceType =
      htmlOfficeTarget === "word" ? "html-to-word" : "html-to-excel";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType,
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your file download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, htmlOfficeTarget, showToast, tool]);

  const handlePdfToDocxConvert = useCallback(async () => {
    if (!tool || !isPdfToDocxTool) return;
    const handle = pdfToDocxRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select a PDF file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "document";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "pdf-to-docx",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your Word document download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isPdfToDocxTool, showToast, tool]);

  const handlePdfCompressConvert = useCallback(async () => {
    if (!tool || !isPdfCompressTool) return;
    const handle = pdfCompressRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select a PDF file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "smaller";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "pdf-compress",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your compressed PDF download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isPdfCompressTool, showToast, tool]);

  const handleExcelToPdfConvert = useCallback(async () => {
    if (!tool || !isExcelToPdfTool) return;
    const handle = excelToPdfRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select an Excel file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "report";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "excel-to-pdf",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your PDF download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isExcelToPdfTool, showToast, tool]);

  const handleLockExcelConvert = useCallback(async () => {
    if (!tool || !isLockExcelTool) return;
    const handle = lockExcelRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select an Excel file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "locked";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "lock-excel",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your locked workbook download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isLockExcelTool, showToast, tool]);

  const handleUnlockExcelConvert = useCallback(async () => {
    if (!tool || !isUnlockExcelTool) return;
    const handle = unlockExcelRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select an Excel file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "unlocked";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "unlock-excel",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your unlocked workbook download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isUnlockExcelTool, showToast, tool]);

  const handlePdfToHtmlConvert = useCallback(async () => {
    if (!tool || !isPdfToHtmlTool) return;
    const handle = pdfToHtmlRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (!files[0]) {
      showToast("Select a PDF file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "pages";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "pdf-to-html",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your HTML export download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, isPdfToHtmlTool, showToast, tool]);

  const handleTextToQrConvert = useCallback(async () => {
    if (!tool || !isTextToQrTool) return;
    const handle = textToQrRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "qr-out";
    const responseBodyFixedExt = handle.getOutputImageExt();
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "text-to-qr",
          responseBodyFixedExt,
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your QR export download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, isTextToQrTool, showToast, tool]);

  const handleTextToBarcodeConvert = useCallback(async () => {
    if (!tool || !isTextToBarcodeTool) return;
    const handle = textToBarcodeRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData;
    try {
      body = handle.getPayload();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "barcode";
    const responseBodyFixedExt = handle.getOutputImageExt();
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: "text-to-barcode",
          responseBodyFixedExt,
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your barcode export download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, isTextToBarcodeTool, showToast, tool]);

  const handleScanQrBarcodeConvert = useCallback(async () => {
    if (!tool || !isScanQrBarcodeTool) return;
    const handle = scanQrBarcodeRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (isScanQrUploadTool && !files[0]) {
      showToast("Select an image file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData | Record<string, string>;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Could not build the request.", "error");
      return;
    }
    const queryType = handle.getIsPreview() ? "d" : "p";
    const downloadFileName = handle.getOutputFileName().trim() || "scan-result";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType: isScanQrUploadTool
            ? "scan-qr-barcode-upload"
            : "scan-qr-barcode-url",
          responseBodyFixedExt: ".json",
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "Your scan result download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [
    dispatch,
    files,
    isScanQrBarcodeTool,
    isScanQrUploadTool,
    showToast,
    tool,
  ]);

  const bumpPdfUrlSecurityFields = useCallback(() => {
    setPdfUrlSecurityFieldsEpoch((n) => n + 1);
  }, []);

  const bumpMergePdfFields = useCallback(() => {
    setMergePdfFieldsEpoch((n) => n + 1);
  }, []);

  const bumpPdfToImageFields = useCallback(() => {
    setPdfToImageFieldsEpoch((n) => n + 1);
  }, []);

  const bumpPdfToDocxFields = useCallback(() => {
    setPdfToDocxFieldsEpoch((n) => n + 1);
  }, []);
  const bumpPdfCompressFields = useCallback(() => {
    setPdfCompressFieldsEpoch((n) => n + 1);
  }, []);

  const bumpExcelToPdfFields = useCallback(() => {
    setExcelToPdfFieldsEpoch((n) => n + 1);
  }, []);

  const bumpLockExcelFields = useCallback(() => {
    setLockExcelFieldsEpoch((n) => n + 1);
  }, []);

  const bumpUnlockExcelFields = useCallback(() => {
    setUnlockExcelFieldsEpoch((n) => n + 1);
  }, []);

  const bumpPdfToHtmlFields = useCallback(() => {
    setPdfToHtmlFieldsEpoch((n) => n + 1);
  }, []);

  const bumpTextToQrFields = useCallback(() => {
    setTextToQrFieldsEpoch((n) => n + 1);
  }, []);

  const bumpTextToBarcodeFields = useCallback(() => {
    setTextToBarcodeFieldsEpoch((n) => n + 1);
  }, []);

  const bumpScanQrBarcodeFields = useCallback(() => {
    setScanQrBarcodeFieldsEpoch((n) => n + 1);
  }, []);

  const handlePdfUrlSecurityConvert = useCallback(async () => {
    if (!tool || !pdfUrlSecurityMode) return;
    const handle = pdfUrlSecurityRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (pdfUrlSecurityMode === "unlock" && !files[0]) {
      showToast("Select a PDF file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    let body: FormData | Record<string, string>;
    try {
      body = handle.getPayload(files);
    } catch (e: unknown) {
      showToast(
        e instanceof Error ? e.message : "Could not build the request.",
        "error",
      );
      return;
    }
    const downloadFileName =
      handle.getOutputFileName().trim() ||
      (pdfUrlSecurityMode === "unlock" ? "unlocked" : "locked");
    const sourceType =
      pdfUrlSecurityMode === "unlock" ? "pdf-unlock-upload" : "pdf-lock-url";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType: "p",
          body,
          downloadFileName,
          sourceType,
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        pdfUrlSecurityMode === "unlock"
          ? "Your unlocked PDF download has started."
          : "Your locked PDF download has started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [dispatch, files, pdfUrlSecurityMode, showToast, tool]);

  const handleWkhtmlToPdfConvert = useCallback(async () => {
    if (!tool || !isAnyWkhtmlTool || !wkhtmlVariant) return;
    const handle = wkhtmlToPdfRef.current;
    if (!handle) {
      showToast("Form is not ready.", "error");
      return;
    }
    if (wkhtmlVariant === "html-file" && !files[0]) {
      showToast("Select an HTML file.", "info");
      return;
    }
    setUrlToPdfDownloadComplete(false);
    const { queryType, body } = handle.getPayload(files);
    const downloadFileName = handle.getOutputFileName().trim() || "export";
    const sourceType =
      wkhtmlVariant === "url"
        ? "wkhtml-url"
        : wkhtmlVariant === "html-code"
          ? "wkhtml-html-code"
          : "wkhtml-html-file";
    try {
      const result = await dispatch(
        convertUrlToPdf({
          queryType,
          body,
          downloadFileName,
          sourceType,
        }),
      ).unwrap();

      const objectUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.downloadFileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      showToast(
        queryType === "d"
          ? "Preview download started."
          : "PDF download started.",
        "success",
      );
      setUrlToPdfDownloadComplete(true);
    } catch (e: unknown) {
      showToast(typeof e === "string" ? e : "Conversion failed.", "error");
    }
  }, [
    dispatch,
    files,
    isAnyWkhtmlTool,
    showToast,
    tool,
    wkhtmlVariant,
  ]);

  useEffect(() => {
    setUrlToPdfDownloadComplete(false);
  }, [
    files.length,
    isHtmlFileToPdfTool,
    isHtmlVariableToPdfTool,
    isImagesToPdfTool,
    isPdfMergeTool,
    isPdfToImageTool,
    isPdfCompressTool,
    isPdfToDocxTool,
    isExcelToPdfTool,
    isLockExcelTool,
    isUnlockExcelTool,
    isPdfToHtmlTool,
    isTextToQrTool,
    isTextToBarcodeTool,
    isScanQrBarcodeTool,
    isAnyWkhtmlTool,
    isAnyHtmlOfficeTool,
    isPdfUrlSecurityTool,
    slug,
    urlToPdfSource,
    wkhtmlFieldsEpoch,
    htmlOfficeFieldsEpoch,
    pdfUrlSecurityFieldsEpoch,
    mergePdfFieldsEpoch,
    pdfToImageFieldsEpoch,
    pdfCompressFieldsEpoch,
    pdfToDocxFieldsEpoch,
    excelToPdfFieldsEpoch,
    lockExcelFieldsEpoch,
    unlockExcelFieldsEpoch,
    pdfToHtmlFieldsEpoch,
    textToQrFieldsEpoch,
    textToBarcodeFieldsEpoch,
    scanQrBarcodeFieldsEpoch,
  ]);

  useEffect(() => {
    setWkhtmlCanConvert(false);
    setHtmlOfficeCanConvert(false);
    setPdfUrlSecurityCanConvert(false);
    setMergePdfCanConvert(true);
    setPdfToImageCanConvert(false);
    setPdfCompressCanConvert(false);
    setPdfToDocxCanConvert(false);
    setExcelToPdfCanConvert(false);
    setLockExcelCanConvert(false);
    setUnlockExcelCanConvert(false);
    setPdfToHtmlCanConvert(false);
    setTextToQrCanConvert(false);
    setTextToBarcodeCanConvert(false);
    setScanQrBarcodeCanConvert(false);
  }, [slug]);

  useEffect(() => {
    if (!files.length) {
      setActivePageIndex(0);
      return;
    }
    if (activePageIndex >= files.length) {
      setActivePageIndex(files.length - 1);
    }
  }, [activePageIndex, files.length]);

  const handlePickFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFilesSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files ? Array.from(event.target.files) : [];
      if (!selected.length) return;
      if (workspaceVariant === "resizer" || workspaceVariant === "compressor") {
        setFiles([selected[0]]);
      } else if (isHtmlFileToPdfTool || isDocxToPdfTool || isUnlockPdfTool) {
        setFiles([selected[0]]);
      } else if (isPdfCompressTool) {
        const pdf = selected.find(
          (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name),
        );
        if (!pdf) {
          showToast("Select a PDF file.", "info");
          event.target.value = "";
          return;
        }
        setFiles([pdf]);
      } else if (wkhtmlVariant === "html-file" || isAnyHtmlOfficeTool) {
        setFiles([selected[0]]);
      } else if (isImagesToPdfTool) {
        const imagesOnly = selected.filter(
          (f) =>
            f.type === "image/png" ||
            f.type === "image/jpeg" ||
            /\.(png|jpe?g)$/i.test(f.name),
        );
        if (!imagesOnly.length) {
          showToast("Only PNG and JPEG images are supported.", "info");
          event.target.value = "";
          return;
        }
        setFiles((prev) => [...prev, ...imagesOnly]);
      } else if (isPdfMergeTool) {
        const pdfsOnly = selected.filter(
          (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name),
        );
        if (!pdfsOnly.length) {
          showToast("Only PDF files are supported for merge.", "info");
          event.target.value = "";
          return;
        }
        setFiles((prev) => [...prev, ...pdfsOnly]);
      } else if (isPdfToImageTool || isPdfToDocxTool) {
        const pdf = selected.find(
          (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name),
        );
        if (!pdf) {
          showToast("Select a PDF file.", "info");
          event.target.value = "";
          return;
        }
        setFiles([pdf]);
      } else if (isExcelToPdfTool) {
        const workbook = selected.find(
          (f) =>
            f.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            f.type === "application/vnd.ms-excel" ||
            /\.xlsx?$/i.test(f.name),
        );
        if (!workbook) {
          showToast("Select an .xlsx or .xls file.", "info");
          event.target.value = "";
          return;
        }
        setFiles([workbook]);
      } else if (isLockExcelTool) {
        const workbook = selected.find(
          (f) =>
            f.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            f.type === "application/vnd.ms-excel" ||
            /\.xlsx?$/i.test(f.name),
        );
        if (!workbook) {
          showToast("Select an .xlsx or .xls file.", "info");
          event.target.value = "";
          return;
        }
        setFiles([workbook]);
      } else if (isUnlockExcelTool) {
        const workbook = selected.find(
          (f) =>
            f.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            f.type === "application/vnd.ms-excel" ||
            /\.xlsx?$/i.test(f.name),
        );
        if (!workbook) {
          showToast("Select an .xlsx or .xls file.", "info");
          event.target.value = "";
          return;
        }
        setFiles([workbook]);
      } else if (isPdfToHtmlTool) {
        const pdf = selected.find(
          (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name),
        );
        if (!pdf) {
          showToast("Select a PDF file.", "info");
          event.target.value = "";
          return;
        }
        setFiles([pdf]);
      } else if (isScanQrUploadTool) {
        const image = selected.find(
          (f) =>
            f.type.startsWith("image/") ||
            /\.(png|jpe?g|webp|gif|bmp|tiff?|svg)$/i.test(f.name),
        );
        if (!image) {
          showToast("Select an image file.", "info");
          event.target.value = "";
          return;
        }
        setFiles([image]);
      } else {
        setFiles((prev) => [...prev, ...selected]);
      }
      event.target.value = "";
    },
    [
      isDocxToPdfTool,
      isUnlockPdfTool,
      isPdfCompressTool,
      isAnyHtmlOfficeTool,
      isHtmlFileToPdfTool,
      isImagesToPdfTool,
      isPdfMergeTool,
      isPdfToImageTool,
      isPdfToDocxTool,
      isExcelToPdfTool,
      isLockExcelTool,
      isUnlockExcelTool,
      isPdfToHtmlTool,
      isScanQrUploadTool,
      showToast,
      wkhtmlVariant,
      workspaceVariant,
    ],
  );

  const handleRemoveFile = useCallback((indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 10, 170));
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 10, 60));
  }, []);
  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const htmlFileCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawMiniCanvasPlaceholder = useCallback((title: string) => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    ctx.fillStyle = "#1565c0";
    ctx.fillRect(0, 0, w, Math.max(10, Math.floor(h * 0.07)));
    ctx.fillStyle = "#111827";
    ctx.font = "700 12px Arial";
    ctx.fillText(title.slice(0, 18), 10, Math.max(18, Math.floor(h * 0.25)));
  }, []);

  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    // Keep stable dimensions so inspect always shows the same canvas size.
    canvas.width = 160;
    canvas.height = 220;

    if (!files.length) {
      drawMiniCanvasPlaceholder("No file");
      return;
    }

    if (workspaceVariant === "resizer" || workspaceVariant === "compressor") {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const ratio =
          workspaceVariant === "resizer" ? imageResizePercent / 100 : 1;
        const targetW = Math.max(1, Math.floor(img.width * ratio));
        const targetH = Math.max(1, Math.floor(img.height * ratio));

        // Fit into the sidebar preview box.
        const scale = Math.min(canvas.width / targetW, canvas.height / targetH);
        const drawW = Math.max(1, Math.floor(targetW * scale));
        const drawH = Math.max(1, Math.floor(targetH * scale));
        const dx = Math.floor((canvas.width - drawW) / 2);
        const dy = Math.floor((canvas.height - drawH) / 2);
        ctx.drawImage(img, dx, dy, drawW, drawH);

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
      };
      img.src = url;
      return () => URL.revokeObjectURL(url);
    }

    // For other converters show a placeholder mini-canvas.
    drawMiniCanvasPlaceholder(files[0]?.name ?? "File");
  }, [drawMiniCanvasPlaceholder, files, imageResizePercent, workspaceVariant]);

  useEffect(() => {
    if (
      !isHtmlFileToPdfTool &&
      wkhtmlVariant !== "html-file" &&
      !isAnyHtmlOfficeTool
    )
      return;
    const canvas = htmlFileCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Card-like page placeholder similar to FileTile preview.
    ctx.fillStyle = "#fafbff";
    ctx.strokeStyle = "#f0f0f5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(5, 6, w - 10, h - 12, 6);
    ctx.fill();
    ctx.stroke();

    // Simple "document" glyph.
    const pageX = Math.floor(w / 2) - 14;
    const pageY = Math.floor(h / 2) - 24;
    ctx.fillStyle = "#e8f1ff";
    ctx.strokeStyle = "#1565c0";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(pageX, pageY, 28, 36, 4);
    ctx.fill();
    ctx.stroke();

    // Folded corner.
    ctx.fillStyle = "#d7e7ff";
    ctx.beginPath();
    ctx.moveTo(pageX + 20, pageY);
    ctx.lineTo(pageX + 28, pageY + 8);
    ctx.lineTo(pageX + 20, pageY + 8);
    ctx.closePath();
    ctx.fill();

    // Text lines on document.
    ctx.strokeStyle = "#1565c0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pageX + 6, pageY + 16);
    ctx.lineTo(pageX + 22, pageY + 16);
    ctx.moveTo(pageX + 6, pageY + 22);
    ctx.lineTo(pageX + 22, pageY + 22);
    ctx.moveTo(pageX + 6, pageY + 28);
    ctx.lineTo(pageX + 18, pageY + 28);
    ctx.stroke();
  }, [files, isAnyHtmlOfficeTool, isHtmlFileToPdfTool, wkhtmlVariant]);

  const urlToPdfSuccessTitle =
    tool?.title
      ?.replace(/\s*→\s*/g, " to ")
      .replace(/\s+TO\s+/gi, " to ") ?? "URL to PDF";

  const renderWorkspace = useCallback(() => {
    if (isUrlToPdfTool || isHtmlCodeToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (!urlToPdfDownloadComplete) return null;
      return (
        <UrlToPdfDownloadSuccess
          title={urlToPdfSuccessTitle}
          subtitle="Your PDF download has started. Check your downloads folder."
        />
      );
    }
    if (isHtmlFileToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your PDF download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            minHeight: 320,
            display: "grid",
            placeItems: "center",
          }}
        >
          <EmptyWorkspaceState
            sourceLabel="html file"
            onPickFiles={handlePickFiles}
            selectedFileName={files[0]?.name}
            previewCanvasRef={htmlFileCanvasRef}
            onRemoveSelectedFile={
              files.length ? () => handleRemoveFile(0) : undefined
            }
          />
        </Box>
      );
    }
    if (isHtmlVariableToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (!urlToPdfDownloadComplete) return null;
      return (
        <UrlToPdfDownloadSuccess
          title={urlToPdfSuccessTitle}
          subtitle="Your PDF download has started. Check your downloads folder."
        />
      );
    }
    if (isDocxToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your PDF download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box sx={{ width: "100%", display: "grid", placeItems: "center", minHeight: 320 }}>
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "document.docx"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState sourceLabel="docx / doc" onPickFiles={handlePickFiles} />
          )}
        </Box>
      );
    }
    if (isPdfMergeTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box sx={{ width: "100%", gap: 2 }}>
          <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}>
            {files.length ? (
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                {files.map((file, idx) => (
                  <FileTile
                    key={`${file.name}-${idx}`}
                    name={file.name}
                    onRemove={() => handleRemoveFile(idx)}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyWorkspaceState
                sourceLabel="pdf files"
                onPickFiles={handlePickFiles}
              />
            )}
          </Box>
        </Box>
      );
    }
    if (isPdfToImageTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            minHeight: 320,
          }}
        >
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "document.pdf"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState
              sourceLabel="pdf file"
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      );
    }
    if (isPdfCompressTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your compressed PDF download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            minHeight: 320,
          }}
        >
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "document.pdf"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState sourceLabel="pdf file" onPickFiles={handlePickFiles} />
          )}
        </Box>
      );
    }
    if (isPdfToDocxTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your Word document download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            minHeight: 320,
          }}
        >
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "document.pdf"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState
              sourceLabel="pdf file"
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      );
    }
    if (isExcelToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your PDF download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            minHeight: 320,
          }}
        >
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "workbook.xlsx"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState
              sourceLabel="excel file (.xlsx / .xls)"
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      );
    }
    if (isLockExcelTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your locked workbook download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            minHeight: 320,
          }}
        >
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "workbook.xlsx"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState
              sourceLabel="excel file (.xlsx / .xls)"
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      );
    }
    if (isUnlockExcelTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your unlocked workbook download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            minHeight: 320,
          }}
        >
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "workbook.xlsx"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState
              sourceLabel="excel file (.xlsx / .xls)"
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      );
    }
    if (isPdfToHtmlTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your HTML export download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            minHeight: 320,
          }}
        >
          {files.length ? (
            <FileTile
              name={files[0]?.name ?? "document.pdf"}
              onRemove={() => setFiles([])}
            />
          ) : (
            <EmptyWorkspaceState
              sourceLabel="pdf file"
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      );
    }
    if (isTextToQrTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your QR export download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            minHeight: 320,
            display: "grid",
            placeItems: "center",
            px: 3,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 420, lineHeight: 1.6 }}
          >
            Configure QR content and design in the left panel, then run export.
          </Typography>
        </Box>
      );
    }
    if (isTextToBarcodeTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your barcode export download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            minHeight: 320,
            display: "grid",
            placeItems: "center",
            px: 3,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 420, lineHeight: 1.6 }}
          >
            Configure barcode options in the left panel, then export.
          </Typography>
        </Box>
      );
    }
    if (isScanQrBarcodeTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your scan result download has started. Check your downloads folder."
          />
        );
      }
      if (isScanQrUploadTool) {
        return (
          <Box
            sx={{
              width: "100%",
              display: "grid",
              placeItems: "center",
              minHeight: 320,
            }}
          >
            {files.length ? (
              <FileTile
                name={files[0]?.name ?? "image.png"}
                onRemove={() => setFiles([])}
              />
            ) : (
              <EmptyWorkspaceState sourceLabel="image file" onPickFiles={handlePickFiles} />
            )}
          </Box>
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            minHeight: 320,
            display: "grid",
            placeItems: "center",
            px: 3,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 420, lineHeight: 1.6 }}
          >
            Paste an image URL in the left panel to scan QR/barcode.
          </Typography>
        </Box>
      );
    }
    if (isImagesToPdfTool) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your download has started. Check your downloads folder."
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            gap: 2,
          }}
        >
          <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}>
            {files.length ? (
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                {files.map((file, idx) => (
                  <FileTile
                    key={`${file.name}-${idx}`}
                    name={file.name}
                    onRemove={() => handleRemoveFile(idx)}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyWorkspaceState
                sourceLabel="png / jpeg images"
                onPickFiles={handlePickFiles}
              />
            )}
          </Box>
        </Box>
      );
    }
    if (isPdfUrlSecurityTool && pdfUrlSecurityMode) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel}…`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle={
              pdfUrlSecurityMode === "unlock"
                ? "Your unlocked PDF download has started. Check your downloads folder."
                : "Your locked PDF download has started. Check your downloads folder."
            }
          />
        );
      }
      if (pdfUrlSecurityMode === "unlock") {
        return (
          <Box
            sx={{
              width: "100%",
              display: "grid",
              placeItems: "center",
              minHeight: 320,
            }}
          >
            {files.length ? (
              <FileTile
                name={files[0]?.name ?? "document.pdf"}
                onRemove={() => setFiles([])}
              />
            ) : (
              <EmptyWorkspaceState
                sourceLabel="pdf file"
                onPickFiles={handlePickFiles}
              />
            )}
          </Box>
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            minHeight: 320,
            display: "grid",
            placeItems: "center",
            px: 3,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 420, lineHeight: 1.6 }}
          >
            All settings are on the left. This workspace stays empty for Lock PDF
            (URL only).
          </Typography>
        </Box>
      );
    }
    if (isAnyHtmlOfficeTool && htmlOfficeTarget) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle={
              htmlOfficeTarget === "word"
                ? "Your Word document download has started. Check your downloads folder."
                : "Your Excel workbook download has started. Check your downloads folder."
            }
          />
        );
      }
      return (
        <Box
          sx={{
            width: "100%",
            minHeight: 320,
            display: "grid",
            placeItems: "center",
          }}
        >
          <EmptyWorkspaceState
            sourceLabel="html file"
            onPickFiles={handlePickFiles}
            selectedFileName={files[0]?.name}
            previewCanvasRef={htmlFileCanvasRef}
            onRemoveSelectedFile={
              files.length ? () => handleRemoveFile(0) : undefined
            }
          />
        </Box>
      );
    }
    if (isAnyWkhtmlTool && wkhtmlVariant) {
      if (urlToPdfLoading) {
        return (
          <ConverterLoadingWorkspace
            title={`Converting ${sourceLabel} to ${targetLabel}...`}
            subtitle="Please wait, don't close your browser."
          />
        );
      }
      if (urlToPdfDownloadComplete) {
        return (
          <UrlToPdfDownloadSuccess
            title={urlToPdfSuccessTitle}
            subtitle="Your PDF download has started. Check your downloads folder."
          />
        );
      }
      if (wkhtmlVariant === "html-file") {
        return (
          <Box
            sx={{
              width: "100%",
              minHeight: 320,
              display: "grid",
              placeItems: "center",
            }}
          >
            <EmptyWorkspaceState
              sourceLabel="html file"
              onPickFiles={handlePickFiles}
              selectedFileName={files[0]?.name}
              previewCanvasRef={htmlFileCanvasRef}
              onRemoveSelectedFile={
                files.length ? () => handleRemoveFile(0) : undefined
              }
            />
          </Box>
        );
      }
      return null;
    }
    if (isTemplateFillToPdfTool) return null;
    // if (workspaceVariant === "pdf-canvas") {
    //   return (
    //     <>
    //       <PdfCanvasWorkspace
    //         files={files}
    //         activePageIndex={activePageIndex}
    //         zoomLevel={zoomLevel}
    //         rotation={rotation}
    //         onPickFiles={handlePickFiles}
    //         onRemoveFile={handleRemoveFile}
    //       />

    //     </>
    //   );
    // }
    // if (workspaceVariant === "resizer" || workspaceVariant === "compressor") {
    //   return (
    //     <Box
    //       sx={{
    //         width: "100%",
    //         gap: 2,
    //       }}
    //     >
    //       <ImagePreviewCanvas
    //         mode={workspaceVariant}
    //         files={files}
    //         onPickFiles={handlePickFiles}
    //         resizePercent={imageResizePercent}
    //       />
    //     </Box>
    //   );
    // }

    return (
      <Box
        sx={{
          width: "100%",

          gap: 2,
        }}
      >
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}>
          {files.length ? (
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              {files.map((file, idx) => (
                <FileTile
                  key={`${file.name}-${idx}`}
                  name={file.name}
                  onRemove={() => handleRemoveFile(idx)}
                />
              ))}
            </Stack>
          ) : (
            <EmptyWorkspaceState
              sourceLabel={sourceLabel.toLowerCase()}
              onPickFiles={handlePickFiles}
            />
          )}
        </Box>
      </Box>
    );
  }, [
    isUrlToPdfTool,
    isHtmlCodeToPdfTool,
    isHtmlFileToPdfTool,
    isHtmlVariableToPdfTool,
    isDocxToPdfTool,
    isPdfMergeTool,
    isPdfToImageTool,
    isPdfCompressTool,
    isPdfToDocxTool,
    isExcelToPdfTool,
    isLockExcelTool,
    isUnlockExcelTool,
    isPdfToHtmlTool,
    isTextToQrTool,
    isTextToBarcodeTool,
    isScanQrBarcodeTool,
    isScanQrUploadTool,
    isImagesToPdfTool,
    isPdfUrlSecurityTool,
    pdfUrlSecurityMode,
    isAnyHtmlOfficeTool,
    htmlOfficeTarget,
    isAnyWkhtmlTool,
    wkhtmlVariant,
    isTemplateFillToPdfTool,
    urlToPdfLoading,
    urlToPdfDownloadComplete,
    urlToPdfSuccessTitle,
    sourceLabel,
    targetLabel,
    workspaceVariant,
    files,
    handlePickFiles,
    handleRemoveFile,
  ]);

  return (
    <Box sx={{}}>
      {tool ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            minHeight: { xs: "auto", md: "calc(100vh - 120px)" },
            border: "1px solid #ececf2",
            borderRadius: 1,
            overflow: "visible",
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: { xs: 220, md: "calc(100vh - 120px)" },
              borderRight: "1px solid #ececf2",
              position: "relative",
              zIndex: 2,
              overflow: "visible",
            }}
          >
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                color: "#2f2f33",
                borderBottom: "1px solid #ececf2",
                px: { xs: 2, md: 3 },
                pb: { xs: 2, md: 3 },
                pt: { xs: 3, md: 4 },
              }}
            >
              {tool.title
                .replace(/\s*→\s*/g, " to ")
                .replace(/\s+TO\s+/gi, " to ")}
            </Typography>

            <Box
              sx={{
                px: { xs: 0.5, md: 1 },
                py: 2,
                flex: 1,
              }}
            >
              <WorkspaceSidebar
                toolSlug={tool?.slug}
                urlToPdfRef={urlToPdfRef}
                htmlVariableToPdfRef={htmlVariableToPdfRef}
                docxToPdfRef={docxToPdfRef}
                imagesToPdf={
                  isImagesToPdfTool ? { ref: imagesToPdfRef } : undefined
                }
                mergePdf={
                  isPdfMergeTool
                    ? {
                        ref: mergePdfRef,
                        onValidityChange: setMergePdfCanConvert,
                        onFieldsDirty: bumpMergePdfFields,
                      }
                    : undefined
                }
                pdfToImage={
                  isPdfToImageTool
                    ? {
                        ref: pdfToImageRef,
                        onValidityChange: setPdfToImageCanConvert,
                        onFieldsDirty: bumpPdfToImageFields,
                      }
                    : undefined
                }
                pdfCompress={
                  isPdfCompressTool
                    ? {
                        ref: pdfCompressRef,
                        selectedFileName: files[0]?.name,
                        onValidityChange: setPdfCompressCanConvert,
                        onFieldsDirty: bumpPdfCompressFields,
                      }
                    : undefined
                }
                wkhtmlToPdf={
                  isAnyWkhtmlTool && wkhtmlVariant
                    ? {
                        ref: wkhtmlToPdfRef,
                        selectedFileName: files[0]?.name,
                        onRequestPickFile: handlePickFiles,
                        onValidityChange: setWkhtmlCanConvert,
                        onFieldsDirty: bumpWkhtmlFields,
                      }
                    : undefined
                }
                htmlToOffice={
                  isAnyHtmlOfficeTool && htmlOfficeTarget
                    ? {
                        ref: htmlToOfficeRef,
                        selectedFileName: files[0]?.name,
                        onRequestPickFile: handlePickFiles,
                        onValidityChange: setHtmlOfficeCanConvert,
                        onFieldsDirty: bumpHtmlOfficeFields,
                      }
                    : undefined
                }
                pdfUrlSecurity={
                  isPdfUrlSecurityTool
                    ? {
                        ref: pdfUrlSecurityRef,
                        onValidityChange: setPdfUrlSecurityCanConvert,
                        onFieldsDirty: bumpPdfUrlSecurityFields,
                        ...(pdfUrlSecurityMode === "unlock"
                          ? {
                              selectedFileName: files[0]?.name,
                              onRequestPickFile: handlePickFiles,
                            }
                          : {}),
                      }
                    : undefined
                }
                pdfToDocx={
                  isPdfToDocxTool
                    ? {
                        ref: pdfToDocxRef,
                        selectedFileName: files[0]?.name,
                        onValidityChange: setPdfToDocxCanConvert,
                        onFieldsDirty: bumpPdfToDocxFields,
                      }
                    : undefined
                }
                excelToPdf={
                  isExcelToPdfTool
                    ? {
                        ref: excelToPdfRef,
                        selectedFileName: files[0]?.name,
                        onValidityChange: setExcelToPdfCanConvert,
                        onFieldsDirty: bumpExcelToPdfFields,
                      }
                    : undefined
                }
                lockExcel={
                  isLockExcelTool
                    ? {
                        ref: lockExcelRef,
                        selectedFileName: files[0]?.name,
                        onValidityChange: setLockExcelCanConvert,
                        onFieldsDirty: bumpLockExcelFields,
                      }
                    : undefined
                }
                unlockExcel={
                  isUnlockExcelTool
                    ? {
                        ref: unlockExcelRef,
                        selectedFileName: files[0]?.name,
                        onValidityChange: setUnlockExcelCanConvert,
                        onFieldsDirty: bumpUnlockExcelFields,
                      }
                    : undefined
                }
                pdfToHtml={
                  isPdfToHtmlTool
                    ? {
                        ref: pdfToHtmlRef,
                        selectedFileName: files[0]?.name,
                        onValidityChange: setPdfToHtmlCanConvert,
                        onFieldsDirty: bumpPdfToHtmlFields,
                      }
                    : undefined
                }
                textToQr={
                  isTextToQrTool
                    ? {
                        ref: textToQrRef,
                        onValidityChange: setTextToQrCanConvert,
                        onFieldsDirty: bumpTextToQrFields,
                      }
                    : undefined
                }
                textToBarcode={
                  isTextToBarcodeTool
                    ? {
                        ref: textToBarcodeRef,
                        onValidityChange: setTextToBarcodeCanConvert,
                        onFieldsDirty: bumpTextToBarcodeFields,
                      }
                    : undefined
                }
                scanQrBarcode={
                  isScanQrBarcodeTool
                    ? {
                        ref: scanQrBarcodeRef,
                        mode: isScanQrUploadTool ? "upload" : "url",
                        selectedFileName: files[0]?.name,
                        onRequestPickFile: handlePickFiles,
                        onValidityChange: setScanQrBarcodeCanConvert,
                        onFieldsDirty: bumpScanQrBarcodeFields,
                      }
                    : undefined
                }
                onUrlToPdfSourceChange={setUrlToPdfSource}
                files={files}
                miniCanvasRef={miniCanvasRef}
                activePageIndex={activePageIndex}
                zoomLevel={zoomLevel}
                rotation={rotation}
                imageResizePercent={imageResizePercent}
                imageCompressionQuality={imageCompressionQuality}
                imageOutputFormat={imageOutputFormat}
                onZoomOut={handleZoomOut}
                onZoomIn={handleZoomIn}
                onRotate={handleRotate}
                onRemoveFile={handleRemoveFile}
                onImageResizePercentChange={setImageResizePercent}
                onImageCompressionQualityChange={setImageCompressionQuality}
                onImageOutputFormatChange={setImageOutputFormat}
              />
            </Box>

            <Box
              sx={{
                position: "relative",
                alignSelf: "stretch",
                mx: { xs: 2, md: 3 },
                mb: { xs: 2, md: 3 },
              }}
            >
              <Button
                variant="contained"
                disabled={convertDisabled}
                onClick={() => {
                  if (isImagesToPdfTool) {
                    void handleImagesToPdfConvert();
                  } else if (isPdfMergeTool) {
                    void handleMergePdfConvert();
                  } else if (isPdfToImageTool) {
                    void handlePdfToImageConvert();
                  } else if (isPdfCompressTool) {
                    void handlePdfCompressConvert();
                  } else if (isPdfToDocxTool) {
                    void handlePdfToDocxConvert();
                  } else if (isExcelToPdfTool) {
                    void handleExcelToPdfConvert();
                  } else if (isLockExcelTool) {
                    void handleLockExcelConvert();
                  } else if (isUnlockExcelTool) {
                    void handleUnlockExcelConvert();
                  } else if (isPdfToHtmlTool) {
                    void handlePdfToHtmlConvert();
                  } else if (isTextToQrTool) {
                    void handleTextToQrConvert();
                  } else if (isTextToBarcodeTool) {
                    void handleTextToBarcodeConvert();
                  } else if (isScanQrBarcodeTool) {
                    void handleScanQrBarcodeConvert();
                  } else if (isAnyHtmlOfficeTool) {
                    void handleHtmlOfficeConvert();
                  } else if (isPdfUrlSecurityTool) {
                    void handlePdfUrlSecurityConvert();
                  } else if (isAnyWkhtmlTool) {
                    void handleWkhtmlToPdfConvert();
                  } else if (
                    isUrlToPdfTool ||
                    isHtmlCodeToPdfTool ||
                    isHtmlFileToPdfTool ||
                    isHtmlVariableToPdfTool ||
                    isDocxToPdfTool ||
                    isTemplateFillToPdfTool
                  ) {
                    void handleUrlToPdfConvert();
                  }
                }}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  overflow: "hidden",
                  width: "100%",
                  height: 56,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 18,
                  fontWeight: 700,
                  bgcolor: colors.primary,
                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: "rgba(17,86,166,0.9)",
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "rgba(17,86,166,0.35)",
                    color: "#fff",
                    opacity: 0.55,
                  },
                  ...(isUrlToPdfTool && !urlToPdfLoading
                    ? {
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-45%",
                          width: "35%",
                          height: "100%",
                          background:
                            "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 100%)",
                          transform: "skewX(-20deg)",
                          pointerEvents: "none",
                          animation: "buttonShineSweep 2.8s ease-in-out infinite",
                        },
                        "@keyframes buttonShineSweep": {
                          "0%": { left: "-45%" },
                          "55%": { left: "125%" },
                          "100%": { left: "125%" },
                        },
                      }
                    : {}),
                }}
                endIcon={!urlToPdfLoading && <ArrowCircleRightOutlinedIcon />}
              >
                {urlToPdfLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  convertButtonLabel
                )}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: "#f4f4fa",
              position: "relative",
              p: { xs: 2, md: 3 },
              borderRight: { xs: "none", md: "1px solid #ececf2" },
              minHeight: { xs: 380, md: "calc(100vh - 120px)" },
            }}
          >
            <Box
              sx={{
                minHeight: { xs: 340, md: "calc(100vh - 200px)" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderWorkspace()}
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary">
          This converter was not found.{" "}
          <RouterLink to="/home/converter">Back to list</RouterLink>
        </Typography>
      )}

      <input
        ref={fileInputRef}
        hidden
        type="file"
        multiple={
          isImagesToPdfTool ||
          isPdfMergeTool ||
          (workspaceVariant !== "resizer" &&
            workspaceVariant !== "compressor" &&
            !isDocxToPdfTool &&
            !isHtmlFileToPdfTool &&
            wkhtmlVariant !== "html-file" &&
            !isAnyHtmlOfficeTool &&
            !isUnlockPdfTool &&
            !isPdfToImageTool &&
            !isPdfCompressTool &&
            !isPdfToDocxTool &&
            !isExcelToPdfTool &&
            !isLockExcelTool &&
            !isUnlockExcelTool &&
            !isPdfToHtmlTool &&
            !isTextToQrTool &&
            !isTextToBarcodeTool &&
            !isScanQrUploadTool)
        }
        accept={
          isPdfMergeTool ||
          isPdfToImageTool ||
          isPdfCompressTool ||
          isPdfToDocxTool ||
          isPdfToHtmlTool
            ? ".pdf,application/pdf"
            : isExcelToPdfTool || isLockExcelTool || isUnlockExcelTool
              ? ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            : isScanQrUploadTool
              ? "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/tiff,image/svg+xml,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.svg"
            : workspaceVariant === "pdf-canvas"
            ? ".pdf,application/pdf"
            : workspaceVariant === "resizer" ||
                workspaceVariant === "compressor"
              ? "image/png,image/jpeg,image/webp"
              : isHtmlFileToPdfTool
                ? ".html,.htm,text/html"
              : isDocxToPdfTool
                ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : isImagesToPdfTool
                ? "image/png,image/jpeg,.png,.jpg,.jpeg"
              : wkhtmlVariant === "html-file" || isAnyHtmlOfficeTool
                ? ".html,.htm,text/html"
              : isUnlockPdfTool
                ? ".pdf,application/pdf"
              : undefined
        }
        onChange={handleFilesSelected}
      />
    </Box>
  );
};

export default ConverterTool;

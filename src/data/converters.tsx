import HtmlOutlined from "@mui/icons-material/HtmlOutlined";
import HttpIcon from "@mui/icons-material/Http";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import QrCode2Outlined from "@mui/icons-material/QrCode2Outlined";

import TableChartOutlined from "@mui/icons-material/TableChartOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";

import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import CodeOutlined from "@mui/icons-material/CodeOutlined";
import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
import MergeType from "@mui/icons-material/MergeType";

import CompressOutlined from "@mui/icons-material/CompressOutlined";
import { PictureAsPdfOutlined } from "@mui/icons-material";


export const converters = [
  // ——— To PDF ———
   {
    slug: "url-to-pdf",
    title: "URL → PDF",
    description:
      "Easily convert URL files to high-quality PDFs with our tool. Preserve layouts, styles, and graphics while generating professional, easily shareable documents.",
    layout: "to-pdf",
    SourceIcon: HttpIcon,
    sourceColor: "#e65100",
  },
  {
    slug: "html-code-to-pdf",
    title: "HTML CODE → PDF",
    description:
      "Easily convert URL files to high-quality PDFs with our tool. Preserve layouts, styles, and graphics while generating professional, easily shareable documents.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#e65100",
  },
  {
    slug: "html-file-to-pdf",
    title: "HTML FILE → PDF",
    description:
      "Convert local HTML files to high-quality PDFs while preserving layout, styles, and graphics for professional sharing.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#e65100",
  },
  {
    slug: "html-variable-to-pdf",
    title: "HTML VARIABLE → PDF",
    description:
      "Generate PDF from HTML template placeholders using variables and tables JSON in one structured conversion flow.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#e65100",
  },
  {
    slug: "template-fill-to-pdf",
    title: "TEMPLATE FILL → PDF",
    description:
      "Fill DOCX template placeholders with variables and table rows, then generate a final PDF.",
    layout: "to-pdf",
    SourceIcon: ArticleOutlined,
    sourceColor: "#1565c0",
  },
 
  {
    slug: "docx-to-pdf",
    title: "DOCX → PDF",
    description:
      "Convert Word documents to PDF while preserving headings, tables, and formatting. Ideal for sharing finalized documents that look the same on any device.",
    layout: "to-pdf",
    SourceIcon: ArticleOutlined,
    sourceColor: "#1565c0",
  },
  {
    slug: "images-to-pdf",
    title: "Images → PDF",
    description:
      "Merge PNG or JPEG images into one PDF, or export a ZIP of separate PDFs. Set page size, margins, optional open password, and PDF rights.",
    layout: "to-pdf",
    SourceIcon: ImageOutlined,
    sourceColor: "#6366f1",
  },
  {
    slug: "pdf-merge",
    title: "Merge PDF",
    description:
      "Combine multiple PDFs in order—first file first in the output. Optional per-file passwords, a simple open password on the merged file, and full rights management.",
    layout: "to-pdf",
    SourceIcon: MergeType,
    sourceColor: "#b45309",
  },
  {
    slug: "wkhtmltopdf-by-url",
    title: "wkhtmltopdf by URL → PDF",
    description:
      "Render a public web page to PDF using wkhtmltopdf-style pipeline. Control fetch mode, optional password, and preview vs download.",
    layout: "to-pdf",
    SourceIcon: HttpIcon,
    sourceColor: "#7c3aed",
  },
  {
    slug: "wkhtmltopdf-by-html-code",
    title: "wkhtmltopdf by HTML code → PDF",
    description:
      "Convert raw HTML (and optional base URL for assets) into a PDF with wkhtmltopdf-style rendering.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#7c3aed",
  },
  {
    slug: "wkhtmltopdf-by-html-file",
    title: "wkhtmltopdf by HTML file → PDF",
    description:
      "Upload an HTML file from the workspace, set optional base URL for relative assets, then export to PDF.",
    layout: "to-pdf",
    SourceIcon: InsertDriveFileOutlined,
    sourceColor: "#7c3aed",
  },
  {
    slug: "html-to-word",
    title: "HTML → Word (doc)",
    description:
      "Upload HTML and generate a Word document (.docx) via LibreOffice—set an optional base file name and download or preview.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#2563eb",
    TargetIcon: DescriptionOutlined,
    targetColor: "#1565c0",
  },
  {
    slug: "html-to-excel",
    title: "HTML → Excel",
    description:
      "Upload HTML with tables and export to Excel (.xlsx). Optional base name and download or preview response.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#2e7d32",
    TargetIcon: TableChartOutlined,
    targetColor: "#217346",
  },
  {
    slug: "excel-to-pdf",
    title: "Excel → PDF",
    description:
      "Upload .xlsx or .xls and produce a PDF. Choose download or preview, and set an optional output file name.",
    layout: "to-pdf",
    SourceIcon: TableChartOutlined,
    sourceColor: "#217346",
   
  },
  {
    slug: "lock-excel",
    title: "Lock Excel",
    description:
      "Protect every worksheet with one sheet password. Choose preview or download and set an optional output file name.",
    layout: "to-pdf",
    SourceIcon: LockOutlined,
    sourceColor: "#14532d",
    TargetIcon: TableChartOutlined,
    targetColor: "#217346",
  },
  {
    slug: "unlock-excel",
    title: "Unlock Excel",
    description:
      "Remove worksheet protection from an Excel file using the current sheet password when needed, then download or preview.",
    layout: "to-pdf",
    SourceIcon: LockOpenOutlined,
    sourceColor: "#0d9488",
        TargetIcon: TableChartOutlined,
    targetColor: "#217346",
  },
  {
    slug: "lock-pdf",
    title: "Lock PDF",
    description:
      "Password-protect an existing PDF with AES-256 encryption. Enter the PDF URL, choose an open password, and an optional output file name.",
    layout: "to-pdf",
    SourceIcon: LockOutlined,
    sourceColor: "#5b21b6",

  },
  {
    slug: "unlock-pdf",
    title: "Unlock PDF",
    description:
      "Upload a PDF from the workspace and remove password protection when you know the unlock password (optional if the file is not encrypted). Set an optional output file name.",
    layout: "to-pdf",
    SourceIcon: LockOpenOutlined,
    sourceColor: "#0d9488",
  },
  {
    slug: "pdf-to-image",
    title: "PDF → JPG / PNG / WebP",
    description:
      "High-DPI raster export (default 300 DPI, up to 600). PNG and WebP use lossless settings when possible; JPEG uses high quality and minimal chroma subsampling so text stays sharp when zoomed.",
    layout: "to-image",
    SourceIcon: PictureAsPdfOutlined,
    sourceColor: "#d32f2f",
        TargetIcon: ImageOutlined,
    targetColor: "#2e7d32",
  },
  {
    slug: "pdf-compressor",
    title: "Compress PDF",
    description:
      "Rewrite PDF streams to reduce file size while preserving layout. Supports optional PDF password, custom output name, and download or preview response.",
    layout: "to-pdf",
    SourceIcon: CompressOutlined,
    sourceColor: "#7c3aed",
  },
  {
    slug: "pdf-to-docx",
    title: "PDF → DOCX",
    description:
      "Upload a PDF and convert it to an editable Word document (.docx). Optional open password, preview or download response, and a custom output name.",
    layout: "from-pdf",
    TargetIcon: DescriptionOutlined,
    targetColor: "#1565c0",
  },
  {
    slug: "pdf-to-html",
    title: "PDF → HTML",
    description:
      "Convert PDF pages to HTML output from an uploaded file. Optional PDF password, custom output name, and download or preview response.",
    layout: "from-pdf",
    TargetIcon: HtmlOutlined,
    targetColor: "#e65100",
  },
  {
    slug: "text-to-qr",
    title: "Text → QR code",
    description:
      "Build branded QR codes from raw text, URL, or contact payload with design/export controls and optional center icon.",
    layout: "to-pdf",
    SourceIcon: CodeOutlined,
    sourceColor: "#1d4ed8",
    TargetIcon: QrCode2Outlined,
    targetColor: "#1d4ed8",
  },
  {
    slug: "text-to-barcode",
    title: "Text → Barcode",
    description:
      "Generate linear barcodes (CODE128, CODE39, EAN, ITF, Codabar) with styling and export options.",
    layout: "to-pdf",
    SourceIcon: CodeOutlined,
    sourceColor: "#0f766e",
    TargetIcon: QrCode2Outlined,
    targetColor: "#0f766e",
  },
  {
    slug: "scan-qr-barcode-upload",
    title: "Scan QR / Barcode (Upload image)",
    description:
      "Upload an image file containing a QR code or barcode and export decoded scan results as JSON.",
    layout: "to-pdf",
    SourceIcon: ImageOutlined,
    sourceColor: "#0f766e",
    TargetIcon: QrCode2Outlined,
    targetColor: "#1d4ed8",
  },
  {
    slug: "scan-qr-barcode-url",
    title: "Image URL → QR / Barcode",
    description:
      "Paste an image URL containing a QR code or barcode and export decoded scan results as JSON.",
    layout: "to-pdf",
    SourceIcon: ImageOutlined,
    sourceColor: "#1d4ed8",
    TargetIcon: QrCode2Outlined,
    targetColor: "#1d4ed8",
  },
 
];

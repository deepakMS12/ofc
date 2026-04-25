import HtmlOutlined from "@mui/icons-material/HtmlOutlined";
import HttpIcon from '@mui/icons-material/Http';
// import ImageOutlined from "@mui/icons-material/ImageOutlined";
// import DataObjectOutlined from "@mui/icons-material/DataObjectOutlined";
// import PhotoOutlined from "@mui/icons-material/PhotoOutlined";
// import MicOutlined from "@mui/icons-material/MicOutlined";
// import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
// import TableChartOutlined from "@mui/icons-material/TableChartOutlined";
// import TextSnippetOutlined from "@mui/icons-material/TextSnippetOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
// import AudiotrackOutlined from "@mui/icons-material/AudiotrackOutlined";
// import GridOnOutlined from "@mui/icons-material/GridOnOutlined";
// import SlideshowOutlined from "@mui/icons-material/SlideshowOutlined";
// import MovieOutlined from "@mui/icons-material/MovieOutlined";
// import CropFreeOutlined from "@mui/icons-material/CropFreeOutlined";
// import CompressOutlined from "@mui/icons-material/CompressOutlined";
// import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
// import CodeOutlined from "@mui/icons-material/CodeOutlined";

export const converters = [
  // ——— To PDF ———
   {
    slug: "url-to-pdf",
    title: "URL TO PDF",
    description:
      "Easily convert URL files to high-quality PDFs with our tool. Preserve layouts, styles, and graphics while generating professional, easily shareable documents.",
    layout: "to-pdf",
    SourceIcon: HttpIcon,
    sourceColor: "#e65100",
  },
  {
    slug: "html-code-to-pdf",
    title: "HTML CODE TO PDF",
    description:
      "Easily convert URL files to high-quality PDFs with our tool. Preserve layouts, styles, and graphics while generating professional, easily shareable documents.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#e65100",
  },
  {
    slug: "html-file-to-pdf",
    title: "HTML FILE TO PDF",
    description:
      "Convert local HTML files to high-quality PDFs while preserving layout, styles, and graphics for professional sharing.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#e65100",
  },
  {
    slug: "html-variable-to-pdf",
    title: "HTML VARIABLE TO PDF",
    description:
      "Generate PDF from HTML template placeholders using variables and tables JSON in one structured conversion flow.",
    layout: "to-pdf",
    SourceIcon: HtmlOutlined,
    sourceColor: "#e65100",
  },
  {
    slug: "template-fill-to-pdf",
    title: "TEMPLATE FILL TO PDF",
    description:
      "Fill DOCX template placeholders with variables and table rows, then generate a final PDF.",
    layout: "to-pdf",
    SourceIcon: ArticleOutlined,
    sourceColor: "#1565c0",
  },
  // {
  //   slug: "html-to-pdf",
  //   type: "html-to-pdf",
  //   title: "HTML TO PDF",
  //   description:
  //     "Easily convert HTML files to high-quality PDFs with our tool. Preserve layouts, styles, and graphics while generating professional, easily shareable documents.",
  //   layout: "to-pdf",
  //   SourceIcon: HtmlOutlined,
  //   sourceColor: "#e65100",
  // },
  // {
  //   slug: "jpg-to-pdf",
  //   type: "jpg-to-pdf",
  //   title: "JPG TO PDF",
  //   description:
  //     "Quickly convert JPG images to PDF files with our tool. Maintain image quality and resolution while creating clean, professional PDFs for easy sharing and storage.",
  //   layout: "to-pdf",
  //   SourceIcon: ImageOutlined,
  //   sourceColor: "#2e7d32",
  // },
  // {
  //   slug: "json-to-pdf",
  //   type: "json-to-pdf",
  //   title: "JSON TO PDF",
  //   description:
  //     "Convert JSON data to neatly formatted PDFs effortlessly. Our tool ensures accurate representation of data in a clean, professional layout, ideal for reports and documentation.",
  //   layout: "to-pdf",
  //   SourceIcon: DataObjectOutlined,
  //   sourceColor: "#6a1b9a",
  // },
  // {
  //   slug: "png-to-pdf",
  //   type: "png-to-pdf",
  //   title: "PNG TO PDF",
  //   description:
  //     "Transform PNG images into high-quality PDFs with ease. Our converter preserves image clarity and color, creating professional and shareable documents quickly and efficiently.",
  //   layout: "to-pdf",
  //   SourceIcon: PhotoOutlined,
  //   sourceColor: "#1565c0",
  // },
  // {
  //   slug: "speech-to-pdf",
  //   type: "speech-to-pdf",
  //   title: "SPEECH TO PDF",
  //   description:
  //     "Convert speech transcripts to polished PDFs effortlessly. Our tool accurately formats spoken content into professional, readable documents, ideal for reports and presentations.",
  //   layout: "to-pdf",
  //   SourceIcon: MicOutlined,
  //   sourceColor: "#00838f",
  // },
  {
    slug: "docx-to-pdf",
    title: "DOCX TO PDF",
    description:
      "Convert Word documents to PDF while preserving headings, tables, and formatting. Ideal for sharing finalized documents that look the same on any device.",
    layout: "to-pdf",
    SourceIcon: ArticleOutlined,
    sourceColor: "#1565c0",
  },
  // {
  //   slug: "xlsx-to-pdf",
  //   type: "xlsx-to-pdf",
  //   title: "XLSX TO PDF",
  //   description:
  //     "Turn spreadsheets into print-ready PDFs. Keep grids, charts, and cell styles readable in a fixed layout suitable for archiving and distribution.",
  //   layout: "to-pdf",
  //   SourceIcon: TableChartOutlined,
  //   sourceColor: "#2e7d32",
  // },
  // {
  //   slug: "txt-to-pdf",
  //   type: "txt-to-pdf",
  //   title: "TXT TO PDF",
  //   description:
  //     "Convert plain text files into clean PDF pages with comfortable typography and margins—perfect for notes, logs, and lightweight documentation.",
  //   layout: "to-pdf",
  //   SourceIcon: TextSnippetOutlined,
  //   sourceColor: "#5d4037",
  // },
  // {
  //   slug: "md-to-pdf",
  //   type: "md-to-pdf",
  //   title: "MARKDOWN TO PDF",
  //   description:
  //     "Render Markdown to polished PDFs with structured headings and lists, ready for documentation, READMEs, and technical write-ups.",
  //   layout: "to-pdf",
  //   SourceIcon: DescriptionOutlined,
  //   sourceColor: "#37474f",
  // },
  // {
  //   slug: "audio-to-pdf",
  //   type: "audio-to-pdf",
  //   title: "AUDIO TO PDF",
  //   description:
  //     "Attach transcripts or metadata from audio workflows into a shareable PDF summary—useful for podcasts, meetings, and media pipelines.",
  //   layout: "to-pdf",
  //   SourceIcon: AudiotrackOutlined,
  //   sourceColor: "#c62828",
  // },
  // {
  //   slug: "csv-to-pdf",
  //   type: "csv-to-pdf",
  //   title: "CSV TO PDF",
  //   description:
  //     "Convert CSV tables into readable PDF reports with aligned columns and headers—great for sharing data without exposing raw spreadsheets.",
  //   layout: "to-pdf",
  //   SourceIcon: GridOnOutlined,
  //   sourceColor: "#33691e",
  // },
  // {
  //   slug: "pptx-to-pdf",
  //   type: "pptx-to-pdf",
  //   title: "PPTX TO PDF",
  //   description:
  //     "Export presentations to PDF for universal viewing. Slides, notes, and layouts stay consistent across devices and platforms.",
  //   layout: "to-pdf",
  //   SourceIcon: SlideshowOutlined,
  //   sourceColor: "#ef6c00",
  // },

  // // ——— From PDF ———
  // {
  //   slug: "pdf-to-jpg",
  //   type: "pdf-to-jpg",
  //   title: "PDF TO JPG",
  //   description:
  //     "Convert PDFs to high-quality JPG images quickly, preserving clarity and detail for easy use and sharing in various formats.",
  //   layout: "from-pdf",
  //   TargetIcon: ImageOutlined,
  //   targetColor: "#2e7d32",
  // },
  // {
  //   slug: "pdf-to-png",
  //   type: "pdf-to-png",
  //   title: "PDF TO PNG",
  //   description:
  //     "Extract pages or graphics from PDFs as lossless PNG files—ideal for design workflows and transparent assets.",
  //   layout: "from-pdf",
  //   TargetIcon: PhotoOutlined,
  //   targetColor: "#1565c0",
  // },
  // {
  //   slug: "pdf-to-csv",
  //   type: "pdf-to-csv",
  //   title: "PDF TO CSV",
  //   description:
  //     "Pull tabular data from PDF tables into CSV for spreadsheets, BI tools, and further analysis with minimal manual cleanup.",
  //   layout: "from-pdf",
  //   TargetIcon: GridOnOutlined,
  //   targetColor: "#33691e",
  // },
  // {
  //   slug: "pdf-to-txt",
  //   type: "pdf-to-txt",
  //   title: "PDF TO TXT",
  //   description:
  //     "Extract plain text from PDF documents for editing, indexing, or feeding into other apps—fast batch-friendly conversion.",
  //   layout: "from-pdf",
  //   TargetIcon: TextSnippetOutlined,
  //   targetColor: "#5d4037",
  // },
  // {
  //   slug: "pdf-to-docx",
  //   type: "pdf-to-docx",
  //   title: "PDF TO DOCX",
  //   description:
  //     "Turn PDFs into editable Word documents when you need to revise copy, styles, or structure without starting from scratch.",
  //   layout: "from-pdf",
  //   TargetIcon: ArticleOutlined,
  //   targetColor: "#1565c0",
  // },
  // {
  //   slug: "pdf-to-xlsx",
  //   type: "pdf-to-xlsx",
  //   title: "PDF TO XLSX",
  //   description:
  //     "Recover spreadsheet-like content from PDFs into Excel workbooks for recalculation, charts, and collaboration.",
  //   layout: "from-pdf",
  //   TargetIcon: TableChartOutlined,
  //   targetColor: "#2e7d32",
  // },
  // {
  //   slug: "pdf-to-html",
  //   type: "pdf-to-html",
  //   title: "PDF TO HTML",
  //   description:
  //     "Generate web-friendly HTML from PDFs for embedding pages, previews, or lightweight publishing pipelines.",
  //   layout: "from-pdf",
  //   TargetIcon: CodeOutlined,
  //   targetColor: "#e65100",
  // },
  // {
  //   slug: "pdf-to-json",
  //   type: "pdf-to-json",
  //   title: "PDF TO JSON",
  //   description:
  //     "Structure extracted PDF content as JSON for APIs, automation, and integration with modern data workflows.",
  //   layout: "from-pdf",
  //   TargetIcon: DataObjectOutlined,
  //   targetColor: "#6a1b9a",
  // },

  // // ——— Single-icon utilities ———
  // {
  //   slug: "image-resizer",
  //   type: "image-resizer",
  //   title: "IMAGE RESIZER",
  //   description:
  //     "Resize images by width, height, or percentage while keeping aspect ratio. Perfect for web, email, and social presets in one pass.",
  //   layout: "single",
  //   SourceIcon: CropFreeOutlined,
  //   sourceColor: "#1565c0",
  // },
  // {
  //   slug: "image-compressor",
  //   type: "image-compressor",
  //   title: "IMAGE COMPRESSOR",
  //   description:
  //     "Shrink file size with minimal quality loss. Ideal for faster uploads, attachments, and storage without visible artifacts.",
  //   layout: "single",
  //   SourceIcon: CompressOutlined,
  //   sourceColor: "#00838f",
  // },
  // {
  //   slug: "pdf-compressor",
  //   type: "pdf-compress",
  //   title: "COMPRESS PDF",
  //   description:
  //     "Reduce PDF file size while keeping text and images clear. Great for faster sharing, email attachments, and storage optimization.",
  //   layout: "single",
  //   SourceIcon: CompressOutlined,
  //   sourceColor: "#d32f2f",
  // },
  // {
  //   slug: "video-compressor",
  //   type: "video-compressor",
  //   title: "VIDEO COMPRESSOR",
  //   description:
  //     "Reduce video bitrate and resolution for streaming-friendly files while balancing clarity and bandwidth.",
  //   layout: "single",
  //   SourceIcon: MovieOutlined,
  //   sourceColor: "#6a1b9a",
  // },
  // {
  //   slug: "pdf-merge",
  //   type: "pdf-merge",
  //   title: "MERGE PDF",
  //   description:
  //     "Combine multiple PDFs into one document in your chosen order—great for packets, appendices, and consolidated archives.",
  //   layout: "single",
  //   SourceIcon: InsertDriveFileOutlined,
  //   sourceColor: "#d32f2f",
  // },
];

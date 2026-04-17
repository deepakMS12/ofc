import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import EmptyWorkspaceState from "./EmptyWorkspaceState";
import { Delete } from "@mui/icons-material";

type PdfCanvasWorkspaceProps = {
  files: File[];
  activePageIndex: number;
  zoomLevel: number;
  rotation: number;
  onPickFiles: () => void;
  onRemoveFile: (index: number) => void;
};

const PdfCanvasWorkspace = memo(
  ({
    files,
    activePageIndex,
    zoomLevel,
    rotation,
    onPickFiles,
    onRemoveFile,
  }: PdfCanvasWorkspaceProps) => {
    const fileCanvasIds = useMemo(
      () =>
        files.map((file, idx) => {
          const cleanName = file.name
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase()
            .slice(0, 10);
          return `o_${idx + 1}${cleanName || "pdf"}`;
        }),
      [files]
    );
    const previewCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    const drawPdfCanvas = useCallback(
      (canvas: HTMLCanvasElement, title: string, subtitle: string) => {
        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "#d7dce8";
        context.lineWidth = 1;
        context.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);

        context.fillStyle = "#1565c0";
        context.fillRect(0, 0, canvas.width, 10);

        context.fillStyle = "#1f2937";
        context.font = canvas.width > 200 ? "bold 16px Arial" : "bold 10px Arial";
        context.fillText("PDF", 10, canvas.width > 200 ? 32 : 24);

        context.fillStyle = "#4b5563";
        context.font = canvas.width > 200 ? "12px Arial" : "9px Arial";
        context.fillText(title, 10, canvas.width > 200 ? 56 : 40);
        context.fillText(subtitle, 10, canvas.width > 200 ? 76 : 54);

        context.strokeStyle = "#e5e7eb";
        for (let i = 0; i < 6; i += 1) {
          const y = canvas.height / 2 + i * (canvas.width > 200 ? 18 : 11);
          context.beginPath();
          context.moveTo(10, y);
          context.lineTo(canvas.width - 10, y);
          context.stroke();
        }
      },
      []
    );

    useEffect(() => {
      previewCanvasRefs.current = previewCanvasRefs.current.slice(0, files.length);
      files.forEach((file, index) => {
        const canvas = previewCanvasRefs.current[index];
        if (!canvas) return;
        drawPdfCanvas(canvas, file.name.slice(0, 22), `Preview page ${index + 1}`);
      });
    }, [drawPdfCanvas, files]);

    if (!files.length) {
      return <EmptyWorkspaceState sourceLabel="PDF" onPickFiles={onPickFiles} />;
    }

    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxHeight: "calc(100vh - 168px)",
          overflowY: "auto",
        
          gap: 2,
        }}
      >
        {files.map((file, index) => (
          <Paper
            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
            elevation={0}
            sx={{
              borderRadius: 2,
              border:
                index === activePageIndex
                  ? "1px solid #1d4ed8"
                  : "1px solid #e5e7eb",
              bgcolor: "#fff",
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
              <IconButton
                size="small"
                onClick={() => onRemoveFile(index)}
                sx={{ alignSelf: "flex-end" }}
              >
                <Delete fontSize="small" color="error" />
              </IconButton>
            <Box
              className="file__canvas"
              sx={{
                width: { xs: 240, md: 240 },
                height: { xs: 140, md: 260 },
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 24px rgba(0,0,0,0.1)",
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center",
                transition: "transform 0.2s ease",
                bgcolor: "#fff",
              }}
            >
              <canvas
                id={`cover-${fileCanvasIds[index]}`}
                width={420}
                height={594}
                className="pdf pdf"
                data-file={fileCanvasIds[index]}
                data-page={index + 1}
                dir="ltr"
                data-width={595.28}
                data-height={841.89}
                style={{ backgroundImage: "none", display: "block" }}
                ref={(canvas) => {
                  previewCanvasRefs.current[index] = canvas;
                }}
              />
            </Box>
            <Typography
              title={file.name}
              sx={{
                maxWidth: 220,
                fontSize: 14,
                color: "#4b5563",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file.name}
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  }
);

PdfCanvasWorkspace.displayName = "PdfCanvasWorkspace";

export default PdfCanvasWorkspace;

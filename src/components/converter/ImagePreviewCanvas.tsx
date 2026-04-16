import { memo, useEffect, useRef, useState } from "react";
import { Paper } from "@mui/material";
import EmptyWorkspaceState from "./EmptyWorkspaceState";

type ImagePreviewCanvasProps = {
  mode: "resizer" | "compressor";
  files: File[];
  onPickFiles: () => void;
  resizePercent: number;
};

const ImagePreviewCanvas = memo(
  ({ mode, files, onPickFiles, resizePercent }: ImagePreviewCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const file = files[0];
      if (!file) {
        setImageUrl(null);
        return;
      }
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }, [files]);

    useEffect(() => {
      if (!imageUrl || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const image = new Image();
      image.onload = () => {
        const ratio = mode === "resizer" ? resizePercent / 100 : 1;
        const targetWidth = Math.max(1, Math.floor(image.width * ratio));
        const targetHeight = Math.max(1, Math.floor(image.height * ratio));

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.clearRect(0, 0, targetWidth, targetHeight);
        context.drawImage(image, 0, 0, targetWidth, targetHeight);
      };
      image.src = imageUrl;
    }, [imageUrl, mode, resizePercent]);

    return (
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          backgroundColor: "transparent",
          borderRadius: 2,
          p: 2,
          display: "grid",
          placeItems: "center",
          minHeight: 340,
        }}
      >
        {imageUrl ? (
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "auto",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
            }}
          />
        ) : (
          <EmptyWorkspaceState sourceLabel="image" onPickFiles={onPickFiles} />
        )}
      </Paper>
    );
  },
);

ImagePreviewCanvas.displayName = "ImagePreviewCanvas";

export default ImagePreviewCanvas;

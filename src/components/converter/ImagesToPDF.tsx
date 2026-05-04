import type { SelectChangeEvent } from "@mui/material";
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { SettingsAccordion } from "./pdfSettings/SettingsAccordion";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { PDF_DIMENSION_UNIT_OPTIONS, type PdfDimensionUnitId } from "./pdfDimensionUnits";
import {
  getPresetPageSizeFields,
  PDF_PAGE_FORMAT_OPTIONS,
  type PdfPageFormatId,
} from "./pdfPageFormats";
import { ENCRYPTION_LEVEL_OPTIONS, type EncryptionLevelId } from "./rightsEncryptionOptions";
import {
  buildImagesToPdfFormData,
  type ImagesToPdfFormFields,
  type ImagesToPdfRightsRestrictionId,
} from "./imagesToPdfPayload";
import type { UrlToPdfQueryType } from "./urlToPdfPayload";

const DEFAULT_MARGIN = "10";

type RightsRestrictionId = ImagesToPdfRightsRestrictionId;

const DEFAULT_RIGHTS: Record<RightsRestrictionId, boolean> = {
  disallowPrint: false,
  disallowAnnotation: false,
  disallowContentCopy: false,
  disableEditingPdf: false,
};

const RIGHTS_RESTRICTION_LABELS: Record<RightsRestrictionId, string> = {
  disallowPrint: "Disallow print",
  disallowAnnotation: "Disallow annotation",
  disallowContentCopy: "Disallow content copy",
  disableEditingPdf: "Disable editing PDF",
};

export type ImagesToPdfHandle = {
  getPayload: (files: File[]) => { queryType: UrlToPdfQueryType; body: FormData };
  getOutputFileName: () => string;
};

type ImagesToPDFProps = {
  /** Number of images selected on the right workspace. */
  fileCount: number;
};

const ImagesToPDF = forwardRef<ImagesToPdfHandle, ImagesToPDFProps>(
  function ImagesToPDF({ fileCount }, ref) {
    const [merge, setMerge] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const [simpleOpenPassword, setSimpleOpenPassword] = useState("");
    const [outputFileName, setOutputFileName] = useState("");
    const [pageFormat, setPageFormat] = useState<PdfPageFormatId>("a4");
    const [alignment, setAlignment] = useState<"web" | "android">("web");
    const [dimensionUnit, setDimensionUnit] = useState<PdfDimensionUnitId>(
      () => getPresetPageSizeFields("a4", false)!.unit,
    );
    const [pageWidth, setPageWidth] = useState(
      () => getPresetPageSizeFields("a4", false)!.width,
    );
    const [pageHeight, setPageHeight] = useState(
      () => getPresetPageSizeFields("a4", false)!.height,
    );
    const [marginTop, setMarginTop] = useState(DEFAULT_MARGIN);
    const [marginRight, setMarginRight] = useState(DEFAULT_MARGIN);
    const [marginBottom, setMarginBottom] = useState(DEFAULT_MARGIN);
    const [marginLeft, setMarginLeft] = useState(DEFAULT_MARGIN);
    const [encryptionLevel, setEncryptionLevel] =
      useState<EncryptionLevelId>("none");
    const [userPassword, setUserPassword] = useState("");
    const [ownerPassword, setOwnerPassword] = useState("");
    const [rightsRestrictions, setRightsRestrictions] =
      useState(DEFAULT_RIGHTS);

    const isCustomFormat = pageFormat === "custom";
    const isLandscape = alignment === "android";

    useEffect(() => {
      const preset = getPresetPageSizeFields(pageFormat, isLandscape);
      if (!preset) return;
      setDimensionUnit(preset.unit);
      setPageWidth(preset.width);
      setPageHeight(preset.height);
    }, [pageFormat, isLandscape]);

    const collectFields = useCallback((): ImagesToPdfFormFields => {
      return {
        merge,
        simpleOpenPassword,
        outputFileName,
        pageFormat,
        alignment,
        dimensionUnit,
        pageWidth,
        pageHeight,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        encryptionLevel,
        userPassword,
        ownerPassword,
        rightsRestrictions,
      };
    }, [
      merge,
      simpleOpenPassword,
      outputFileName,
      pageFormat,
      alignment,
      dimensionUnit,
      pageWidth,
      pageHeight,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      encryptionLevel,
      userPassword,
      ownerPassword,
      rightsRestrictions,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        getOutputFileName: () => outputFileName,
        getPayload: (fileList: File[]) => {
          const queryType: UrlToPdfQueryType = isPreview ? "d" : "p";
          return {
            queryType,
            body: buildImagesToPdfFormData(
              fileList,
              collectFields(),
              queryType,
            ),
          };
        },
      }),
      [collectFields, isPreview, outputFileName],
    );

    const handleChange = (_event: unknown, newAlignment: string | null) => {
      if (!newAlignment) return;
      setAlignment(newAlignment as "web" | "android");
    };

    const handlePageFormatChange = (
      event: SelectChangeEvent<PdfPageFormatId>,
    ) => {
      setPageFormat(event.target.value as PdfPageFormatId);
    };

    const handleDimensionUnitChange = (
      event: SelectChangeEvent<PdfDimensionUnitId>,
    ) => {
      setDimensionUnit(event.target.value as PdfDimensionUnitId);
    };

    const handleEncryptionLevelChange = (
      event: SelectChangeEvent<EncryptionLevelId>,
    ) => {
      setEncryptionLevel(event.target.value as EncryptionLevelId);
    };

    const handleRightsRestrictionChange = (id: RightsRestrictionId) => {
      setRightsRestrictions((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 340px)",
          maxHeight: "100%",
          minHeight: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            pb: 1,
          }}
        >
          <SettingsAccordion
            id="images-settings-source"
            title="Source images"
            defaultExpanded
          >
            <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1.5 }}>
              Choose PNG or JPEG files from the workspace on the right. You can add
              multiple images; merge combines them into one PDF, or turn merge off for a
              ZIP of separate PDFs.
            </Typography>
            {fileCount > 0 && (
              <Typography
                sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 1 }}
              >
                {fileCount} file{fileCount !== 1 ? "s" : ""} selected
              </Typography>
            )}
            <FormControlLabel
              sx={{ mt: 0.5, ml: 0, alignItems: "center" }}
              control={
                <Checkbox
                  color="primary"
                  checked={merge}
                  onChange={(_, checked) => setMerge(checked)}
                />
              }
              label="Merge all files into one PDF"
            />
            <FormControlLabel
              sx={{ mt: 1, ml: 0, alignItems: "center" }}
              control={
                <Checkbox
                  color="primary"
                  checked={isPreview}
                  onChange={(_, checked) => setIsPreview(checked)}
                />
              }
              label="Preview"
            />
            <SettingsOutlinedField
              id="images-simple-password"
              sx={{ mt: 2 }}
              label="Simple open password (output PDF / each PDF in ZIP)"
              type="password"
              autoComplete="new-password"
              placeholder="Optional — quick AES lock"
              value={simpleOpenPassword}
              onChange={(e) => setSimpleOpenPassword(e.target.value)}
            />
          </SettingsAccordion>

          <SettingsAccordion
            id="images-page-size"
            title="Page size & orientation"
          >
            <FormControl fullWidth size="small">
              <InputLabel id="images-page-size-label">Format</InputLabel>
              <Select
                labelId="images-page-size-label"
                id="images-page-size-select"
                value={pageFormat}
                label="Format"
                onChange={handlePageFormatChange}
              >
                {PDF_PAGE_FORMAT_OPTIONS.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!isCustomFormat && (
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                sx={{ mt: 1 }}
                onChange={handleChange}
                aria-label="Orientation"
                fullWidth
              >
                <ToggleButton value="web">Portrait</ToggleButton>
                <ToggleButton value="android">Landscape</ToggleButton>
              </ToggleButtonGroup>
            )}
            {isCustomFormat && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 1,
                  my: 2,
                }}
              >
                <FormControl fullWidth size="small" disabled={!isCustomFormat}>
                  <InputLabel id="images-dimension-unit-label">Unit</InputLabel>
                  <Select
                    labelId="images-dimension-unit-label"
                    id="images-dimension-unit-select"
                    value={dimensionUnit}
                    label="Unit"
                    onChange={handleDimensionUnitChange}
                  >
                    {PDF_DIMENSION_UNIT_OPTIONS.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <SettingsOutlinedField
                  id="images-page-width"
                  label="Page width"
                  fullWidth
                  disabled={!isCustomFormat}
                  value={pageWidth}
                  onChange={(e) => setPageWidth(e.target.value)}
                />
                <SettingsOutlinedField
                  id="images-page-height"
                  label="Page height"
                  fullWidth
                  disabled={!isCustomFormat}
                  value={pageHeight}
                  onChange={(e) => setPageHeight(e.target.value)}
                />
              </Box>
            )}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  sm: "1fr",
                  md: "1fr 1fr",
                },
                gap: 1,
                my: 2,
              }}
            >
              <SettingsOutlinedField
                id="images-margin-top"
                label="Margin top"
                fullWidth
                value={marginTop}
                onChange={(e) => setMarginTop(e.target.value)}
              />
              <SettingsOutlinedField
                id="images-margin-right"
                label="Margin right"
                fullWidth
                value={marginRight}
                onChange={(e) => setMarginRight(e.target.value)}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  sm: "1fr",
                  md: "1fr 1fr",
                },
                gap: 1,
                my: 2,
              }}
            >
              <SettingsOutlinedField
                id="images-margin-bottom"
                label="Margin bottom"
                fullWidth
                value={marginBottom}
                onChange={(e) => setMarginBottom(e.target.value)}
              />
              <SettingsOutlinedField
                id="images-margin-left"
                label="Margin left"
                fullWidth
                value={marginLeft}
                onChange={(e) => setMarginLeft(e.target.value)}
              />
            </Box>
          </SettingsAccordion>

          <SettingsAccordion
            id="images-rights-encryption"
            title="Rights management & encryption"
          >
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="images-encryption-level-label">
                Encryption level
              </InputLabel>
              <Select
                labelId="images-encryption-level-label"
                id="images-encryption-level-select"
                value={encryptionLevel}
                label="Encryption level"
                onChange={handleEncryptionLevelChange}
              >
                {ENCRYPTION_LEVEL_OPTIONS.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr " },
                gap: 2,
                mb: 2,
              }}
            >
              <SettingsOutlinedField
                id="images-user-password"
                label="User password"
                placeholder="Open password"
                fullWidth
                type="password"
                autoComplete="new-password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
              <SettingsOutlinedField
                id="images-owner-password"
                label="Owner password"
                placeholder="Permissions password"
                fullWidth
                type="password"
                autoComplete="new-password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
              />
            </Box>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
              Applies to the merged PDF, or to{" "}
              <Typography component="span" sx={{ fontWeight: 700 }}>
                each
              </Typography>{" "}
              PDF inside the ZIP when merge is off.
            </Alert>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                columnGap: 2,
                rowGap: 0.5,
              }}
            >
              {(
                [
                  "disallowPrint",
                  "disallowContentCopy",
                  "disallowAnnotation",
                  "disableEditingPdf",
                ] as RightsRestrictionId[]
              ).map((id) => (
                <FormControlLabel
                  key={id}
                  control={
                    <Checkbox
                      color="primary"
                      checked={rightsRestrictions[id]}
                      onChange={() => handleRightsRestrictionChange(id)}
                    />
                  }
                  label={RIGHTS_RESTRICTION_LABELS[id]}
                  sx={{
                    m: 0,
                    alignItems: "center",
                    "& .MuiFormControlLabel-label": {
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.02,
                    },
                  }}
                />
              ))}
            </Box>
          </SettingsAccordion>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            px: 2,
            pt: 0.8,
          }}
        >
          <SettingsOutlinedField
            id="images-output-file"
            label="Output File (optional)"
            placeholder="document.pdf"
            value={outputFileName}
            onChange={(e) => setOutputFileName(e.target.value)}
          />
        </Box>
      </Box>
    );
  },
);

ImagesToPDF.displayName = "ImagesToPDF";

export default ImagesToPDF;

import type { SelectChangeEvent } from "@mui/material";
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
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
import { HtmlGhostTextField } from "./pdfSettings/HtmlGhostTextField";
import { SettingsOutlinedField } from "./pdfSettings/SettingsOutlinedField";
import { ENCRYPTION_LEVEL_OPTIONS, type EncryptionLevelId } from "./rightsEncryptionOptions";
import {
  buildMergePdfFormData,
  isValidMergeInputPasswordsJson,
  type MergePdfFormFields,
  type MergePdfRightsRestrictionId,
} from "./mergePdfPayload";
import type { UrlToPdfQueryType } from "./urlToPdfPayload";

type RightsRestrictionId = MergePdfRightsRestrictionId;

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

const MERGE_INPUT_PASSWORDS_GHOST = '["", "", "read-secret"]';

export type MergePdfHandle = {
  getPayload: (fileList: File[]) => { queryType: UrlToPdfQueryType; body: FormData };
  getOutputFileName: () => string;
};

type MergePdfPanelProps = {
  fileCount: number;
  onValidityChange: (ok: boolean) => void;
  onFieldsDirty: () => void;
};

const MergePdfPanel = forwardRef<MergePdfHandle, MergePdfPanelProps>(
  function MergePdfPanel({ fileCount, onValidityChange, onFieldsDirty }, ref) {
    const [inputPasswordsJson, setInputPasswordsJson] = useState("");
    const [simpleOpenPassword, setSimpleOpenPassword] = useState("");
    const [outputFileName, setOutputFileName] = useState("merged");
    const [isPreview, setIsPreview] = useState(true);
    const [encryptionLevel, setEncryptionLevel] =
      useState<EncryptionLevelId>("none");
    const [userPassword, setUserPassword] = useState("");
    const [ownerPassword, setOwnerPassword] = useState("");
    const [rightsRestrictions, setRightsRestrictions] =
      useState(DEFAULT_RIGHTS);

    const jsonOk = isValidMergeInputPasswordsJson(inputPasswordsJson);

    useEffect(() => {
      onValidityChange(jsonOk);
    }, [jsonOk, onValidityChange]);

    const collectFields = useCallback((): MergePdfFormFields => {
      return {
        inputPasswordsJson,
        simpleOpenPassword,
        outputFileName,
        encryptionLevel,
        userPassword,
        ownerPassword,
        rightsRestrictions,
      };
    }, [
      inputPasswordsJson,
      simpleOpenPassword,
      outputFileName,
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
            body: buildMergePdfFormData(fileList, collectFields(), queryType),
          };
        },
      }),
      [collectFields, isPreview, outputFileName],
    );

    const handleEncryptionLevelChange = (
      event: SelectChangeEvent<EncryptionLevelId>,
    ) => {
      setEncryptionLevel(event.target.value as EncryptionLevelId);
      onFieldsDirty();
    };

    const handleRightsRestrictionChange = (id: RightsRestrictionId) => {
      setRightsRestrictions((prev) => ({ ...prev, [id]: !prev[id] }));
      dirty();
    };

    const dirty = useCallback(() => {
      onFieldsDirty();
    }, [onFieldsDirty]);

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
            id="merge-pdf-source"
            title="PDF files"
            defaultExpanded
          >
            <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
              Upload at least two .pdf files from the workspace on the right. Merge order
              matches the order shown in the file list (same as multi-select order in most
              browsers).
            </Alert>
            {fileCount > 0 && (
              <Typography
                sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 1 }}
              >
                {fileCount} file{fileCount !== 1 ? "s" : ""} selected
              </Typography>
            )}
            <Box>
              <HtmlGhostTextField
                id="merge-input-passwords-json"
                label="Passwords for inputs (optional JSON array, one string per file)"
                value={inputPasswordsJson}
                onChange={(next) => {
                  setInputPasswordsJson(next);
                  dirty();
                }}
                defaultHtml={MERGE_INPUT_PASSWORDS_GHOST}
                rows={1}
              />
              {!jsonOk && (
                <FormHelperText error sx={{ mx: 1.75, mt: 0.5 }}>
                  Must be valid JSON: an array of strings, one per input PDF.
                </FormHelperText>
              )}
            </Box>
            <SettingsOutlinedField
              id="merge-simple-password"
              sx={{ mt: 2 }}
              label="Simple open password (merged PDF only)"
              type="password"
              autoComplete="new-password"
              placeholder="Optional — quick AES lock on output"
              value={simpleOpenPassword}
              onChange={(e) => {
                setSimpleOpenPassword(e.target.value);
                dirty();
              }}
            />
            <FormControlLabel
              sx={{ mt: 2, ml: 0, alignItems: "center" }}
              control={
                <Checkbox
                  color="primary"
                  checked={isPreview}
                  onChange={(_, checked) => {
                    setIsPreview(checked);
                    dirty();
                  }}
                />
              }
              label="Preview"
            />
          </SettingsAccordion>

          <SettingsAccordion
            id="merge-pdf-rights"
            title="Rights management & encryption"
          >
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="merge-encryption-level-label">
                Encryption level
              </InputLabel>
              <Select
                labelId="merge-encryption-level-label"
                id="merge-encryption-level-select"
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
                id="merge-user-password"
                label="User password"
                placeholder="Open password on merged PDF"
                fullWidth
                type="password"
                autoComplete="new-password"
                value={userPassword}
                onChange={(e) => {
                  setUserPassword(e.target.value);
                  dirty();
                }}
              />
              <SettingsOutlinedField
                id="merge-owner-password"
                label="Owner password"
                placeholder="Permissions password"
                fullWidth
                type="password"
                autoComplete="new-password"
                value={ownerPassword}
                onChange={(e) => {
                  setOwnerPassword(e.target.value);
                  dirty();
                }}
              />
            </Box>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 1 }}>
              Applies to the{" "}
              <Typography component="span" sx={{ fontWeight: 700 }}>
                merged output
              </Typography>{" "}
              only. Use simple open password above for a quick single password, or set full
              rights here.
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
            id="merge-output-file"
            label="Output File (optional)"
            placeholder="merged.pdf"
            value={outputFileName}
            onChange={(e) => {
              setOutputFileName(e.target.value);
              dirty();
            }}
          />
        </Box>
      </Box>
    );
  },
);

MergePdfPanel.displayName = "MergePdfPanel";

export default MergePdfPanel;

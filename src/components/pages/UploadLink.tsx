import { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';
import { uploadApi, type UploadResponse, type UploadedFile } from '@/lib/api/upload';
import { useToast } from '@/hooks/useToast';
import { showConfirm } from '@/lib/utils/sweetalert';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// Allowed file types
const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // PDF
  'application/pdf',
  // Excel
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Word
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // ZIP
  'application/zip',
  'application/x-zip-compressed',
  // Text
  'text/plain',
  'text/csv',
];

const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.pdf',
  '.xls', '.xlsx',
  '.doc', '.docx',
  '.zip',
  '.txt', '.csv',
];

const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 hour' },
  { value: '3h', label: '3 hours' },
  { value: '6h', label: '6 hours' },
  { value: '1day', label: '1 day' },
  { value: '7day', label: '7 days' },
];

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(value?: string | null) {
  if (!value) return '--';
  
  // Check if the value is already in DD-MM-YYYY HH:mm:ss format
  const ddmmyyyyPattern = /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/;
  const match = value.match(ddmmyyyyPattern);
  
  if (match) {
    // Already in the correct format, return as is
    return value;
  }
  
  // Try to parse as standard date format
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return '--';
  }
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parse date string (DD-MM-YYYY HH:mm:ss or standard format) to Date object for comparison
 */
function parseDateForComparison(value?: string | null): Date {
  if (!value) return new Date(0);
  
  // Check if the value is in DD-MM-YYYY HH:mm:ss format
  const ddmmyyyyPattern = /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/;
  const match = value.match(ddmmyyyyPattern);
  
  if (match) {
    // Parse DD-MM-YYYY HH:mm:ss format
    const [, day, month, year, hours, minutes, seconds] = match;
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1, // Month is 0-indexed
      parseInt(day, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  }
  
  // Try to parse as standard date format
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return new Date(0);
  }
  
  return date;
}

/**
 * Truncate filename to show first 20 chars + ... + extension
 * Example: "WhatsApp Image 2025-11-24 at 11.55.55.jpg" -> "WhatsApp Image 2025-1....jpg"
 */
function truncateFileName(fileName: string, maxLength: number = 20): string {
  if (!fileName) return '';
  
  // If filename is short enough, return as is
  if (fileName.length <= maxLength + 3) { // +3 for "..."
    return fileName;
  }

  const lastDotIndex = fileName.lastIndexOf('.');
  
  // If no extension found, just truncate
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return fileName.substring(0, maxLength) + '...';
  }

  const nameWithoutExt = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex); // includes the dot

  // If name without extension is short enough, return full filename
  if (nameWithoutExt.length <= maxLength) {
    return fileName;
  }

  // Truncate the name part to maxLength and add ... + extension
  const truncatedName = nameWithoutExt.substring(0, maxLength);
  return truncatedName + '...' + extension;
}

/**
 * Get icon path based on MIME type or file extension
 */
function getFileIcon(mimeType?: string, fileName?: string): string {
  const iconBasePath = '/assets/assets/images/icon';
  
  const getExtension = (name?: string): string => {
    if (!name) return '';
    const parts = name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const extension = getExtension(fileName);
  const mime = mimeType?.toLowerCase() || '';

  if (mime.startsWith('image/')) {
    if (mime.includes('gif') || extension === 'gif') {
      return `${iconBasePath}/gif.png`;
    }
    if (mime.includes('png') || extension === 'png') {
      return `${iconBasePath}/png.png`;
    }
    if (mime.includes('jpeg') || mime.includes('jpg') || extension === 'jpg' || extension === 'jpeg') {
      return `${iconBasePath}/jpg.png`;
    }
    return `${iconBasePath}/image.png`;
  }

  if (mime === 'application/pdf' || extension === 'pdf') {
    return `${iconBasePath}/pdf.png`;
  }

  if (mime.includes('spreadsheet') || mime.includes('excel') || extension === 'xls' || extension === 'xlsx') {
    return `${iconBasePath}/excel.png`;
  }

  if (mime.includes('wordprocessingml') || mime.includes('msword') || extension === 'doc' || extension === 'docx') {
    return `${iconBasePath}/doc.png`;
  }

  if (mime.includes('zip') || mime.includes('compressed') || extension === 'zip') {
    return `${iconBasePath}/zip.png`;
  }

  if (mime.includes('text/plain') || mime.includes('text/csv') || extension === 'txt' || extension === 'csv') {
    return `${iconBasePath}/txt.png`;
  }

  return `${iconBasePath}/other-file.png`;
}

export default function UploadLink() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState<UploadResponse | null>(null);
  const [expiryOption, setExpiryOption] = useState<string>('1day');
  const [recentFiles, setRecentFiles] = useState<UploadedFile[]>([]);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploaded(null);
     setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  };

  const isValidFileType = (file: File): boolean => {
    const ext = '.' + getFileExtension(file.name);
    return (
      ALLOWED_FILE_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.includes(ext)
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setUploaded(null);
      return;
    }

    // Validate file type
    if (!isValidFileType(file)) {
      showToast('File type not allowed. Allowed types: images, PDF, Excel, Word, ZIP, TXT', 'error');
      event.target.value = ''; // Reset input
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploaded(null);
     setUploadProgress(0);
  };

  const validateFile = () => {
    if (!selectedFile) {
      showToast('Please choose a file to upload.', 'error');
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      showToast('Maximum allowed size is 25MB.', 'error');
      return false;
    }
    if (!isValidFileType(selectedFile)) {
      showToast('File type not allowed. Allowed types: images, PDF, Excel, Word, ZIP, TXT', 'error');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateFile() || !selectedFile) {
      return;
    }
    setUploading(true);
  setUploadProgress(0);
    try {
      const response = await uploadApi.uploadFile(
        selectedFile,
        expiryOption,
         (progress) => {
          setUploadProgress(progress);
        }
      );
      setUploaded(response);
     setUploadProgress(0);
      showToast('Upload successful.', 'success');
      
      // Reload files immediately after upload
      try {
        const files = await uploadApi.listFiles();
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const recent = files.filter((file) => {
          if (!file.uploadedAt) return false;
          const uploadedDate = parseDateForComparison(file.uploadedAt);
          return uploadedDate >= thirtyMinutesAgo;
        });
        setRecentFiles(recent);
      } catch (error) {
        console.error('Failed to reload files after upload:', error);
      }
      
      // Reset form after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setUploaded(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000); // Small delay to show success message
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to upload file.';
      showToast(message, 'error');
          setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyFileUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard.', 'success');
    } catch {
      showToast('Unable to copy link.', 'error');
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    const confirmed = await showConfirm({
      title: 'Delete File?',
      text: `Are you sure ? delete <strong>${file.fileName}</strong>?<br/>- action cannot be undone.`,
      icon: 'warning',
      confirmButtonText: '<strong>Yes, delete it</strong>',
      cancelButtonText: '<span style="color:#555;">Cancel</span>',
      confirmButtonColor: '#f05443',
      cancelButtonColor: '#e0e0e0',
      reverseButtons: true,
    });

    if (!confirmed) {
      return;
    }

    try {
      setDeletingFile(file.fileUid);
      await uploadApi.deleteFile(file.fileUid);
      showToast('File deleted', 'success');
      
      // Reload recent files after deletion
      const files = await uploadApi.listFiles();
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recent = files.filter((file) => {
        if (!file.uploadedAt) return false;
        const uploadedDate = parseDateForComparison(file.uploadedAt);
        return uploadedDate >= thirtyMinutesAgo;
      });
      setRecentFiles(recent);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to delete file.';
      showToast(message, 'error');
    } finally {
      setDeletingFile(null);
    }
  };

  // Load files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      setLoadingFiles(true);
      try {
        const files = await uploadApi.listFiles();
        
        // Filter files uploaded in the last 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const recent = files.filter((file) => {
          if (!file.uploadedAt) return false;
          const uploadedDate = parseDateForComparison(file.uploadedAt);
          return uploadedDate >= thirtyMinutesAgo;
        });
        
        setRecentFiles(recent);
      } catch (error: any) {
        // Silently fail - don't show error for this background check
        console.error('Failed to load recent files:', error);
        setRecentFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, []);

  // Reload files after successful upload
  useEffect(() => {
    if (uploaded) {
      const loadFiles = async () => {
        try {
          const files = await uploadApi.listFiles();
          const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
          const recent = files.filter((file) => {
            if (!file.uploadedAt) return false;
            const uploadedDate = parseDateForComparison(file.uploadedAt);
            return uploadedDate >= thirtyMinutesAgo;
          });
          setRecentFiles(recent);
        } catch (error) {
          console.error('Failed to reload files:', error);
        }
      };
      loadFiles();
    }
  }, [uploaded]);

  const hasRecentFiles = recentFiles.length > 0;

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 1200,
          mb: 3,
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#0b996e',
            '&:hover': { backgroundColor: '#077655' },
          }}
        >
          Upload file
        </Button>
        <Button
          component={RouterLink}
          to="/home/file-manager"
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#0b996e',
            color: '#0b996e',
          }}
        >
          File manager
        </Button>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          width: '100%',
        
          alignItems: 'stretch',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 420px' },
            borderRadius: 4,
            p: 4,
            border: '2px solid #e0e0e0',
            boxShadow: 'none',
          }}
        >
          <Stack spacing={3}>
            <Typography variant="subtitle2" sx={{ color: '#7f7f9c', fontWeight: 600, textTransform: 'uppercase' }}>
              Request files
            </Typography>

            <Box
              sx={{
                border: '1px dashed #0b996e',
                borderRadius: 3,
                p: 3,
                textAlign: 'center',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.xls,.xlsx,.doc,.docx,.zip,.txt,.csv,image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip,text/plain"
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: '#0b996e', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2a2a53' }}>
                Drag & drop or click to upload
              </Typography>
              <Typography variant="body2" sx={{ color: '#7c7c9e', mb: 2 }}>
                Supports documents, media, spreadsheets, and more.
              </Typography>
              <Button variant="outlined" onClick={handleBrowseClick} sx={{ borderColor: '#0b996e', color: '#0b996e' }}>
                Browse files
              </Button>
            </Box>

            {selectedFile && (
              <Box
                sx={{
                  border: '1px solid #ebeefc',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: 'white',
                  position: 'relative',
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleRemoveFile}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#999',
                    '&:hover': {
                      color: '#f44336',
                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333', pr: 4 }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#777' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &middot; {selectedFile.type || 'unknown type'}
                </Typography>
              </Box>
            )}

            <Stack
              spacing={2}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <TextField
                select
                label="Link expires in"
                value={expiryOption}
                onChange={(e) => setExpiryOption(e.target.value)}
                fullWidth
                sx={{
                  flex: { sm: '0 0 160px' },
                  backgroundColor: 'white',
                  '& fieldset': { borderColor: '#e0e3ff' },
                }}
              >
                {EXPIRY_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
          
              {uploading ? (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 1 }} />
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5, color: '#666' }}>
                    {uploadProgress}% uploaded
                  </Typography>
                </Box>
              ) : (
                    <Button
                fullWidth
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                  background: '#0b996e',
                }}
              >
                Get Link
              </Button>
              )}
            </Stack>

          </Stack>
        </Paper>

        {uploading || loadingFiles ? (
          <Box
      sx={{
        flex: 1,
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Skeleton variant="text" width={260} height={32} sx={{ mb: 2 }} />

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fffdf5" }}>
              {["File name", "Size", "Uploaded", "Expires", "Actions"].map(
                (header) => (
                  <TableCell key={header}>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {/* File Name + Icon */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="70%" />
                  </Box>
                </TableCell>

                {/* Size */}
                <TableCell>
                  <Skeleton variant="text" width={50} />
                </TableCell>

                {/* Uploaded */}
                <TableCell>
                  <Skeleton variant="text" width={90} />
                </TableCell>

                {/* Expires */}
                <TableCell>
                  <Skeleton variant="text" width={90} />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Skeleton variant="circular" width={28} height={28} />
                    <Skeleton variant="circular" width={28} height={28} />
                    <Skeleton variant="circular" width={28} height={28} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
        ) : hasRecentFiles ? (
          <Box
            sx={{
              flex: 1,
              p: { xs: 1, md: 1 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#222', mb: 2 }}>
              Recently Uploaded Files (Last 30 minutes)
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#fffdf5' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>File name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Uploaded</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333' }}>Expires</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#333' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentFiles.map((file) => (
                    <TableRow key={file.fileName} hover>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden' }}>
                        <Tooltip title={file.fileName} arrow placement="top">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                            <Box
                              component="img"
                              src={getFileIcon(file.mimeType, file.fileName)}
                              alt="File type"
                              sx={{
                                width: 24,
                                height: 24,
                                objectFit: 'contain',
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              {truncateFileName(file.fileName)}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{formatBytes(file.size)}</TableCell>
                      <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                      <TableCell>{formatDate(file.expiresAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Copy link">
                          <IconButton size="small" onClick={() => handleCopyFileUrl(file.url)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Open in new tab">
                          <IconButton
                            size="small"
                            component="a"
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete file">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={deletingFile === file.fileUid}
                              onClick={() => handleDeleteFile(file)}
                            > {
                              deletingFile === file.fileUid ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <DeleteIcon fontSize="small" />
                              )
                            }
                       
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#222', lineHeight: 1.2 }}>
              Trust every upload with
              <Box component="span" sx={{ display: 'block', color: '#0b996e' }}>
                auto delete protection
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: '#555', maxWidth: 520 }}>
              Files are stored on encrypted storage, only accessible via your link, and are automatically removed after
              the expiry window you selected. No manual cleanup or surprises—just peace of mind for you and your
              recipients.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}


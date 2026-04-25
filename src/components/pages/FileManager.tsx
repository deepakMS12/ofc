import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FolderIcon from '@mui/icons-material/Folder';
import { Link as RouterLink } from 'react-router-dom';
import { uploadApi, type UploadedFile } from '@/lib/api/upload';
import { useToast } from '@/hooks/useToast';
import { showConfirm } from '@/lib/utils/sweetalert';

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
  
  // Get file extension as fallback
  const getExtension = (name?: string): string => {
    if (!name) return '';
    const parts = name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const extension = getExtension(fileName);
  const mime = mimeType?.toLowerCase() || '';

  // Image types
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

  // PDF
  if (mime === 'application/pdf' || extension === 'pdf') {
    return `${iconBasePath}/pdf.png`;
  }

  // Excel
  if (
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    extension === 'xls' ||
    extension === 'xlsx'
  ) {
    return `${iconBasePath}/excel.png`;
  }

  // Word/Document
  if (
    mime.includes('wordprocessingml') ||
    mime.includes('msword') ||
    extension === 'doc' ||
    extension === 'docx'
  ) {
    return `${iconBasePath}/doc.png`;
  }

  // ZIP
  if (mime.includes('zip') || mime.includes('compressed') || extension === 'zip') {
    return `${iconBasePath}/zip.png`;
  }

  // Text
  if (mime.includes('text/plain') || mime.includes('text/csv') || extension === 'txt' || extension === 'csv') {
    return `${iconBasePath}/txt.png`;
  }

  // Default fallback
  return `${iconBasePath}/other-file.png`;
}

export default function FileManager() {
  const { showToast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await uploadApi.listFiles();
      setFiles(data);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to load files.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (file: UploadedFile) => {
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
      setDeleting(file.fileUid);
      await uploadApi.deleteFile(file.fileUid);
      showToast('File deleted', 'success');
      await loadFiles();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to delete file.';
      showToast(message, 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied', 'success');
    } catch {
      showToast('Unable to copy link.', 'error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
          component={RouterLink}
          to="/home/upload-link"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#0b996e',
            color: '#0b996e',
          }}
        >
          Upload file
        </Button>
        <Button
          variant="contained"
          startIcon={<FolderIcon />}
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#0b996e',
            '&:hover': { backgroundColor: '#077655' },
          }}
        >
          File manager
        </Button>
      </Stack>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 1200,
          zIndex: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#222', mb: 1 }}>
              Secure file vault
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', maxWidth: 640 }}>
              Every upload you create is listed here with its auto-delete timer. Copy the link, share it, or remove the
              file instantly if it&apos;s no longer needed.
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ px: 4, pb: 4 }}>
              <LinearProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#777' }}>
                       <img src="/assets/assets/images/icon/empty.svg" alt="No data" style={{ width: 200, height: 200, opacity: 0.8 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {files.map((file) => (
                    <TableRow key={file.fileName}>
                      <TableCell sx={{ maxWidth: 260, overflow: 'hidden' }}>
                        <Tooltip title={file.fileName} arrow placement="top">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                            <Box
                              component="img"
                              src={getFileIcon(file.mimeType, file.fileName)}
                              alt="File type"
                              sx={{
                                width: 32,
                                height: 32,
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
                          <IconButton size="small" onClick={() => handleCopy(file.url)}>
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
                              disabled={deleting === file.fileUid}
                              onClick={() => handleDelete(file)}
                            >
                              {
                                deleting === file.fileUid ? (
                                  <CircularProgress
                                    size={16}
                            
                                    sx={{ color: 'inherit' }}
                                  />
                                ) :      <DeleteIcon fontSize="small" />
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
          )}
        </Paper>
      </Box>
    </Box>
  );
}


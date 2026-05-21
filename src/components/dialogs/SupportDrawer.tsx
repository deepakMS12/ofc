'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Headset, X } from 'lucide-react';
import { colors } from '@/utils/customColor';
import {
  supportApi,
  SUPPORT_CATEGORY_OPTIONS,
  type SupportCategory,
} from '@/lib/api/support';
import { useToast } from '@/hooks/useToast';

export interface SupportDrawerProps {
  open: boolean;
  onClose: () => void;
  initialCategory?: SupportCategory;
  initialSubject?: string;
}

export default function SupportDrawer({ open, onClose, initialCategory, initialSubject }: SupportDrawerProps) {
  const { showToast } = useToast();
  const [supportCategory, setSupportCategory] = useState<SupportCategory | ''>(initialCategory ?? '');
  const [supportSubject, setSupportSubject] = useState(initialSubject ?? '');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportAttachments, setSupportAttachments] = useState<File[]>([]);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const isLocked = Boolean(initialCategory);

  const handleClose = () => {
    setSupportCategory(initialCategory ?? '');
    setSupportSubject(initialSubject ?? '');
    setSupportMessage('');
    setSupportAttachments([]);
    onClose();
  };

  useEffect(() => {
    if (open) {
      setSupportCategory(initialCategory ?? '');
      setSupportSubject(initialSubject ?? '');
      document.body.style.overflow = 'hidden';
      if (isLocked) {
        setTimeout(() => messageRef.current?.focus(), 120);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, initialCategory, initialSubject, isLocked]);

  const handleAttachmentAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    e.target.value = '';
    const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const MAX_SIZE = 5 * 1024 * 1024;

    for (const file of incoming) {
      if (!ALLOWED.includes(file.type)) {
        showToast(`"${file.name}" is not allowed. Only images and PDFs are accepted.`, 'error');
        return;
      }
      if (file.size > MAX_SIZE) {
        showToast(`"${file.name}" exceeds the 5 MB limit.`, 'error');
        return;
      }
    }

    setSupportAttachments((prev) => {
      const merged = [...prev, ...incoming];
      if (merged.length > 2) {
        showToast('Maximum 2 attachments allowed.', 'error');
        return prev;
      }
      return merged;
    });
  };

  const handleAttachmentRemove = (index: number) => {
    setSupportAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSupportSubmit = async () => {
    if (!supportCategory || !supportSubject.trim() || !supportMessage.trim()) return;
    setIsSubmittingSupport(true);
    try {
      await supportApi.submitTicket({
        category: supportCategory,
        subject: supportSubject.trim(),
        message: supportMessage.trim(),
        attachments: supportAttachments.length ? supportAttachments : undefined,
      });
      showToast('Support ticket submitted successfully!', 'success');
      handleClose();
    } catch {
      showToast('Failed to submit ticket. Please try again.', 'error');
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: '35%' } }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Headset size={22} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              Contact Support
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#666' }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 5, backgroundColor: '#fafafa' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth disabled={isLocked}>
                <InputLabel id="support-category-label">Category</InputLabel>
                <Select
                  labelId="support-category-label"
                  label="Category"
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value as SupportCategory)}
                  sx={{ bgcolor: isLocked ? '#f5f5f5' : '#fafafa' }}
                >
                  {SUPPORT_CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Subject"
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                fullWidth
                disabled={isLocked}
                inputProps={{ maxLength: 150 }}
                helperText={isLocked ? undefined : `${supportSubject.length}/150`}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: isLocked ? '#f5f5f5' : '#fafafa' } }}
              />

              <TextField
                label="Message"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                fullWidth
                multiline
                rows={5}
                inputProps={{ maxLength: 2000, ref: messageRef }}
                helperText={`${supportMessage.length}/2000`}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fafafa' } }}
              />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    Attachments{' '}
                    <Typography component="span" variant="body2" sx={{ color: '#999', fontWeight: 400 }}>
                      (optional)
                    </Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {supportAttachments.length}/2 · Images & PDF · Max 5 MB
                  </Typography>
                </Box>
                {supportAttachments.map((file, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 1,
                      mb: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      bgcolor: '#fafafa',
                    }}
                  >
                    <AttachFileIcon sx={{ color: colors.primary, fontSize: 16, flexShrink: 0 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#333',
                        fontWeight: 500,
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999', flexShrink: 0 }}>
                      {(file.size / 1024).toFixed(0)} KB
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleAttachmentRemove(i)}
                      sx={{ color: '#bbb', '&:hover': { color: '#d32f2f' } }}
                    >
                      <X size={14} />
                    </IconButton>
                  </Box>
                ))}
                {supportAttachments.length < 2 && (
                  <Box
                    component="label"
                    htmlFor="support-file-input"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      border: '1px dashed #bdbdbd',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: '#fafafa',
                      '&:hover': { borderColor: colors.primary, bgcolor: '#f5f8ff' },
                      transition: 'all 0.15s',
                    }}
                  >
                    <AttachFileIcon sx={{ color: '#bdbdbd', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Click to attach a file
                    </Typography>
                  </Box>
                )}
                <input
                  id="support-file-input"
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                  onChange={handleAttachmentAdd}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              disableElevation
              fullWidth
              disabled={
                !supportCategory || !supportSubject.trim() || !supportMessage.trim() || isSubmittingSupport
              }
              onClick={() => void handleSupportSubmit()}
              sx={{
                py: 1.4,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 15,
                bgcolor: colors.primary,
                boxShadow: 'none',
                '&:hover': { bgcolor: colors.primary, filter: 'brightness(0.92)', boxShadow: 'none' },
              }}
            >
              {isSubmittingSupport ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Submit Ticket'
              )}
            </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

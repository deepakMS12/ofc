'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Divider } from '@mui/material';
import { X } from 'lucide-react';

interface FormattingHelpDialogProps {
  open: boolean;
  onClose: () => void;
}

type FormattingOption =
  | {
      title: string;
      description: string;
      example: string;
      result: string[];
      isList: true;
      isOrdered?: boolean;
      style?: React.CSSProperties;
    }
  | {
      title: string;
      description: string;
      example: string;
      result: string;
      style?: React.CSSProperties;
      isList?: false;
      isOrdered?: boolean;
    };

const formattingOptions: FormattingOption[] = [
  {
    title: 'Italic',
    description: 'To italicize your message, place an underscore on both sides of the text:',
    example: '_text_',
    result: 'text',
    style: { fontStyle: 'italic' },
  },
  {
    title: 'Bold',
    description: 'To bold your message, place an asterisk on both sides of the text:',
    example: '*text*',
    result: 'text',
    style: { fontWeight: 'bold' },
  },
  {
    title: 'Strikethrough',
    description: 'To strikethrough your message, place a tilde on both sides of the text:',
    example: '~text~',
    result: 'text',
    style: { textDecoration: 'line-through' },
  },
  {
    title: 'Monospace',
    description: 'To monospace your message, place three backticks on both sides of the text:',
    example: '```text```',
    result: 'text',
    style: { fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' },
  },
  {
    title: 'Inline Code',
    description: 'To add inline code to your message, place a backtick on both sides of the message:',
    example: '`text`',
    result: 'text',
    style: { fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '3px' },
  },
  {
    title: 'Bulleted List',
    description: 'To add a bulleted list to your message, place an asterisk or hyphen and a space before each word or sentence:',
    example: '* text\n* text\n\nOr\n\n- text\n- text',
    result: ['• text', '• text'],
    isList: true,
  },
  {
    title: 'Numbered List',
    description: 'To add a numbered list to your message, place a number, period, and space before each line of text:',
    example: '1. text\n2. text',
    result: ['1. text', '2. text'],
    isList: true,
    isOrdered: true,
  },
  {
    title: 'Quote',
    description: 'To add a quote to your message, place an angle bracket and space before the text:',
    example: '> text',
    result: 'text',
    style: { borderLeft: '3px solid #ccc', paddingLeft: '10px', color: '#666', fontStyle: 'italic' },
  },
];

export default function FormattingHelpDialog({ open, onClose }: FormattingHelpDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
          Text Formatting Guide
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#666' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {formattingOptions.map((option, index) => (
            <Box key={index}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                {option.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1.5 }}>
                {option.description}
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 1.5,
                  mb: 1,
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {option.example}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  Result:
                </Typography>
                {option.isList ? (
                  <Box component={option.isOrdered ? 'ol' : 'ul'} sx={{ m: 0, pl: 2 }}>
                    {option.result.map((item, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>
                        {item}
                      </li>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={option.style}>
                    {option.result}
                  </Typography>
                )}
              </Box>
              {index < formattingOptions.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}


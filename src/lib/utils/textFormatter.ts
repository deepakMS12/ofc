/**
 * Text formatting utilities for converting markdown-like syntax to formatted text
 */

export interface FormattingOptions {
  parseBold?: boolean;
  parseItalic?: boolean;
  parseStrikethrough?: boolean;
  parseMonospace?: boolean;
  parseInlineCode?: boolean;
  parseLists?: boolean;
  parseQuotes?: boolean;
}

/**
 * Converts markdown-like syntax to HTML formatted text
 */
export function formatText(text: string, options: FormattingOptions = {}): string {
  const {
    parseBold = true,
    parseItalic = true,
    parseStrikethrough = true,
    parseMonospace = true,
    parseInlineCode = true,
    parseLists = true,
    parseQuotes = true,
  } = options;

  // Escape HTML first (but preserve formatting markers)
  const lines = text.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Parse quotes first (before escaping)
    if (parseQuotes && /^> (.+)$/.test(line)) {
      const content = line.replace(/^> (.+)$/, '$1');
      const escaped = escapeHtml(content);
      // Process inline formatting in quotes
      let quoteContent = escaped;
      if (parseItalic) {
        quoteContent = quoteContent.replace(/_([^_\n]+)_/g, '<em>$1</em>');
      }
      if (parseBold) {
        quoteContent = quoteContent.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');
      }
      if (parseStrikethrough) {
        quoteContent = quoteContent.replace(/~([^~]+)~/g, '<del>$1</del>');
      }
      if (parseInlineCode) {
        quoteContent = quoteContent.replace(/`([^`\n]+)`/g, '<code style="font-family: monospace; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>');
      }
      processedLines.push(`<blockquote style="border-left: 3px solid #ccc; padding-left: 10px; margin: 5px 0; color: #666;">${quoteContent}</blockquote>`);
      continue;
    }

    // Parse numbered lists
    if (parseLists && /^\d+\. (.+)$/.test(line)) {
      const content = line.replace(/^\d+\. (.+)$/, '$1');
      const escaped = escapeHtml(content);
      // Process inline formatting in list items
      let listContent = escaped;
      if (parseItalic) {
        listContent = listContent.replace(/_([^_\n]+)_/g, '<em>$1</em>');
      }
      if (parseBold) {
        listContent = listContent.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');
      }
      if (parseStrikethrough) {
        listContent = listContent.replace(/~([^~]+)~/g, '<del>$1</del>');
      }
      if (parseInlineCode) {
        listContent = listContent.replace(/`([^`\n]+)`/g, '<code style="font-family: monospace; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>');
      }
      processedLines.push(`<li style="list-style-type: decimal;">${listContent}</li>`);
      continue;
    }

    // Parse bulleted lists (both * and -)
    if (parseLists && /^[-*] (.+)$/.test(line)) {
      const content = line.replace(/^[-*] (.+)$/, '$1');
      const escaped = escapeHtml(content);
      // Process inline formatting in list items
      let listContent = escaped;
      if (parseItalic) {
        listContent = listContent.replace(/_([^_\n]+)_/g, '<em>$1</em>');
      }
      if (parseBold) {
        listContent = listContent.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');
      }
      if (parseStrikethrough) {
        listContent = listContent.replace(/~([^~]+)~/g, '<del>$1</del>');
      }
      if (parseInlineCode) {
        listContent = listContent.replace(/`([^`\n]+)`/g, '<code style="font-family: monospace; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>');
      }
      processedLines.push(`<li style="list-style-type: disc;">${listContent}</li>`);
      continue;
    }

    // Regular line - escape and process
    line = escapeHtml(line);

    // Parse monospace blocks (three backticks) - must be done before inline code
    if (parseMonospace) {
      line = line.replace(/```([^`]+)```/g, '<code style="font-family: monospace; background: #f5f5f5; padding: 2px 4px; border-radius: 3px; display: block; white-space: pre-wrap;">$1</code>');
    }

    // Parse inline code (single backticks) - after monospace to avoid conflicts
    if (parseInlineCode) {
      line = line.replace(/(?<!`)`([^`\n]+)`(?!`)/g, '<code style="font-family: monospace; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">$1</code>');
    }

    // Parse strikethrough (tildes)
    if (parseStrikethrough) {
      line = line.replace(/~([^~]+)~/g, '<del>$1</del>');
    }

    // Parse bold (asterisks)
    if (parseBold) {
      line = line.replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>');
    }

    // Parse italic (underscores)
    if (parseItalic) {
      line = line.replace(/_([^_\n]+)_/g, '<em>$1</em>');
    }

    processedLines.push(line);
  }

  // Wrap consecutive list items
  let formatted = processedLines.join('\n');
  if (parseLists) {
    // Wrap numbered list items
    formatted = formatted.replace(/(<li[^>]*style="list-style-type: decimal;">.*?<\/li>\n?)+/g, (match) => {
      return `<ol style="margin: 5px 0; padding-left: 20px;">${match}</ol>`;
    });
    // Wrap bulleted list items
    formatted = formatted.replace(/(<li[^>]*style="list-style-type: disc;">.*?<\/li>\n?)+/g, (match) => {
      return `<ul style="margin: 5px 0; padding-left: 20px;">${match}</ul>`;
    });
  }

  // Convert newlines to <br> (but not inside block elements)
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Applies formatting to selected text in a contentEditable element
 */
export function applyFormatting(
  element: HTMLDivElement,
  formatType: 'bold' | 'italic' | 'strikethrough' | 'code' | 'quote' | 'list' | 'orderedList'
): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  if (!selectedText && formatType !== 'list' && formatType !== 'orderedList') {
    // If no text selected, insert formatting markers at cursor
    insertFormattingMarkers(element, range, formatType);
    return;
  }

  let formattedText = '';

  switch (formatType) {
    case 'bold':
      formattedText = `*${selectedText}*`;
      break;
    case 'italic':
      formattedText = `_${selectedText}_`;
      break;
    case 'strikethrough':
      formattedText = `~${selectedText}~`;
      break;
    case 'code':
      formattedText = `\`${selectedText}\``;
      break;
    case 'quote':
      formattedText = `> ${selectedText}`;
      break;
    case 'list':
      formattedText = `- ${selectedText}`;
      break;
    case 'orderedList':
      formattedText = `1. ${selectedText}`;
      break;
  }

  range.deleteContents();
  const textNode = document.createTextNode(formattedText);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  // Trigger input event to update state
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Inserts formatting markers at cursor position
 */
function insertFormattingMarkers(
  element: HTMLDivElement,
  range: Range,
  formatType: 'bold' | 'italic' | 'strikethrough' | 'code' | 'quote' | 'list' | 'orderedList'
): void {
  let markers = '';

  switch (formatType) {
    case 'bold':
      markers = '**';
      break;
    case 'italic':
      markers = '__';
      break;
    case 'strikethrough':
      markers = '~~';
      break;
    case 'code':
      markers = '``';
      break;
    case 'quote':
      markers = '> ';
      break;
    case 'list':
      markers = '- ';
      break;
    case 'orderedList':
      markers = '1. ';
      break;
  }

  const textNode = document.createTextNode(markers);
  range.insertNode(textNode);

  // Position cursor between markers for bold, italic, strikethrough, code
  if (formatType === 'bold' || formatType === 'italic' || formatType === 'strikethrough' || formatType === 'code') {
    const selection = window.getSelection();
    if (selection) {
      range.setStart(textNode, markers.length / 2);
      range.setEnd(textNode, markers.length / 2);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
}


import Swal from 'sweetalert2';

/**
 * SweetAlert2 utility functions
 * Used for confirm dialogs, prompts, and success messages with animations
 * Simple toast notifications should still use Snackbar
 */

interface ConfirmOptions {
  title?: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: 'warning' | 'error' | 'info' | 'question';
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  reverseButtons?: boolean;
}

interface PromptOptions {
  title?: string;
  text: string;
  inputPlaceholder?: string;
  inputValue?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  inputValidator?: (value: string) => string | null;
}

interface SuccessOptions {
  title?: string;
  text?: string;
  timer?: number;
  showConfirmButton?: boolean;
}

/**
 * Show a confirmation dialog
 * Returns true if confirmed, false if cancelled
 */
export const showConfirm = async (options: ConfirmOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title: options.title || 'Are you sure?',
    html: options.text,
    icon: options.icon || 'question',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Yes',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    confirmButtonColor: options.confirmButtonColor || '#0b996e',
    cancelButtonColor: options.cancelButtonColor || '#d33',
    reverseButtons: options.reverseButtons ?? true,
    animation: true,
    allowOutsideClick: false,
  });

  return result.isConfirmed;
};

/**
 * Show a prompt dialog
 * Returns the input value if confirmed, null if cancelled
 */
export const showPrompt = async (options: PromptOptions): Promise<string | null> => {
  const result = await Swal.fire({
    title: options.title || 'Input',
    text: options.text,
    input: 'text',
    inputPlaceholder: options.inputPlaceholder || '',
    inputValue: options.inputValue || '',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'OK',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    confirmButtonColor: '#0b996e',
    cancelButtonColor: '#d33',
    reverseButtons: true,
    animation: true,
    allowOutsideClick: false,
    inputValidator: options.inputValidator,
  });

  if (result.isConfirmed && result.value) {
    return result.value;
  }
  return null;
};

/**
 * Show a success message with animation
 * Use this for important success messages that need user attention
 * For simple notifications, use Snackbar instead
 */
export const showSuccessAlert = (options: SuccessOptions): void => {
  Swal.fire({
    title: options.title || 'Success!',
    text: options.text || '',
    icon: 'success',
    timer: options.timer || 3000,
    showConfirmButton: options.showConfirmButton !== false,
    confirmButtonColor: '#0b996e',
    animation: true,
  });
};

/**
 * Show an error alert with animation
 * Use this for important error messages that need user attention
 * For simple notifications, use Snackbar instead
 */
export const showErrorAlert = (title: string, text?: string): void => {
  Swal.fire({
    title,
    text: text || '',
    icon: 'error',
    confirmButtonColor: '#d33',
    animation: true,
  });
};


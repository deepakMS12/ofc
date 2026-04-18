/**
 * @deprecated Prefer `useToast` from `@/contexts/ToastContext` — same API, clearer name.
 * Kept as an alias so existing imports keep working; toasts render once via `ToastProvider`.
 */
export { useToast as useNotifier, useToast } from "@/contexts/ToastContext";
export type { ToastContextValue, ToastVariant } from "@/contexts/ToastContext";

export type WidgetErrorCategory =
  | 'CONFIG_ERROR'
  | 'NETWORK_ERROR'
  | 'RENDER_ERROR'
  | 'UNKNOWN_ERROR';

export type WidgetError = {
  category: WidgetErrorCategory;
  message: string;
  cause?: unknown;
  retryable?: boolean;
};

export function createError(category: WidgetErrorCategory, message: string, cause?: unknown, retryable = false): WidgetError {
  return { category, message, cause, retryable };
}

export function isRetryable(error: WidgetError): boolean {
  return Boolean(error.retryable);
}

export function categorizeError(error: unknown): WidgetErrorCategory {
  if (typeof error === 'object' && error && 'category' in error) {
    return (error as WidgetError).category;
  }
  return 'UNKNOWN_ERROR';
}

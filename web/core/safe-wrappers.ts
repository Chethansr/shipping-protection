import { Result, ok, err } from './result';
import { createError, type WidgetError } from '../errors/widget-error';

/**
 * Wraps an async function to never throw
 * Catches exceptions and returns Result<T, WidgetError>
 *
 * @example
 * const result = await safeWrapAsync(
 *   async () => fetchData(),
 *   'DataFetcher.fetchData'
 * );
 * if (result.ok) {
 *   console.log(result.value);
 * } else {
 *   console.error(result.error);
 * }
 */
export function safeWrapAsync<T>(
  fn: () => Promise<T>,
  context: string
): Promise<Result<T, WidgetError>> {
  return fn()
    .then((value) => ok(value))
    .catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      const widgetError = createError('UNKNOWN_ERROR', `${context}: ${message}`, error);
      return err(widgetError);
    });
}

/**
 * Wraps a sync function to never throw
 * Catches exceptions and returns Result<T, WidgetError>
 *
 * @example
 * const result = safeWrapSync(
 *   () => JSON.parse(data),
 *   'Parser.parse'
 * );
 * if (result.ok) {
 *   console.log(result.value);
 * } else {
 *   console.error(result.error);
 * }
 */
export function safeWrapSync<T>(
  fn: () => T,
  context: string
): Result<T, WidgetError> {
  try {
    return ok(fn());
  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    const widgetError = createError('UNKNOWN_ERROR', `${context}: ${message}`, error);
    return err(widgetError);
  }
}

/**
 * Debounces a function call, ensuring it only executes after a delay
 * Multiple rapid calls will cancel previous pending executions
 *
 * @param fn - Function to debounce
 * @param delayMs - Delay in milliseconds
 * @returns Debounced function that returns a Promise
 *
 * @example
 * const debouncedFetch = debounce(fetchData, 100);
 * debouncedFetch(params); // Cancels if called again within 100ms
 * debouncedFetch(params); // This one will execute after 100ms
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let latestResolve: ((value: any) => void) | null = null;
  let latestReject: ((error: any) => void) | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Cancel previous pending execution
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    return new Promise<ReturnType<T>>((resolve, reject) => {
      latestResolve = resolve;
      latestReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          latestResolve?.(result);
        } catch (error) {
          latestReject?.(error);
        }
      }, delayMs);
    });
  };
}

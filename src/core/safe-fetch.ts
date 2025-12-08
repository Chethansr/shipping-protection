import { Result, err, ok } from './result';
import { TIMEOUTS } from './timeouts';

export type SafeFetchOptions = RequestInit & { timeoutMs?: number };

export async function safeFetch(url: string | URL, options: SafeFetchOptions = {}): Promise<Result<Response, Error>> {
  const { timeoutMs = TIMEOUTS.API_CALL, signal, ...rest } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      signal: mergeSignals(signal, controller.signal)
    });
    return ok(response);
  } catch (e) {
    return err(e instanceof Error ? e : new Error('Network error'));
  } finally {
    clearTimeout(timeout);
  }
}

function mergeSignals(signalA?: AbortSignal | null, signalB?: AbortSignal): AbortSignal | undefined {
  if (!signalA) return signalB;
  if (!signalB) return signalA;

  const controller = new AbortController();

  const onAbortA = () => controller.abort(signalA.reason);
  const onAbortB = () => controller.abort(signalB.reason);

  signalA.addEventListener('abort', onAbortA, { once: true });
  signalB.addEventListener('abort', onAbortB, { once: true });

  if (signalA.aborted) controller.abort(signalA.reason);
  if (signalB.aborted) controller.abort(signalB.reason);

  return controller.signal;
}

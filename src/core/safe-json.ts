import { Result, err, ok } from './result';

export function safeJsonParse<T = unknown>(input: string): Result<T, Error> {
  try {
    return ok(JSON.parse(input) as T);
  } catch (e) {
    return err(e instanceof Error ? e : new Error('Failed to parse JSON'));
  }
}

export function safeJsonStringify(value: unknown): Result<string, Error> {
  try {
    return ok(JSON.stringify(value));
  } catch (e) {
    return err(e instanceof Error ? e : new Error('Failed to stringify JSON'));
  }
}

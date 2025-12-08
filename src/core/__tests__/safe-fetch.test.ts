import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeFetch } from '../safe-fetch';

const originalFetch = global.fetch;

describe('safeFetch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    global.fetch = originalFetch;
  });

  it('returns ok on successful fetch', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    global.fetch = vi.fn().mockResolvedValue(mockResponse) as unknown as typeof fetch;

    const result = await safeFetch('https://example.com');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(await result.value.text()).toBe('ok');
    }
  });

  it('returns err when upstream is already aborted', async () => {
    global.fetch = vi.fn().mockImplementation((_url, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        if (init?.signal?.aborted) {
          return reject(new DOMException('aborted', 'AbortError'));
        }
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('aborted', 'AbortError'));
        });
      });
    }) as unknown as typeof fetch;

    const controller = new AbortController();
    controller.abort();

    const result = await safeFetch('https://example.com', { signal: controller.signal });

    expect(result.ok).toBe(false);
  });
});

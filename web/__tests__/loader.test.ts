import { describe, expect, it, vi } from 'vitest';

vi.mock('../demo/hello-secure', () => ({}));
vi.mock('../components/narvar-shipping-protection-widget', () => ({}));

describe('loader stub queue replay', () => {
  it('drains _queue into real API on import', async () => {
    vi.resetModules();
    const queue: Array<[string, unknown[]]> = [['getVersion', []]];
    (globalThis as any).NarvarShippingProtection = { _queue: queue, _failed: false };

    const mod = await import('../index');
    const api = (globalThis as any).Narvar?.ShippingProtection;

    expect(api).toBeDefined();
    expect(api.getVersion).toBeTypeOf('function');
    expect(api._queue).toBeUndefined();
    expect(mod.getVersion()).toEqual(api.getVersion());
  });
});

import { safeJsonParse, safeJsonStringify } from '../safe-json';

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    const result = safeJsonParse<{ a: number }>("{\"a\":1}");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.a).toBe(1);
    }
  });

  it('returns err on invalid JSON', () => {
    const result = safeJsonParse('not-json');
    expect(result.ok).toBe(false);
  });
});

describe('safeJsonStringify', () => {
  it('stringifies serializable values', () => {
    const result = safeJsonStringify({ a: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('{"a":1}');
    }
  });

  it('returns err on circular structures', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {};
    obj.self = obj;
    const result = safeJsonStringify(obj);
    expect(result.ok).toBe(false);
  });
});

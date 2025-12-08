import { describe, expect, it } from 'vitest';
import { readStorage, removeStorage, writeStorage } from '../storage';

describe('storage helpers', () => {
  it('writes, reads, and removes values', () => {
    const key = 'secure:test';
    expect(writeStorage(key, '123', 'local')).toBe(true);
    expect(readStorage(key, 'local')).toBe('123');
    expect(removeStorage(key, 'local')).toBe(true);
    expect(readStorage(key, 'local')).toBe(null);
  });
});

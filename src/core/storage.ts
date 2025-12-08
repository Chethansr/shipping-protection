export type StorageKind = 'local' | 'session';

function getStorage(kind: StorageKind): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch (e) {
    return null;
  }
}

export function readStorage(key: string, kind: StorageKind = 'local'): string | null {
  const store = getStorage(kind);
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, kind: StorageKind = 'local'): boolean {
  const store = getStorage(kind);
  if (!store) return false;
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string, kind: StorageKind = 'local'): boolean {
  const store = getStorage(kind);
  if (!store) return false;
  try {
    store.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

import { webStorageError } from './errors';

export class PersistentStorage {
  storage?: Storage;
  isAvailable: boolean = false;

  constructor(type: 'local' | 'session') {
    try {
      const testKey = '__storage_test__';
      this.storage = type === 'local' ? localStorage : sessionStorage;
      this.storage.setItem(testKey, testKey);
      this.storage.removeItem(testKey);
      this.isAvailable = true;
    } catch (error) {
      this.isAvailable = false;
      webStorageError('ExpectedError', 'Storage not available', {
        originalError: error,
      }).emit();
    }
  }

  get<T = unknown>(key: string): T | undefined {
    if (!this.isAvailable || !this.storage) {
      return undefined;
    }

    try {
      const storageValue = this.storage.getItem(key);

      if (storageValue === null || storageValue === 'undefined') {
        return undefined;
      }

      return JSON.parse(storageValue) as T;
    } catch (error) {
      webStorageError('ExpectedError', 'Error getting value', {
        originalError: error,
      }).emit();
      return undefined;
    }
  }

  set(key: string, value: unknown): boolean {
    if (!this.isAvailable || !this.storage) {
      return false;
    }

    try {
      if (value === undefined) {
        this.storage.removeItem(key);
        return true;
      }

      const stringifiedValue = JSON.stringify(value);
      this.storage.setItem(key, stringifiedValue);
      return true;
    } catch (error) {
      const isQuotaExceeded =
        error instanceof DOMException &&
        (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');

      webStorageError('ExpectedError', isQuotaExceeded ? 'Storage quota exceeded' : 'Error setting value', {
        originalError: error,
      }).emit();
      return false;
    }
  }

  has(key: string): boolean {
    if (!this.isAvailable || !this.storage) {
      return false;
    }

    return this.storage.getItem(key) !== null;
  }

  remove(key: string): boolean {
    if (!this.isAvailable || !this.storage) {
      return false;
    }

    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      webStorageError('ExpectedError', 'Error removing value', {
        originalError: error,
      }).emit();
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable || !this.storage) {
      return false;
    }

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      webStorageError('ExpectedError', 'Error clearing storage', {
        originalError: error,
      }).emit();
      return false;
    }
  }

  get length(): number {
    if (!this.isAvailable || !this.storage) {
      return 0;
    }
    return this.storage.length;
  }
}

export const localStorageWrapper = new PersistentStorage('local');
export const sessionStorageWrapper = new PersistentStorage('session');

/**
 * web
 * @date 2025/3/22
 */
import { IPlatformAdapter, IPlatformStorage } from "./PlatformConst";

export class WebAdapter implements IPlatformAdapter {
  private _storage: IPlatformStorage;
  public get storage(): IPlatformStorage {
    if (!this._storage) {
      this._storage = new WebPlatformStorage();
    }
    return this._storage;
  }
}

export class WebPlatformStorage implements IPlatformStorage {
  setItem(key: string, val: any, callback?: (success?: boolean) => void): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      if (callback) {
        callback(true);
      }
    } catch (e) {
      if (callback) {
        callback(false);
      }
    }
  }

  getItem<T = any>(key: string, callback?: (data?: T) => void): T {
    try {
      const data = localStorage.getItem(key);
      const parsed = data ? JSON.parse(data) : null;
      if (callback) {
        callback(parsed);
      }
      return parsed;
    } catch (e) {
      if (callback) {
        callback(undefined);
      }
      return undefined;
    }
  }

  removeItem(key: string, callback?: (success?: boolean) => void): void {
    try {
      localStorage.removeItem(key);
      if (callback) {
        callback(true);
      }
    } catch (e) {
      if (callback) {
        callback(false);
      }
    }
  }

  clear(): void {
    localStorage.clear();
  }
}
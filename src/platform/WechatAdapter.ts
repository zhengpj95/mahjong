/**
 * wx
 * @date 2025/3/22
 */
import { IPlatformAdapter, IPlatformStorage } from "./PlatformConst";

export class WechatAdapter implements IPlatformAdapter {
  private _storage: IPlatformStorage;
  public get storage(): IPlatformStorage {
    if (!this._storage) {
      this._storage = new WechatPlatformStorage();
    }
    return this._storage;
  }

}

export class WechatPlatformStorage implements IPlatformStorage {
  clear(): void {
    wx.clearStorage();
  }

  getItem<T = any>(key: string, callback?: (data?: T) => void): T {
    try {
      wx.getStorage({
        key: key,
        success: (result): void => {
          if (callback) callback(JSON.parse(result.data));
        },
        fail: () => {
          if (callback) callback(undefined);
        },
        complete: () => {
          //
        }
      });
    } catch (e) {
      return undefined;
    }
  }

  removeItem(key: string, callback?: (success?: boolean) => void): void {
    try {
      wx.removeStorage({
        key: key,
        success: (): void => {
          if (callback) callback(true);
        },
        fail: () => {
          if (callback) callback(false);
        },
        complete: () => {
          //
        }
      });
    } catch (e) {
      if (callback) callback(false);
    }
  }

  setItem(key: string, val: any, callback?: (success?: boolean) => void): void {
    try {
      wx.setStorage({
        key: key,
        data: JSON.stringify(val),
        success: (): void => {
          if (callback) callback(true);
        },
        fail: () => {
          if (callback) callback(false);
        },
        complete: () => {
          //
        }
      });
    } catch (e) {
      if (callback) callback(false);
    }
  }
}
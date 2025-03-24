/**
 * @date 2025/3/22
 */

export enum PlatformType {
  WX = "wx",
  TT = "tt",
  QQ = "qq",
  WEB = "web",
  UNKNOWN = "unknown"
}

// 平台统一接口，适配器模式
export interface IPlatformAdapter {
  login?: () => void;
  share?: () => void;
  pay?: () => void;

  readonly storage: IPlatformStorage;
}

// 缓存系统
export interface IPlatformStorage {
  setItem(key: string, val: any, callback?: (success?: boolean) => void): void;

  getItem<T = any>(key: string, callback?: (data?: T) => void): T;

  removeItem(key: string, callback?: (success?: boolean) => void): void;

  clear: () => void;
}
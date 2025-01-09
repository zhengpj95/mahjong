/**
 * @date 2025/1/9
 */
export class DebugUtils {
  public static debug(key: string, cls: any): void {
    if (!key || !cls) {
      return;
    }
    if (window) {
      window[key] = cls;
    }
  }
}
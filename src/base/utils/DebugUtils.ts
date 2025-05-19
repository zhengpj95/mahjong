/**
 * @date 2025/1/9
 */
export class DebugUtils {
  public static debug(key: string, cls: any): void {
    if (!key || !cls) {
      return;
    }
    if (window) {
      (window as any)[key] = cls;
    }
  }

  public static debugClass(cls: any): void {
    if (!cls) {
      return;
    }
    const name = cls.constructor && cls.constructor.name;
    if (window && name) {
      window[name] = cls;
    }
  }

  public static showDebug = false;

  public static debugLog(str: string | number | any): void {
    if (this.showDebug) {
      console.log(`DebugLog: `, str);
    }
  }
}

DebugUtils.debug("DebugUtils", DebugUtils);
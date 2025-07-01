/**
 * @date 2025/1/9
 */
export class DebugUtils {
  public static debug(key: string, cls: any): void {
    if (!key || !cls) {
      return;
    }
    if (globalThis) {
      (globalThis as any)[key] = cls;
    }
  }

  public static debugClass(cls: any): void {
    if (!cls) {
      return;
    }
    const name = cls.constructor && cls.constructor.name;
    if (globalThis && name) {
      (globalThis as any)[name] = cls;
    }
  }
}

DebugUtils.debug("DebugUtils", DebugUtils);

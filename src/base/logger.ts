/**
 * @author zpj
 * @date 2025/4/29
 */

function pad(n: number, len = 2): string {
  const str = "0".repeat(len) + n.toString();
  return str.slice(-len);
}

function getTimestamp(): string {
  const now = new Date();
  return `[${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}]`;
}

function wrapConsoleMethod(originalMethod: (...args: any[]) => void, color: string = ""): (...args: any[]) => void {
  return (...args: any[]) => {
    const timestamp = getTimestamp();
    const prefix = `${timestamp} zpj `;
    const style = color ? `color: ${color}; font-weight: false;` : "";
    originalMethod(`%c${prefix}`, style, ...args);
  };
}

let originalMethods: Partial<Record<keyof Console, (...args: any[]) => void>> = {};

export function initEnhancedConsole(): void {
  if (!originalMethods.log) {
    // 备份原始方法
    originalMethods.log = console.log;
    originalMethods.warn = console.warn;
    originalMethods.error = console.error;
    originalMethods.info = console.info;
    originalMethods.debug = console.debug;

    // 重写
    console.log = wrapConsoleMethod(console.log);
    console.warn = wrapConsoleMethod(console.warn);
    console.error = wrapConsoleMethod(console.error, "red");
    console.info = wrapConsoleMethod(console.info, "deepskyblue");
    console.debug = wrapConsoleMethod(console.debug, "violet");
  }
}

export function restoreOriginalConsole(): void {
  if (originalMethods.log) {
    // 还原
    console.log = originalMethods.log!;
    console.warn = originalMethods.warn!;
    console.error = originalMethods.error!;
    console.info = originalMethods.info!;
    console.debug = originalMethods.debug!;
    originalMethods = {};
  }
}

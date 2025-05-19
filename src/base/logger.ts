/**
 * @author zpj
 * @date 2025/4/29
 */

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
  debug: 5,
};

const LEVEL_ICON: Record<LogLevel, string> = {
  log: "📘",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
  debug: "🐞",
};

const LEVEL_STYLES: Record<LogLevel, { color: string; background?: string }> = {
  debug: { color: "white", background: "purple" },
  log: { color: "black", background: "#e0e0e0" },
  info: { color: "white", background: "deepskyblue" },
  warn: { color: "black", background: "gold" },
  error: { color: "white", background: "crimson" },
};

// 设置当前日志等级过滤
const FILTER_LEVEL = "warn";

function pad(n: number, len = 2, prefix = "0"): string {
  const str = prefix.repeat(len) + n.toString();
  return str.slice(-len);
}

function padString(n: string, len = 5, prefix = " "): string {
  const nLen = n.length;
  const difLen = len - nLen;
  return prefix.repeat(Math.ceil(difLen / 2)) + n + prefix.repeat(Math.floor(difLen / 2));
}

function getTimestamp(): string {
  const now = new Date();
  return `[${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}]`;
}

function wrapConsoleMethod(originalMethod: (...args: any[]) => void, color: string = "", name = ""): (...args: any[]) => void {
  return (...args: any[]) => {
    const logLevel = name || originalMethod.name;
    if (LOG_LEVEL_ORDER[logLevel] > LOG_LEVEL_ORDER[FILTER_LEVEL]) {
      return undefined;
    }
    const timestamp = getTimestamp();
    const logName = padString(logLevel, 5, " ");
    const icon = LEVEL_ICON[logLevel] || "";
    const prefix = `${timestamp}`;
    const style = color ? `background: ${color}; padding: 2px 4px; border-radius: 3px;` : "";
    originalMethod.call(console, `%c${logName}`, style, icon, prefix, ...args);
  };
}

let _originalMethods: Partial<Record<keyof Console, (...args: any[]) => void>> = {};

export function initEnhancedConsole(): void {
  if (!_originalMethods.log) {
    // 备份原始方法
    _originalMethods.log = console.log;
    _originalMethods.warn = console.warn;
    _originalMethods.error = console.error;
    _originalMethods.info = console.info;
    _originalMethods.debug = console.debug;

    // 重写
    console.warn = wrapConsoleMethod(console.log, "gold", "warn"); // 用log来处理warn，去掉warn默认的一整行都有颜色的默认处理
    console.error = wrapConsoleMethod(console.log, "red", "error");// 同上

    console.info = wrapConsoleMethod(console.info, "deepskyblue");
    console.debug = wrapConsoleMethod(console.debug, "violet");
    console.log = wrapConsoleMethod(console.log, "#909090");
  }
}

export function restoreOriginalConsole(): void {
  if (_originalMethods.log) {
    // 还原
    console.log = _originalMethods.log!;
    console.warn = _originalMethods.warn!;
    console.error = _originalMethods.error!;
    console.info = _originalMethods.info!;
    console.debug = _originalMethods.debug!;
    _originalMethods = {};
  }
}

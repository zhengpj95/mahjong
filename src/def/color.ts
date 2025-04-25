/**
 * @date 2025/4/25
 */

// 通用颜色管理模块，用于统一管理游戏中的色值
export const enum UIColorStr {
  // 主色
  RED = "#E64545",          // 错误/敌人/伤害提示
  GREEN = "#4CAF50",        // 成功/回血
  BLUE = "#2196F3",         // 技能/冷却时间
  ORANGE = "#FF9800",       // 中性提醒
  YELLOW = "#FFEB3B",       // 强调数值/重要提示

  // 文字色
  WHITE = "#FFFFFF",        // 白字
  BLACK = "#212121",        // 黑字
  GRAY = "#9E9E9E",         // 次要文字/禁用
  DARK_GRAY = "#616161",     // 深灰（分隔线/弱状态）

  // 背景色
  BG_DARK = "#1E1E1E",       // 深色背景
  BG_LIGHT = "#F5F5F5",      // 浅色背景

  // 专用条颜色
  HP_RED = "#FF3B30",        // 生命条（HP）
  MP_BLUE = "#007AFF",       // 法力/能量条（MP）
}

//黑底颜色
export const enum UIColorStr1 {
  GRAY = "#a8b6ba",
  YELLOW = "#ffff00",
  WHITE = "#ffffff",
  GREEN = "#00ff00",
  BLUE = "#00d4ff",
  PURPLE = "#f02bff",
  ORANGE = "#ff7800",
  RED = "#ff0000",
  PINK = "#ff4192",
  DARK_YELLOW = "#EBD196",
}

//白底颜色
export const enum UIColorStr2 {
  GRAY = "#a8b6ba",
  YELLOW = "#edb214",
  WHITE = "#426e7b",
  GREEN = "#0f9b2c",
  BLUE = "#007ac7",
  PURPLE = "#a200ff",
  ORANGE = "#b96800",
  RED = "#d40808",
  PINK = "#ff4192",
  DARK_YELLOW = "#EBD196",
}

/**
 * @author zpj
 * @date 2025/2/16
 */
export class StringUtils {
  public static ChineseNum: string[] = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
  ];
  public static ChineseWeekNum: string[] = [
    "日",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日",
  ];
  public static ChineseWeekNum2: string[] = [
    "周日",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
    "周日",
  ];

  /**
   * 拼接字符串，比如将 "1" 拼成 "0001"
   * @param {string} str
   * @param {number} totalLen
   * @param {string} paddingChar
   * @returns {string}
   */
  public static padString(
    str: string,
    totalLen: number,
    paddingChar: string = "0",
  ): string {
    let n: number = +totalLen | 0;
    if (paddingChar == null || n === 0) {
      return str;
    }
    let i: number;
    const buf: string[] = [];
    for (i = 0, n = Math.abs(n) - str.length; i < n; i++) {
      buf.push(paddingChar);
    }
    if (totalLen < 0) {
      buf.unshift(str);
    } else {
      buf.push(str);
    }
    return buf.join("");
  }
}

import { StringUtils } from "./StringUtils";

export const Second = {
  Day: 86400,
  Hour: 3600,
  Minute: 60
};

const WeekChinese = ["日", "一", "二", "三", "四", "五", "六", "日"];

export const enum LauncherLan {
  Week_0 = "星期日",
  Week_1 = "星期一",
  Week_2 = "星期二",
  Week_3 = "星期三",
  Week_4 = "星期四",
  Week_5 = "星期五",
  Week_6 = "星期六",

  Zhou_0 = "周日",
  Zhou_1 = "周一",
  Zhou_2 = "周二",
  Zhou_3 = "周三",
  Zhou_4 = "周四",
  Zhou_5 = "周五",
  Zhou_6 = "周六",
}

const WeekName = [
  LauncherLan.Week_0,
  LauncherLan.Week_1,
  LauncherLan.Week_2,
  LauncherLan.Week_3,
  LauncherLan.Week_4,
  LauncherLan.Week_5,
  LauncherLan.Week_6,
  LauncherLan.Week_0
];

const ZhouName = [
  LauncherLan.Zhou_0,
  LauncherLan.Zhou_1,
  LauncherLan.Zhou_2,
  LauncherLan.Zhou_3,
  LauncherLan.Zhou_4,
  LauncherLan.Zhou_5,
  LauncherLan.Zhou_6,
  LauncherLan.Zhou_0
];

/**
 * @author zpj
 * @date 2025/2/16
 */
export class TimeUtils {
  /** @internal */ private static _tmpDate: Date = new Date();
  /** @internal */ private static _tmpObj: { [key: string]: string } = {};

  /** @internal */ private static _tmpReplacer(k: string): string {
    let obj = TimeUtils._tmpObj;
    let type = k.charAt(0);
    let v = obj[type];
    if (type === "E") {
      let day = WeekChinese.indexOf(v);
      return k.length <= 2 ? ZhouName[day] : WeekName[day];
    }
    if (v.length < k.length) {
      return StringUtils.padString(v, k.length);
    }
    return v;
  }

  /**
   * 格式化时间戳，毫秒
   * @param {number} time 时间戳，毫秒
   * @param {string} [format=yyyy-MM-dd HH:mm:ss.SSS] y年，q季，M月，E星期，d日，h时（12小时），H时，m分，s秒，S毫秒
   * @returns {string}
   */
  public static formatTime(time: number, format: string = "yyyy-MM-dd HH:mm:ss.SSS"): string {
    let date: Date = this._tmpDate;
    date.setTime(time);
    let obj = this._tmpObj;
    obj["y"] = "" + date.getFullYear();
    obj["q"] = "" + Math.floor((date.getMonth() + 3) / 3);
    obj["M"] = "" + (date.getMonth() + 1);
    obj["E"] = WeekChinese[date.getDay()];
    obj["d"] = "" + date.getDate();
    obj["h"] = "" + (date.getHours() % 12 === 0 ? 12 : date.getHours() % 12);
    obj["H"] = "" + date.getHours();
    obj["m"] = "" + date.getMinutes();
    obj["s"] = "" + date.getSeconds();
    obj["S"] = "" + date.getMilliseconds();
    return format.replace(/y+|q+|M+|E+|d+|h+|H+|m+|s+|S+/g, this._tmpReplacer);
  }

  /**
   * 格式化时间戳，秒
   * @param {number} second 时间戳，秒
   * @param {string} [format=yyyy-MM-dd HH:mm:ss] y年，q季，M月，E星期，d日，h时（12小时），H时，m分，s秒，S毫秒
   * @returns {string}
   */
  public static formatTimeSecond(second: number, format: string = "yyyy-MM-dd HH:mm:ss"): string {
    return this.formatTime(second * 1000, format);
  }

  /**
   * 格式化剩余时间，秒
   * @param {number} second 时间，秒
   * @param {string} [format=dd:HH:mm:ss] d日，H时，m分，s秒
   * @param {boolean} adaption 是否自适应，比如显示d日，H时的，小于一小时时显示成m分，s秒
   * @returns {string}
   */
  public static formatSecond(second: number, format: string = "dd:HH:mm:ss", adaption: boolean = false): string {
    let obj = this._tmpObj;
    let remain: number = second;
    if (adaption) {
      if (remain < Second.Hour) {
        format = "m分s秒";//转换显示文本
      } else if (remain < Second.Day) {
        format = "H时m分";//转换显示文本
      }
    }
    obj["y"] = "";
    obj["q"] = "";
    obj["M"] = "";
    obj["E"] = "";
    if (format.indexOf("d") > -1) {
      obj["d"] = "" + Math.floor(remain / Second.Day);
      remain = remain % Second.Day;
    } else {
      obj["d"] = "";
    }
    obj["h"] = "";
    if (format.indexOf("H") > -1) {
      obj["H"] = "" + Math.floor(remain / Second.Hour);
      remain = remain % Second.Hour;
    } else {
      obj["H"] = "";
    }
    if (format.indexOf("m") > -1) {
      obj["m"] = "" + Math.floor(remain / Second.Minute);
      remain = remain % Second.Minute;
    } else {
      obj["m"] = "";
    }
    if (format.indexOf("s") > -1) {
      obj["s"] = "" + Math.floor(remain % Second.Minute);
    } else {
      obj["s"] = "";
    }
    obj["S"] = "";
    return format.replace(/y+|M+|d+|H+|m+|s+|S+/g, this._tmpReplacer);
  }

}

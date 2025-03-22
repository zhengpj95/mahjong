/**
 * @date 2025/3/22
 */
import { PlatformType } from "./PlatformConst";

export class Platform {
  public static get platform(): PlatformType {
    if (typeof wx !== "undefined" && wx.getSystemInfoSync) {
      return PlatformType.WX;
    } else if (typeof window !== "undefined") {
      return PlatformType.WEB;
    } else {
      return PlatformType.UNKNOWN;
    }
  }

  public static get isWx(): boolean {
    return this.platform === PlatformType.WX;
  }

  public static get isWeb(): boolean {
    return this.platform === PlatformType.WEB;
  }
}
/**
 * @date 2025/3/22
 */
import { IPlatformAdapter, PlatformType } from "./PlatformConst";
import { Platform } from "./Platform";
import { WechatAdapter } from "./WechatAdapter";
import { WebAdapter } from "./WebAdapter";

export class AdapterFactory {
  public static getAdapter(): IPlatformAdapter {
    switch (Platform.platform) {
      case PlatformType.WX:
        console.log(`wx adapter...`);
        return new WechatAdapter();
      case PlatformType.WEB:
        console.log(`web adapter...`);
        return new WebAdapter();
      default:
        throw new Error(`Unsupported platform!`);
    }
  }
}
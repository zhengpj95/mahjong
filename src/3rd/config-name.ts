/** 关联配置表名称 */
import { MahjongCardConfig, MahjongLevelConfig } from "./config";

/**配置表名*/
export const enum ConfigName {
  MAHJONG_CARD = "MahjongCardConfig",
  MAHJONG_LEVEl = "MahjongLevelConfig",
}

export interface ConfigMap {
  [ConfigName.MAHJONG_CARD]: MahjongCardConfig;
  [ConfigName.MAHJONG_LEVEl]: MahjongLevelConfig;
}

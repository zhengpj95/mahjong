/** 关联配置表名称 */
import { MahjongCardConfig, MahjongLevelConfig } from "./config";

/**配置表名*/
export const enum ConfigName {
  CARD = "MahjongCardConfig",
  LEVEl = "MahjongLevelConfig",
}

export interface ConfigMap {
  [ConfigName.CARD]: MahjongCardConfig;
  [ConfigName.LEVEl]: MahjongLevelConfig;
}

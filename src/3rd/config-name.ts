/** 关联配置表名称 */
import { CardConfig, LevelConfig } from "./config";

/**配置表名*/
export const enum ConfigName {
  CARD = "CardConfig",
  LEVEl = "LevelConfig",
}

export interface ConfigMap {
  [ConfigName.CARD]: CardConfig;
  [ConfigName.LEVEl]: LevelConfig;
}

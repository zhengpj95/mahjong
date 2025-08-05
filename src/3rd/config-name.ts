/** 关联配置表名称 */
import { CardConfig, LevelConfig } from "./config";

// 多维表定义
type ConfigMap2<K extends ConfigName> = Record<
  string,
  Record<string, ConfigMap[K]>
>;
type ConfigMap3<K extends ConfigName> = Record<
  string,
  Record<string, Record<string, ConfigMap[K]>>
>;

/**配置表名*/
export const enum ConfigName {
  CARD = "CardConfig",
  LEVEl = "LevelConfig",
}

export interface ConfigMap {
  [ConfigName.CARD]: CardConfig;
  [ConfigName.LEVEl]: LevelConfig;
}

export interface ConfigMultiMap<K extends ConfigName> {
  // todo
  // [ConfigName.CARD]: ConfigMap2<K>;
}

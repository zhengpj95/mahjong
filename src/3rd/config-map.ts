/**
 * @author zpj
 * @date 2025/8/11
 */
import { ConfigMap, ConfigName } from "@config/config-name";

// 多维表定义
type ConfigMap2<K extends ConfigName> = Record<
  string,
  Record<string, ConfigMap[K]>
>;
type ConfigMap3<K extends ConfigName> = Record<
  string,
  Record<string, Record<string, ConfigMap[K]>>
>;

export interface ConfigMultiMap<K extends ConfigName> {
  // todo
  // [ConfigName.CARD]: ConfigMap2<K>;
}

import TextResource = Laya.TextResource;
import { DebugUtils } from "@base/utils/DebugUtils";
import { ConfigMap, ConfigMultiMap } from "@configName";

type ConfigName = keyof ConfigMap; // 单key、多key
type ConfigMultiName<K extends ConfigName> = keyof ConfigMultiMap<K>; // 多key
type ConfigTableMap<K extends ConfigName> = Omit<ConfigMap, ConfigMultiName<K>>; // 单key，集合中的差集
type ConfigTableName<K extends ConfigName> = keyof ConfigTableMap<K>; // 单key

/**
 * @author zpj
 * @date 2025/3/19
 */
export class GameCfg {
  private static jsonPath = "resources/json/";
  private static jsonCfgListPath = "resources/json/cfglist.json";
  public static cfgMap: {
    [key in ConfigName]?: Record<string, ConfigMap[key]>;
  } = {};
  public static cfgListMap: { [key in ConfigName]?: ConfigMap[key][] } = {};

  public static init(): void {
    Laya.loader
      .load(this.jsonCfgListPath, null, null, Laya.Loader.JSON, 0)
      .then((value: TextResource): void => {
        this.onLoaded(value?.data ?? []);
      });
  }

  private static onLoaded(data: string[]): void {
    if (data && data.length) {
      for (const jsonName of data) {
        Laya.loader
          .load(this.jsonPath + jsonName, null, null, Laya.Loader.JSON, 0)
          .then((value: TextResource): void => {
            const name = <ConfigName>jsonName.replace(".json", "");
            this.onLoadedJson(name, value?.data ?? {});
          });
      }
    }
  }

  private static onLoadedJson(jsonName: ConfigName, data: any): void {
    this.cfgMap[jsonName] = data;

    const list: any[] = [];
    for (const key in data) {
      list.push(data[key]);
    }
    this.cfgListMap[jsonName] = list;
  }

  /**获取配置单项，单key*/
  public static getCfgByNameId<K extends ConfigTableName<K>>(
    cfgName: K,
    id: number | string,
  ): ConfigMap[K] | undefined {
    const obj = this.cfgMap[cfgName];
    return obj ? obj[id] : undefined;
  }

  /**获取配置列表，单key或多key*/
  public static getCfgListByName<K extends ConfigName>(
    cfgName: K,
  ): ConfigMap[K][] {
    return this.cfgListMap[cfgName] || [];
  }

  /**获取配置整表，多key*/
  public static getCfgListMoreByName<K extends ConfigMultiName<K>>(
    cfgName: K,
  ): ConfigMultiMap<K>[K] | undefined {
    return this.cfgMap[cfgName];
  }

  /**获取配置整表，单key*/
  public static getCfgByName<K extends ConfigTableName<K>>(
    name: K,
  ): Record<string, ConfigMap[K]> | undefined {
    return this.cfgMap[name];
  }
}

DebugUtils.debug("GameCfg", GameCfg);

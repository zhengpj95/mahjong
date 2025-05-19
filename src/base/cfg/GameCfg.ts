import TextResource = Laya.TextResource;
import { DebugUtils } from "@base/utils/DebugUtils";

/**
 * @author zpj
 * @date 2025/3/19
 */
export class GameCfg {
  private static jsonPath = "resources/json/";
  private static jsonCfgListPath = "resources/json/cfglist.json";
  public static cfgMap: {
    [cfgName: string]: Record<string, any>;
  } = {};
  public static cfgListMap: { [cfgName: string]: any[] } = {};

  public static init(): void {
    Laya.loader.load(
      this.jsonCfgListPath,
      null,
      null,
      Laya.Loader.JSON,
      0,
    ).then((value: TextResource): void => {
      this.onLoaded(value?.data ?? []);
    });
  }

  private static onLoaded(data: string[]): void {
    if (data && data.length) {
      for (const jsonName of data) {
        Laya.loader.load(
          this.jsonPath + jsonName,
          null,
          null,
          Laya.Loader.JSON,
          0,
        ).then(value => {
          this.onLoadedJson(jsonName, value?.data ?? {});
        });
      }
    }
  }

  private static onLoadedJson(jsonName: string, data: any): void {
    // console.log(jsonName, data);
    jsonName = jsonName.replace(".json", "");
    this.cfgMap[jsonName] = data;

    const list: any[] = [];
    for (const key in data) {
      list.push(data[key]);
    }
    this.cfgListMap[jsonName] = list;
  }

  /**获取配置列表*/
  public static getCfgListByName<T>(cfgName: string): T[] {
    return this.cfgListMap[cfgName] || [];
  }

  /**获取配置单项*/
  public static getCfgByNameId<T>(cfgName: string, id: number | string): T | undefined {
    const obj = this.cfgMap[cfgName];
    return obj ? obj[id] : undefined;
  }
}

DebugUtils.debug("GameCfg", GameCfg);

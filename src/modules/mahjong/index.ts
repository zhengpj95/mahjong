import BaseModule = base.BaseModule;
import { ModuleType, ProxyType } from "@def/module-type";
import { MahjongProxy } from "./model/MahjongProxy";

/**
 * @author zpj
 * @date 2025/4/29
 */
export class MahjongModule extends BaseModule {
  constructor() {
    super(ModuleType.MAHJONG);
  }

  protected initCmd(): void {
  }

  protected initMdr(): void {
  }

  protected initProxy(): void {
    this.regProxy(ProxyType.MAHJONG, MahjongProxy);
  }

}
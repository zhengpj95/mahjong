import BaseModule = base.BaseModule;
import { ModuleName, ProxyType } from "@def/module-name";
import { MahjongProxy } from "./model/MahjongProxy";
import { MahjongViewType } from "@def/mahjong";
import MahjongHomeMdr from "./view/MahjongHomeMdr";
import MahjongMdr from "./view/MahjongMdr";
import MahjongResultMdr from "./view/MahjongResultMdr";

/**
 * @author zpj
 * @date 2025/4/29
 */
export class MahjongModule extends BaseModule {
  constructor() {
    super(ModuleName.MAHJONG);
  }

  protected initCmd(): void {
    //
  }

  protected initMdr(): void {
    this.regMdr(MahjongViewType.HOME, MahjongHomeMdr);
    this.regMdr(MahjongViewType.MAIN, MahjongMdr);
    this.regMdr(MahjongViewType.RESULT, MahjongResultMdr);
  }

  protected initProxy(): void {
    this.regProxy(ProxyType.MAHJONG, MahjongProxy);
  }
}

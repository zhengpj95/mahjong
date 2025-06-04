import BaseMediator = base.BaseMediator;
import facade = base.facade;
import LayerIndex = base.LayerIndex;
import { ModuleName } from "@def/module-name";
import { MahjongViewType } from "@def/mahjong";
import { HoodleViewType } from "@def/hoodle";
import { MahjongHomeView } from "@3rd-types/mahjong";

/**
 * @author zpj
 * @date 2025/1/21
 */
export default class MahjongHomeMdr extends BaseMediator<MahjongHomeView> {

  constructor() {
    super(LayerIndex.MAIN, "scene/mahjong/MahjongHome.ls");
  }

  protected addEvents(): void {
    //
  }

  protected initUI(): void {
    //
  }

  protected onClose(): void {
    //
  }

  protected onOpen(): void {
    this.ui.$btnHoodle.visible = _DEBUG_ ?? false;
  }

  // noinspection JSUnusedGlobalSymbols
  public onClickBtnStart(): void {
    this.close();
    facade.openView(ModuleName.MAHJONG, MahjongViewType.MAIN);
  }

  // noinspection JSUnusedGlobalSymbols
  public onClickBtnHoodle(): void {
    this.close();
    facade.openView(ModuleName.HOODLE, HoodleViewType.HOODLE);
  }
}
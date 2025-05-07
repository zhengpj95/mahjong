import Image = Laya.Image;
import BaseMediator = base.BaseMediator;
import MahjongHomeUI = ui.modules.mahjong.MahjongHomeUI;
import facade = base.facade;
import LayerIndex = base.LayerIndex;
import { ui } from "@ui/layaMaxUI";
import { MahjongViewType } from "@def/mahjong";
import { ModuleType } from "@def/module-type";

/**
 * @author zpj
 * @date 2025/1/21
 */
export default class MahjongHomeMdr extends BaseMediator<MahjongHomeUI> {
  private _btnStart: Image;

  constructor() {
    super(LayerIndex.MAIN, "modules/mahjong/MahjongHome.scene");
  }

  protected addEvents(): void {
    this._btnStart.on(Laya.Event.CLICK, this, this.onClickBtnStart);
  }

  protected initUI(): void {
    this._btnStart = <Image>this.ui.getChildByName("btnStart");
  }

  protected onClose(): void {
    console.warn(`11111 MahjongHomeMdr.onClose...`, this.params);
    this.removeEvents();
  }

  protected onOpen(): void {
    console.warn(`11111 MahjongHomeMdr.onOpen...`, this.params);
  }

  private removeEvents(): void {
    this._btnStart.offAll(Laya.Event.CLICK);
  }

  private onClickBtnStart(): void {
    facade.closeView(ModuleType.MAHJONG, MahjongViewType.HOME);
    facade.openView(ModuleType.MAHJONG, MahjongViewType.MAIN);
  }
}
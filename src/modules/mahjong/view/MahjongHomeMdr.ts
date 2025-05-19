import Image = Laya.Image;
import BaseMediator = base.BaseMediator;
import Sprite = Laya.Sprite;
import facade = base.facade;
import { ModuleType } from "@def/module-type";
import { MahjongViewType } from "@def/mahjong";

/**
 * @author zpj
 * @date 2025/1/21
 */
export default class MahjongHomeMdr extends BaseMediator<Sprite> {
  private _btnStart: Image;

  constructor() {
    super(1, "scene/mahjong/MahjongHome.ls");
  }

  protected addEvents(): void {
    this._btnStart.on(Laya.Event.CLICK, this, this.onClickBtnStart);
  }

  protected initUI(): void {
    this._btnStart = <Image>this.ui.getChildByName("btnStart");
  }

  protected onClose(): void {
    this.removeEvents();
  }

  protected onOpen(): void {
    //
  }

  private removeEvents(): void {
    this._btnStart.offAll(Laya.Event.CLICK);
  }

  private onClickBtnStart(): void {
    facade.openView(ModuleType.MAHJONG, MahjongViewType.MAIN);
  }
}
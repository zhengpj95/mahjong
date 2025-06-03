import Image = Laya.Image;
import BaseMediator = base.BaseMediator;
import Sprite = Laya.Sprite;
import facade = base.facade;
import LayerIndex = base.LayerIndex;
import { ModuleName } from "@def/module-name";
import { MahjongViewType } from "@def/mahjong";

/**
 * @author zpj
 * @date 2025/1/21
 */
export default class MahjongHomeMdr extends BaseMediator<Sprite> {
  private _btnStart: Image;

  constructor() {
    super(LayerIndex.MAIN, "scene/mahjong/MahjongHome.ls");
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
    this.close();
    facade.openView(ModuleName.MAHJONG, MahjongViewType.MAIN);
  }
}
import { ui } from "@ui/layaMaxUI";
import { MahjongProxy } from "../model/MahjongProxy";
import Scene = Laya.Scene;
import Image = Laya.Image;

/**
 * @author zpj
 * @date 2025/1/21
 */
export default class MahjongHomeMdr extends ui.modules.mahjong.MahjongHomeUI {
  private _btnStart: Image;

  public createChildren(): void {
    super.createChildren();
    MahjongProxy.ins().model.init();
    this._btnStart = <Image>this.getChildByName("btnStart");
    this._btnStart.on(Laya.Event.CLICK, this, this.onClickBtnStart);
  }

  public onOpened(param: any): void {
    super.onOpened(param);
    console.warn(`11111 MahjongHomeMdr.onOpened...`, param);
  }

  public onClosed(type?: string): void {
    super.onClosed(type);
    this._btnStart.offAll(Laya.Event.CLICK);
  }

  private onClickBtnStart(): void {
    Scene.open("modules/mahjong/Mahjong.scene");
  }
}
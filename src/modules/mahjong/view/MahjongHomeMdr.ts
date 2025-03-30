import { ui } from "@ui/layaMaxUI";
import { MahjongProxy } from "../model/MahjongProxy";
import Button = Laya.Button;
import Scene = Laya.Scene;
import Handler = Laya.Handler;

/**
 * @author zpj
 * @date 2025/1/21
 */
export default class MahjongHomeMdr extends ui.modules.mahjong.MahjongHomeUI {
  private _btnStart: Button;

  public createChildren(): void {
    super.createChildren();
    MahjongProxy.ins().model.init();
    this._btnStart = <Button>this.getChildByName("btnStart");
    this._btnStart.clickHandler = Handler.create(this, this.onClickBtnStart, undefined, true);
  }

  public onOpened(param: any): void {
    super.onOpened(param);
    console.warn(`11111 MahjongHomeMdr.onOpened...`, param);
  }

  public onClosed(type?: string): void {
    super.onClosed(type);
  }

  private onClickBtnStart(): void {
    Scene.open("modules/mahjong/Mahjong.scene");
  }
}
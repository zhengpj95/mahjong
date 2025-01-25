import { ui } from "@ui/layaMaxUI";
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
    this._btnStart = <Button>this.getChildByName("btnStart");
    this._btnStart.clickHandler = Handler.create(this, this.onClickBtnStart, undefined, true);
  }

  public onOpened(param: any): void {
    super.onOpened(param);
  }

  public onClosed(type?: string): void {
    super.onClosed(type);
  }

  private onClickBtnStart(): void {
    Scene.open("modules/mahjong/Mahjong.scene");
  }
}
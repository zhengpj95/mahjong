import Sprite = Laya.Sprite;
import View = Laya.View;
import Box = Laya.Box;
import Label = Laya.Label;
import { layerMgr } from "@base/LayerManager";
import { PoolObject } from "@base/pool/PoolConst";

class TipsItem extends Box implements PoolObject {
  private _lab: Label;

  constructor() {
    super();
  }

  public onAlloc(): void {
    this.size(500, 100);
    this.centerX = this.centerY = 0;
    if (!this._lab) {
      this._lab = new Label();
      this._lab.fontSize = 30;
      this._lab.color = "#ffffff";
      this._lab.centerX = this._lab.centerY = 0;
    }
    this._lab.text = "";
  }

  public onFree(): void {
    if (this._lab) {
      this._lab.text = "";
    }
  }
}

/**
 * tips飘字提示
 * @author zpj
 * @date 2025/2/16
 */
export class TipsMdr extends View {
  private sprite: Sprite;

  constructor() {
    super();
    if (!this.sprite) {
      this.sprite = new Sprite();
      this.sprite.size(Laya.stage.width, Laya.stage.height);
    }
    this.size(Laya.stage.width, Laya.stage.height);
    layerMgr.tips.addChild(this);
  }

  public addTips(): void {
    //
  }

}
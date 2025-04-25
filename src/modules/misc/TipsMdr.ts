import Box = Laya.Box;
import Label = Laya.Label;
import Image = Laya.Image;
import Timer = Laya.Timer;
import Tween = Laya.Tween;
import Handler = Laya.Handler;
import Sprite = Laya.Sprite;
import poolMgr = base.poolMgr;
import PoolObject = base.PoolObject;
import { layerMgr } from "@base/LayerManager";

class TipsItem extends Box implements PoolObject {
  private _img: Image;
  private _lab: Label;

  public onAlloc(): void {
    this.size(600, 35);
    this.centerX = 0;
    this.centerY = -100;
    if (!this._img) {
      this._img = new Image();
      this._img.skin = `common/img_blank.png`;
      this._img.left = this._img.right = this._img.bottom = this._img.top = 0;
      this._img.sizeGrid = `3,8,6,5`;
      this.addChild(this._img);
    }
    if (!this._lab) {
      this._lab = new Label();
      this._lab.fontSize = 22;
      this._lab.color = "#ffffff";
      this._lab.centerX = 0;
      this._lab.centerY = 1;
      this.addChild(this._lab);
    }
    this.alpha = 1;
    this._lab.text = "";
  }

  public onFree(): void {
    this.alpha = 1;
    if (this._lab) {
      this._lab.text = "";
    }
  }

  public set text(str: string) {
    this._lab.text = str;
  }

  public execTween(): void {
    Tween.clearAll(this);
    Tween.to(this, { alpha: 0.8 }, 800, null, Handler.create(this, this.execTweenEnd, null, true), 800);
  }

  private execTweenEnd(): void {
    this.removeSelf();
    Tween.clearAll(this);
    poolMgr.free(this);
  }
}

/**
 * tips飘字提示
 * @author zpj
 * @date 2025/2/16
 */
class TipsMdr extends Box {
  private _sprite: Sprite;
  private _tipsList: TipsItem[] = [];
  private _timer: Timer;
  private _showMaxNum = 5;

  constructor() {
    super();
    if (!this._sprite) {
      this._sprite = new Sprite();
      this._sprite.size(Laya.stage.width, Laya.stage.height);
      this.addChild(this._sprite);
    }
    this.size(Laya.stage.width, Laya.stage.height);
    layerMgr.tips.addChild(this);
  }

  public addTips(str: string | string[]): void {
    if (Array.isArray(str)) {
      for (let strItem of str) {
        const tipsItem = poolMgr.alloc(TipsItem);
        tipsItem.text = strItem;
        this._tipsList.push(tipsItem);
      }
    } else {
      const tipsItem = poolMgr.alloc(TipsItem);
      tipsItem.text = str;
      this._tipsList.push(tipsItem);
    }

    if (!this._timer) {
      this._timer = new Timer();
      this._timer.loop(100, this, this.onUpdate);
      this.onUpdate();
    }
  }

  private onUpdate(): void {
    if (!this._tipsList.length) {
      this._timer.clearAll(this);
      this._timer = undefined;
      return;
    }
    const existSize = this._sprite.numChildren;
    if (existSize >= this._showMaxNum) {
      return;
    }
    for (let i = 0; i < existSize; i++) {
      const item = <TipsItem>this._sprite.getChildAt(i);
      if (item) {
        item.y = item.y - (item.height + 5);
      }
    }
    const tipsItem = this._tipsList.shift();
    this._sprite.addChild(tipsItem);
    tipsItem.execTween();
  }
}

let mdr: TipsMdr | undefined;

export function showTips(str: string): void {
  if (!mdr) {
    mdr = new TipsMdr();
  }
  mdr.addTips(str);
}
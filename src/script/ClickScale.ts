import Script = Laya.Script;
import UIComponent = Laya.UIComponent;
import CallBack = base.CallBack;
import regClass = Laya.regClass;

const CLICK_SCALE_DOWN = 1.1;
const CLICK_SCALE_UP = 0.90;
const CLICK_SCALE_TIME = 100;

/**
 * 按钮点击缩放效果
 * 不要使用约束（left,right,top,bottom,centerX,centerY）
 * @date 2025/4/25
 */
@regClass()
export default class ClickScale extends Script {
  /** @prop {name:noScale,tips:"点击不缩放效果,默认：false",type:Check,default=false} */
  public noScale = false;

  private _comp: UIComponent;
  private _width: number;
  private _height: number;
  private _originX: number = 0;
  private _originY: number = 0;
  private _originScaleX = 1; // 初始尺寸
  private _originScaleY = 1;
  private _isTween = false;

  public onAwake(): void {
    super.onAwake();
    this._comp = <UIComponent>this.owner;
    this._width = this._comp.width;
    this._height = this._comp.height;
    this._originX = this._comp.x;
    this._originY = this._comp.y;
    this._originScaleX = this._comp.scaleX;
    this._originScaleY = this._comp.scaleY;
    this._isTween = false;
  }

  public onEnable(): void {
    super.onEnable();
    this.setAnchor();
    this._comp.on(Laya.Event.MOUSE_DOWN, this, this.onClickMouseDown);
    this._comp.on(Laya.Event.MOUSE_UP, this, this.onClickMouseUp);
    this._comp.on(Laya.Event.MOUSE_OUT, this, this.onClickMouseUp);
  }

  public destroy(): void {
    super.destroy();
  }

  private setAnchor(): void {
    if (this.noScale) return;
    this._comp.anchorX = this._comp.anchorY = 0.5;
    this._comp.x = this._originX + this._width * 0.5;
    this._comp.y = this._originY + this._height * 0.5;
  }

  private onClickMouseDown(): void {
    if (this.noScale) return;
    this._isTween = false;
    base.tweenMgr.remove(this._comp);
    base.tweenMgr.get(this._comp).to({ scaleX: CLICK_SCALE_DOWN, scaleY: CLICK_SCALE_DOWN }, CLICK_SCALE_TIME);
  }

  private onClickMouseUp(): void {
    if (this.noScale
      || this._isTween
      || (this._comp.scaleX === this._originScaleX &&
        this._comp.scaleY === this._originScaleY)) {
      return;
    }
    this._isTween = true;
    base.tweenMgr.remove(this._comp);
    base.tweenMgr.get(this._comp).to({
      scaleX: CLICK_SCALE_UP,
      scaleY: CLICK_SCALE_UP
    }, CLICK_SCALE_TIME, undefined, CallBack.alloc(this, this.onMouseUpEnd));
  }

  private onMouseUpEnd(): void {
    base.tweenMgr.remove(this._comp);
    base.tweenMgr.get(this._comp).to({
      scaleX: this._originScaleX,
      scaleY: this._originScaleY
    }, CLICK_SCALE_TIME);
  }
}
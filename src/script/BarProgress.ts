import Script = Laya.Script;
import Box = Laya.Box;
import Image = Laya.Image;
import Label = Laya.Label;

function createImgMask(): Image {
  const img = new Image();
  img.skin = `modules/common/img_blank.png`;
  img.width = img.height = 0;
  img.sizeGrid = "4,5,7,6";
  return img;
}

/**
 * 进度条
 * @date 2025/3/15
 */
export default class BarProgress extends Script {
  private _imgBar: Image;
  private _imgMask: Image;
  private _lab: Label;

  public onAwake(): void {
    super.onAwake();
    const owner = <Box>this.owner;
    this._imgBar = <Image>owner.getChildByName("imgBar");
    this._lab = <Label>owner.getChildByName("lab");
    if (!this._imgMask) {
      this._imgMask = createImgMask();
      this._imgMask.height = this._imgBar.height;
      this._imgBar.mask = this._imgMask;
    }

    Object.defineProperty(this.owner, "value", {
      configurable: true,
      enumerable: true,
      get: () => {
        return this.value;
      },
      set: (v: number): void => {
        this.value = v;
      }
    });
  }

  public onEnable(): void {
    super.onEnable();
  }

  public onDestroy(): void {
    super.onDestroy();
  }

  private getImgWidth(): number {
    if (!this._imgBar || !this._imgBar.width) {
      const func = this._imgBar["_sizeChanged"];
      if (func) {
        func();
      }
    }
    return this._imgBar ? this._imgBar.width : 0;
  }

  public set value(val: number) {
    if (this._imgMask && this._imgBar) {
      const width = val * this.getImgWidth() >> 0;
      this._imgMask.width = width;
      this._imgBar.visible = width >= 1;
    }
  }

  public get value(): number {
    if (this._imgMask && this._imgBar) {
      return this._imgMask.width / this._imgBar.width;
    }
    return 0;
  }
}
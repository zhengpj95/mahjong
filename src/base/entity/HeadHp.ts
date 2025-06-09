import Sprite = Laya.Sprite;
import Box = Laya.Box;
import Image = Laya.Image;
import Label = Laya.Label;
import PoolObject = base.PoolObject;

/**
 * @author zpj
 * @date 2025/6/9
 */
export class HeadHp extends Sprite implements PoolObject {
  private _box: Box;
  private _imgBarBg: Image;
  private _imgBar: Image;
  private _lab: Label;

  public onAlloc(): void {
    if (!this._box) {
      this._box = new Box();
      this._box.width = 134;
      this._box.height = 14;
      this._box.x = -this._box.width / 2;
      this.addChild(this._box);
    }
    if (!this._imgBarBg) {
      this._imgBarBg = new Image();
      this._imgBarBg.skin = `modules/common/img_fight_boss_hp_bg.png`;
      this._box.addChild(this._imgBarBg);
    }
    if (!this._imgBar) {
      this._imgBar = new Image();
      this._imgBar.skin = `modules/common/img_fight_hp_red.png`;
      this._imgBar.x = this._imgBar.y = 1;
      this._box.addChild(this._imgBar);
    }
    if (!this._lab) {
      this._lab = new Label();
      this._lab.fontSize = 14;
      this._lab.color = `#ffffff`;
      this._lab.centerX = this._lab.centerY = 0;
      this._box.addChild(this._lab);
    }
  }

  public onFree(): void {
    if (this._lab) this._lab.text = "";
    if (this._imgBar) this._imgBar.width = 0;
  }

  private getImgWidth(): number {
    if (!this._imgBar || !this._imgBar.width) {
      const func = this._imgBar["_sizeChanged"];
      if (func) {
        func.call(this._imgBar);
      }
    }
    return 132;
  }

  public setHp(hp: number, maxHp: number): void {
    if (!this.displayedInStage) return;
    const ratio = hp / maxHp;
    this._imgBar.width = (ratio * this.getImgWidth()) >> 0;
    this._lab.text = (ratio * 100).toFixed(2) + "%";
  }
}

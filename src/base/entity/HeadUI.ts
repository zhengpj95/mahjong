import { SceneEntity } from "./SceneEntity";
import Label = Laya.Label;
import Sprite = Laya.Sprite;
import PoolObject = base.PoolObject;

/**
 * @author zpj
 * @date 2025/6/9
 */
export class HeadUI extends Sprite implements PoolObject {
  private _entity: SceneEntity;
  private _lab: Label;

  public get entity(): SceneEntity {
    return this._entity;
  }

  public set entity(value: SceneEntity) {
    this._entity = value;
    if (value && value.vo.name) {
      this.createName();
      this._lab.text = value.vo.name;
    }
  }

  public onAlloc(): void {
    this.onFree();
    this.width = 100;
    this.height = 12;

    // const img = new Laya.Image("atlas/common/img_blank.png");
    // img.width = this.width;
    // img.height = this.height;
    // this.addChild(img);

    this.createName();
  }

  public onFree(): void {
    if (this._lab) {
      this._lab.text = "";
    }
    this._entity = <any>undefined;
  }

  private createName(): void {
    if (!this._lab) {
      this._lab = new Label();
      this._lab.fontSize = 12;
      this._lab.color = "#ffffff";
      this._lab.align = "center";
      this._lab.centerX = 0;
      this.addChild(this._lab);
    }
  }
}

import { BaseComponent } from "./BaseComponent";
import { ComponentType } from "./ComponentConst";
import { Action, Direction } from "../entity/EntityConst";
import { HeadUI } from "../entity/HeadUI";
import { HeadHp } from "../entity/HeadHp";
import { SceneEvent } from "@def/scene";
import Sprite = Laya.Sprite;
import RpgMovieClip = base.RpgMovieClip;
import CallBack = base.CallBack;
import poolMgr = base.poolMgr;
import eventMgr = base.eventMgr;

function getDirectionScale(dir: number): { x: number; y: number } {
  if (dir === Direction.LEFT) {
    return { x: -1, y: 1 };
  }
  return { x: 1, y: 1 };
}

/**
 * 场景模型
 * @date 2025/6/9
 */
export class AvatarComponent extends BaseComponent {
  private _display: Sprite;
  private _curAction: Action;
  private _rpg: RpgMovieClip;
  private _headUI: HeadUI;
  private _headHp: HeadHp;

  public get display(): Sprite {
    return this._display;
  }

  constructor() {
    super();
    this.type = ComponentType.AVATAR;
  }

  public start(): void {
    super.start();
    if (!this.display) {
      this._display = new Sprite();
      this._display.name = "sprite_avatarComponent";
      const point = this.entity.vo.point;
      this._display.x = point ? point.x : 0;
      this._display.y = point ? point.y : 0;
    }
    if (!this._rpg) {
      this._rpg = new RpgMovieClip();
      this._rpg.play(
        this.entity.vo.avatarName,
        this.display,
        -1,
        undefined,
        CallBack.alloc(this, this.playEnd),
      );
    }
    const scale = getDirectionScale(this.entity.vo.dir);
    this._rpg.scale(scale.x, scale.y);

    if (!this._headUI) {
      this._headUI = poolMgr.alloc(HeadUI);
      this._headUI.entity = this.entity;
      this.display.addChild(this._headUI);
      this._headUI.y = -50;
      this._headUI.x = -(this._headUI.width / 2) + -scale.x * 20;
    }
    if (!this._headHp) {
      this._headHp = poolMgr.alloc(HeadHp);
      this._headHp.setHp(this.entity.vo.hp, this.entity.vo.maxHp);
      this._headHp.y = -70;
      this._headHp.x = -(this._headHp.width / 2) + -scale.x * 20;
      this.display.addChild(this._headHp);
    }

    eventMgr.emit(SceneEvent.ADD_TO_SCENE, this.entity);
  }

  public stop(): void {
    const e = this.entity;
    super.stop();
    eventMgr.emit(SceneEvent.REMOVE_FROM_SCENE, e);
    if (this._headUI) {
      poolMgr.free(this._headUI);
      this._headUI = <any>undefined;
    }
    if (this._headHp) {
      poolMgr.free(this._headHp);
      this._headHp = <any>undefined;
    }
  }

  private playEnd(): void {
    if (this.entity) {
      this.entity.isDone = true;
    }
  }

  public update(elapsed: number): void {
    const vo = this.entity.vo;
    const point = this.entity.vo.point;
    if (this.display.x !== point.x) {
      this.display.x = point.x || 0;
    }
    if (this.display.y !== point.y) {
      this.display.y = point.y || 0;
    }
    if (vo.action && vo.action !== this._curAction) {
      this._curAction = vo.action;
      this._rpg.setAction(vo.action);
      this._rpg.setCnt(vo.action === Action.DEATH ? 1 : -1);
    }

    if (vo.action === Action.DEATH) {
      return;
    }
    if (vo.hp <= 0) {
      vo.hp = 0;
      vo.action = Action.DEATH;
      console.log(`AvatarComp: ${vo.name} is death!`);
    }
    this._headHp.setHp(vo.hp, vo.maxHp);
  }
}

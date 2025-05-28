import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;
import tweenMgr = base.tweenMgr;
import CallBack = base.CallBack;
import Label = Laya.Label;
import RigidBody = Laya.RigidBody;
import ColliderBase = Laya.ColliderBase;
import Sprite = Laya.Sprite;
import { HoodleView } from "@3rd-types/hoodle";

/**
 * @author zpj
 * @date 2025/5/20
 */
export class HoodleMdr extends BaseMediator<HoodleView> {

  private _initPoint: { x: number, y: number };

  private _blockRectPrefab: Laya.PrefabImpl;
  private _blockList: Sprite[] = [];

  constructor() {
    super(LayerIndex.MAIN, "scene/hoodle/Hoodle.ls");
  }

  protected addEvents(): void {
    this.onLaya(Laya.stage, Laya.Event.CLICK, this.onClickBall, this);
    this.onLaya(this.ui.$ballSprite, Laya.Event.TRIGGER_EXIT, this.onBallTrigger);
  }

  protected initUI(): void {
    this._initPoint = { x: this.ui.$ballSprite.x, y: this.ui.$ballSprite.y };
  }

  protected onClose(): void {
    this.ui.$ballSprite.x = this._initPoint?.x ?? 0;
    this.ui.$ballSprite.y = this._initPoint?.y ?? 0;
    this.ui.timer.clearAll(this);
    this._blockRectPrefab = <any>undefined;
    this._blockList.length = 0;
  }

  protected onOpen(): void {
    this.ui.timer.loop(10 * 1000, this, () => {
      if (this._blockList.length > 5) return;
      this._blockList.forEach(value => {
        value.y -= 60;
      });
      this.createRect();
    });
    this.createRect();

    this.ui.timer.loop(100, this, () => {
      this._blockList.forEach(value => {
        const rigid = value.getComponent(RigidBody);
        const collider = value.getComponent(ColliderBase);
        if (rigid.type === "dynamic" && collider.label === "enemy") {
          const lv = rigid.linearVelocity;
          if (Math.abs(lv.x) <= 0 && Math.abs(lv.y) <= 0) {
            rigid.type = "static";
          }
        }
      });
    });

    this.ui.timer.loop(16, this, () => {
      const ball = this.ui.$ballSprite;
      if (ball.y + ball.height / 2 >= this.ui.height) {
        this.removeBallTrigger();
      }
    });
  }

  private onClickBall(e: Laya.Event): void {
    const ballSprite = this.ui.$ballSprite;
    const rigid = ballSprite.getComponent(RigidBody);
    if (rigid.type === "static" || rigid.gravityScale === 0) {
      const clickPoint = Laya.Point.create();
      clickPoint.setTo(e.stageX, e.stageY);
      const center = rigid.getWorldCenter();
      const dir = Laya.Point.create();
      dir.setTo(clickPoint.x - center.x, clickPoint.y - center.y);
      dir.normalize();
      rigid.type = "dynamic";
      rigid.gravityScale = 1;
      rigid.linearVelocity = new Laya.Point((dir.x * 1000) >> 0, (dir.y * 1000) >> 0);
      clickPoint.recover();
      dir.recover();
    }
  }

  private onBallTrigger(e: ColliderBase): void {
    if (e.label === "enemy") {
      const lab = (e.owner.getChildByName("$lab") as Label);
      const curVal = parseInt(lab.text);
      lab.text = (curVal - 2) + "";
      if (curVal - 2 <= 0) {
        tweenMgr.get(e.owner).to({ alpha: 0 }, 100, null, CallBack.alloc(this, () => {
          const idx = this._blockList.indexOf(<Sprite>e.owner);
          if (idx > -1) {
            this._blockList.splice(idx, 1);
          }
          e.owner.removeSelf();
        }));
      }
    } else if (e.label === "ground") {
      this.removeBallTrigger();
    }
  }

  private removeBallTrigger(): void {
    const ballSprite = this.ui.$ballSprite;
    ballSprite.getComponent(RigidBody).gravityScale = 0;
    ballSprite.getComponent(RigidBody).type = "static";
    ballSprite.pos(this._initPoint?.x ?? 0, this._initPoint?.y ?? 0);
  }

  private createRect(): void {
    if (!this._blockRectPrefab) {
      Laya.loader.load("scene/hoodle/BlockRect.lh").then((res: Laya.PrefabImpl) => {
        this._blockRectPrefab = res;
        this.addRect();
      });
    } else {
      this.addRect();
    }
  }

  private addRect(): void {
    if (this._blockRectPrefab) {
      const rect = <Sprite>this._blockRectPrefab.create();
      rect.x = (Math.random() * 500 >> 0) + 50;
      rect.y = this.ui.height - rect.height / 2;
      this.ui.addChild(rect);
      this._blockList.push(rect);
    }
  }
}
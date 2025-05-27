import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;
import tweenMgr = base.tweenMgr;
import CallBack = base.CallBack;
import Label = Laya.Label;
import RigidBody = Laya.RigidBody;
import ColliderBase = Laya.ColliderBase;
import { HoodleView } from "@3rd-types/hoodle";

/**
 * @author zpj
 * @date 2025/5/20
 */
export class HoodleMdr extends BaseMediator<HoodleView> {

  private _initPoint: { x: number, y: number };

  constructor() {
    super(LayerIndex.MAIN, "scene/hoodle/Hoodle.ls");
  }

  protected addEvents(): void {
    this.onLaya(Laya.stage, Laya.Event.CLICK, this.onClickBall, this);
  }

  protected initUI(): void {
    this._initPoint = { x: this.ui.$ballSprite.x, y: this.ui.$ballSprite.y };
  }

  protected onClose(): void {
    this.ui.$ballSprite.x = this._initPoint?.x ?? 0;
    this.ui.$ballSprite.y = this._initPoint?.y ?? 0;
  }

  protected onOpen(): void {
    this.onLaya(this.ui.$ballSprite, Laya.Event.TRIGGER_EXIT, this.onBallTrigger);
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
      rigid.linearVelocity = new Laya.Point(dir.x * 1200, dir.y * 1200);
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
}
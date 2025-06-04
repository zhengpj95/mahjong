import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;
import tweenMgr = base.tweenMgr;
import CallBack = base.CallBack;
import Label = Laya.Label;
import RigidBody = Laya.RigidBody;
import ColliderBase = Laya.ColliderBase;
import Sprite = Laya.Sprite;
import CircleCollider = Laya.CircleCollider;
import facade = base.facade;
import { HoodleView } from "@3rd-types/hoodle";
import { ModuleName } from "@def/module-name";
import { MahjongViewType } from "@def/mahjong";

/**
 * @author zpj
 * @date 2025/5/20
 */
export class HoodleMdr extends BaseMediator<HoodleView> {

  private _initPoint: { x: number, y: number };

  private _blockRectPrefab: Laya.PrefabImpl;
  private _blockCirclePrefab: Laya.PrefabImpl;
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
    this._score = 0;
  }

  protected onOpen(): void {
    this.ui.timer.loop(2000, this, () => {
      if (this._blockList.length > 6) return;
      this._blockList.forEach(value => {
        value.y -= 60;
      });
      this.loadBlock();
    });
    this.loadBlock();

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

  private _score: number = 0;

  private addScore(score: number): void {
    this._score += score;
    this.ui.$boxTop.$labScore.text = "得分：" + this._score;
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
      rigid.allowRotation = true;
      rigid.allowSleep = true;
      rigid.angularVelocity = 10;
      rigid.gravityScale = 0.8;
      rigid.linearVelocity = new Laya.Point((dir.x * 1000) >> 0, (dir.y * 1000) >> 0);
      clickPoint.recover();
      dir.recover();
    }
  }

  private onBallTrigger(other: ColliderBase, self: ColliderBase): void {
    if (other.label === "enemy") {
      const selfVal = +(self.owner.getChildByName("$lab") as Label).text;
      const lab = (other.owner.getChildByName("$lab") as Label);
      const curVal = parseInt(lab.text);
      const subtractVal = curVal > selfVal ? selfVal : Math.max(0, curVal);
      lab.text = (curVal - subtractVal) + "";
      this.addScore(subtractVal);
      if (curVal - subtractVal <= 0) {
        tweenMgr.get(other.owner).to({ alpha: 0 }, 100, null, CallBack.alloc(this, () => {
          const idx = this._blockList.indexOf(<Sprite>other.owner);
          if (idx > -1) {
            this._blockList.splice(idx, 1);
          }
          other.owner.removeSelf();
        }));
      }
    } else if (other.label === "ground") {
      this.removeBallTrigger();
    }
  }

  private removeBallTrigger(): void {
    const ballSprite = this.ui.$ballSprite;
    ballSprite.getComponent(RigidBody).gravityScale = 0;
    ballSprite.getComponent(RigidBody).type = "static";
    ballSprite.pos(this._initPoint?.x ?? 0, this._initPoint?.y ?? 0);
  }

  private loadBlock(): void {
    if (!this._blockRectPrefab || !this._blockCirclePrefab) {
      Laya.loader.load(["scene/hoodle/BlockRect.lh", "scene/hoodle/BlockCircle.lh"]).then((res: Laya.PrefabImpl[]) => {
        [this._blockRectPrefab, this._blockCirclePrefab] = res;
        this.createBlock();
      });
    } else {
      this.createBlock();
    }
  }

  private createBlock(): void {
    const inRight = Math.random() > 0.5;
    if (this._blockRectPrefab) {
      const rect = <Sprite>this._blockRectPrefab.create();
      const val = Math.max(1, (Math.random() * 20 >> 0));
      (rect.getChildByName("$lab") as Label).text = val + "";
      rect.x = (Math.random() * 260 >> 0) + (inRight ? 320 : 0) + 30;
      rect.y = this.ui.height - rect.height / 2;
      this.ui.addChild(rect);
      this._blockList.push(rect);
    }

    if (this._blockCirclePrefab) {
      const circle = <Sprite>this._blockCirclePrefab.create();
      const val = Math.max(1, (Math.random() * 20 >> 0));
      (circle.getChildByName("$lab") as Label).text = val + "";
      const random = Math.random();
      const size = random > 0.7 ? 30 : random > 0.3 ? 25 : 20;
      circle.size(size * 2, size * 2);
      const collider = circle.getComponent(CircleCollider);
      collider.radius = size;
      circle.x = (Math.random() * 260 >> 0) + (inRight ? 0 : 320) + 30;
      circle.y = this.ui.height - circle.height / 2;
      this.ui.addChild(circle);
      this._blockList.push(circle);
    }
  }

  public onBack(): void {
    this.close();
    facade.openView(ModuleName.MAHJONG, MahjongViewType.HOME);
  }
}
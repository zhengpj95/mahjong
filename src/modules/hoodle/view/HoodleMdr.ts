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
import BoxCollider = Laya.BoxCollider;
import { HoodleView } from "@3rd-types/hoodle";
import { ModuleName } from "@def/module-name";
import { MahjongViewType } from "@def/mahjong";

/**
 * @author zpj
 * @date 2025/5/20
 */
export class HoodleMdr extends BaseMediator<HoodleView> {
  private _initPoint: { x: number; y: number };

  private _blockRectPrefab: Laya.PrefabImpl;
  private _blockCirclePrefab: Laya.PrefabImpl;
  private _blockList: Sprite[] = [];

  private _score: number = 0;

  constructor() {
    super(LayerIndex.MAIN, "scene/hoodle/Hoodle.ls");
  }

  protected addEvents(): void {
    this.onLaya(Laya.stage, Laya.Event.MOUSE_DOWN, this.onClickBallDown, this);
    this.onLaya(Laya.stage, Laya.Event.MOUSE_DRAG, this.onClickBallDown, this);
    this.onLaya(Laya.stage, Laya.Event.MOUSE_UP, this.onClickBallUp, this);
    this.onLaya(
      this.ui.$ballSprite,
      Laya.Event.TRIGGER_EXIT,
      this.onBallTrigger,
    );
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
      this._blockList.forEach((value) => {
        value.y -= 60;
      });
      this.loadBlock();
    });
    this.loadBlock();

    this.ui.timer.loop(100, this, () => {
      this._blockList.forEach((value) => {
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

  private addScore(score: number): void {
    this._score += score;
    this.ui.$boxTop.$labScore.text = "得分：" + this._score;
  }

  private onClickBallDown(e: Laya.Event): void {
    const ballSprite = this.ui.$ballSprite;
    const rigid = ballSprite.getComponent(RigidBody);
    if (rigid.type === "static" || rigid.gravityScale === 0) {
      const targetPoint = this.ui.localToGlobal(
        Laya.Point.create().setTo(e.stageX, e.stageY),
      );
      const fromPoint = this.ui.localToGlobal(
        Laya.Point.create().setTo(ballSprite.x, ballSprite.y),
      );
      const dir = Laya.Point.create().setTo(
        targetPoint.x - fromPoint.x,
        targetPoint.y - fromPoint.y,
      );
      dir.normalize();
      const p = Laya.Point.create().setTo(dir.x * 1000, dir.y * 1000);
      this.drawPath(fromPoint, p);
      targetPoint.recover();
      fromPoint.recover();
      dir.recover();
      p.recover();
    }
  }

  private onClickBallUp(e: Laya.Event): void {
    const ballSprite = this.ui.$ballSprite;
    const rigid = ballSprite.getComponent(RigidBody);
    if (rigid.type === "static" || rigid.gravityScale === 0) {
      this.ui.$box.graphics.clear();
      rigid.setVelocity({ x: 0, y: 0 });
      rigid.type = "dynamic";
      rigid.allowRotation = false;
      rigid.allowSleep = true;
      rigid.angularVelocity = 5;
      rigid.gravityScale = 0.8;
      const targetPoint = this.ui.localToGlobal(
        Laya.Point.create().setTo(e.stageX, e.stageY),
      );
      const fromPoint = this.ui.localToGlobal(
        Laya.Point.create().setTo(ballSprite.x, ballSprite.y),
      );
      const dir = Laya.Point.create().setTo(
        targetPoint.x - fromPoint.x,
        targetPoint.y - fromPoint.y,
      );
      dir.normalize();
      const p = Laya.Point.create().setTo(
        (dir.x * 1000) >> 0,
        (dir.y * 1000) >> 0,
      );
      rigid.linearVelocity = p;
      targetPoint.recover();
      fromPoint.recover();
      dir.recover();
      p.recover();
    }
  }

  private onBallTrigger(other: ColliderBase, self: ColliderBase): void {
    if (other.label === "enemy") {
      const selfVal = +(self.owner.getChildByName("$lab") as Label).text;
      const lab = other.owner.getChildByName("$lab") as Label;
      const curVal = parseInt(lab.text);
      const subtractVal = curVal > selfVal ? selfVal : Math.max(0, curVal);
      lab.text = curVal - subtractVal + "";
      this.addScore(subtractVal);
      if (curVal - subtractVal <= 0) {
        tweenMgr.get(other.owner).to(
          { alpha: 0 },
          100,
          null,
          CallBack.alloc(this, () => {
            const idx = this._blockList.indexOf(<Sprite>other.owner);
            if (idx > -1) {
              this._blockList.splice(idx, 1);
            }
            other.owner.removeSelf();
          }),
        );
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
      Laya.loader
        .load(["scene/hoodle/BlockRect.lh", "scene/hoodle/BlockCircle.lh"])
        .then((res: Laya.PrefabImpl[]) => {
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
      const val = Math.max(1, (Math.random() * 20) >> 0);
      (rect.getChildByName("$lab") as Label).text = val + "";
      const collider = rect.getComponent(BoxCollider);
      collider.label = "enemy";
      rect.x = ((Math.random() * 260) >> 0) + (inRight ? 320 : 0) + 30;
      rect.y = this.ui.height - rect.height / 2;
      this.ui.addChild(rect);
      this._blockList.push(rect);
    }

    if (this._blockCirclePrefab) {
      const circle = <Sprite>this._blockCirclePrefab.create();
      const val = Math.max(1, (Math.random() * 20) >> 0);
      (circle.getChildByName("$lab") as Label).text = val + "";
      const random = Math.random();
      const size = random > 0.7 ? 30 : random > 0.3 ? 25 : 20;
      circle.size(size * 2, size * 2);
      const collider = circle.getComponent(CircleCollider);
      collider.radius = size;
      collider.label = "enemy";
      circle.x = ((Math.random() * 260) >> 0) + (inRight ? 0 : 320) + 30;
      circle.y = this.ui.height - circle.height / 2;
      this.ui.addChild(circle);
      this._blockList.push(circle);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  public onBack(): void {
    this.close();
    facade.openView(ModuleName.MAHJONG, MahjongViewType.HOME);
  }

  private drawPath(start: Laya.Point, velocity: Laya.Point): void {
    this.ui.$box.graphics.clear();

    let pos = Laya.Point.create().setTo(start.x, start.y);
    let vx = velocity.x;
    let vy = velocity.y;

    const g = 9.8 * 60; // 重力像素/秒²
    const dt = 1 / 120;
    const steps = 180;

    const stageWidth = this.ui.stage.width;

    let isRev = 0;
    for (let i = 0; i < steps; i++) {
      if (isRev > 1) break;
      const p = this.ui.globalToLocal(pos);
      const nextX = p.x + vx * dt;
      const nextY = p.y + vy * dt;

      // 撞到左右墙壁：反弹 X
      if (nextX <= 0 || nextX >= stageWidth) {
        vx = -vx;
        isRev += 1;
      }

      // 撞到顶部（可选）反弹 Y
      if (nextY <= 0) {
        vy = -vy;
      }

      const next = this.ui.globalToLocal(
        Laya.Point.create().setTo(this.clamp(nextX, 0, stageWidth), nextY),
      );

      this.ui.$box.graphics.drawLine(
        pos.x,
        pos.y,
        next.x,
        next.y,
        "#00ff00",
        1,
      );

      pos = next;
      vy += g * dt;
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }
}

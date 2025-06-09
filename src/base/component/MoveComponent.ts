import { BaseComponent } from "./BaseComponent";
import { ComponentType } from "./ComponentConst";
import { AvatarComponent } from "./AvatarComponent";
import { Action } from "../entity/EntityConst";
import { PathNode } from "../BaseConst";

/**
 * @date 2025/6/9
 */
export class MoveComponent extends BaseComponent {
  private _moveInterval = 1; //间隔，毫秒
  private _lastMoveTime = 0;
  private _pathList: PathNode[] = [];
  private _targetNode: PathNode;

  public addPath(node: PathNode): void {
    if (!node) return;
    this._pathList.push(node);
  }

  public start(): void {
    super.start();
    this._targetNode = <any>undefined;
    this._pathList.length = 0;
  }

  public stop(): void {
    super.stop();
  }

  public update(elapsed: number): void {
    if (!this._targetNode) {
      this._targetNode = this._pathList.shift();
    }
    if (!this._targetNode) {
      return;
    }

    const entity = this.entity;
    const vo = entity.vo;
    const avatar = <AvatarComponent>entity.getComponent(ComponentType.AVATAR);
    const dis = Laya.timer.currTimer - this._lastMoveTime;
    if (vo.point.x > this._targetNode.x) {
      if (dis > this._moveInterval) {
        vo.point.x -= 5;
        this._lastMoveTime = Laya.timer.currTimer;
      }
    } else {
      this._targetNode = <any>undefined;
      avatar.entity.vo.action = Action.ATTACK;
      this.stop();
    }
  }
}

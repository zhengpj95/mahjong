import { BaseComponent } from "./BaseComponent";
import { Action } from "../entity/EntityConst";
import { DamageHurt } from "../entity/DamageHurt";
import { ComponentType } from "./ComponentConst";
import Tween = Laya.Tween;
import Handler = Laya.Handler;
import poolMgr = base.poolMgr;

const ATTACK_DIS = 50;

/**
 * @date 2025/6/9
 */
export class BattleComponent extends BaseComponent {
  private _isAttack = false;
  private _lastAttackTime = 0;

  public start(): void {
    super.start();
  }

  public stop(): void {
    super.stop();
    this._isAttack = false;
  }

  public update(elapsed: number): void {
    super.update(elapsed);
    const entity = this.entity;
    if (!entity || !entity.battle) {
      return;
    }

    if (!this._isAttack) {
      if (this.canAttack()) {
        this.startAttack();
      }
    } else {
      if (!this.canAttack()) {
        this.stopAttack();
      } else {
        this.continueAttack(elapsed);
      }
    }
  }

  private canAttack(): boolean {
    const attackDis = ATTACK_DIS;
    const vo = this.entity.vo;
    const battleVo = this.entity.battle.vo;
    if (battleVo.hp <= 0) return false;
    return (
      Math.abs(battleVo.point.x - vo.point.x) <= attackDis &&
      Math.abs(battleVo.point.y - vo.point.y) <= attackDis
    );
  }

  private startAttack(): void {
    this.entity.vo.action = Action.ATTACK;
    this._isAttack = true;
    this._lastAttackTime = 0;
    const battleObj = this.entity.battle;
    if (!battleObj) {
      battleObj.battle = this.entity;
    }
    console.log(
      `11111 BattleComp ${this.entity.vo.name} attack ${this.entity.battle.vo.name}`,
    );
  }

  private stopAttack(): void {
    this.entity.vo.action = Action.IDLE;
    this._isAttack = false;
    this.entity.battle = null;
    this._lastAttackTime = 0;
  }

  private continueAttack(delta: number): void {
    this._lastAttackTime += delta;
    if (this._lastAttackTime < 400) return;
    this._lastAttackTime = 0;

    // todo
    let randomHp = (Math.random() * 1000) >> 0;
    if (randomHp < 100) randomHp += 100;
    this.entity.battle.vo.hp -= randomHp;
    // console.log(
    //   `11111 BattleComp continueAttack ${this.entity.battle.vo.hp} ${randomHp}`,
    // );

    const damageItem = poolMgr.alloc(DamageHurt);
    const display = this.entity.battle.getComponent(
      ComponentType.AVATAR,
    ).display;
    display.addChild(damageItem);
    damageItem.damage = randomHp;
    damageItem.pos(display.width / 2, 0);
    damageItem.alpha = 1;
    Tween.to(
      damageItem,
      { y: -100, alpha: 0.7 },
      800,
      null,
      Handler.create(this, () => {
        damageItem.free();
        damageItem.removeSelf();
      }),
    );
  }
}

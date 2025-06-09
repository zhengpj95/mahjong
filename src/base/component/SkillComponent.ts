import Sprite = Laya.Sprite;
import BmpMovieClip = base.BmpMovieClip;
import CallBack = base.CallBack;
import poolMgr = base.poolMgr;
import { BaseComponent } from "./BaseComponent";
import { ComponentType } from "./ComponentConst";
import { ScenePlayerVO } from "../entity/SceneEntityVO";

function getSkillEffect(skillId: number): string {
  return "resources/effect/circle_explosion";
}

let sprite: Sprite;

function createContainer(): Sprite {
  if (!sprite) {
    sprite = new Sprite();
  }
  sprite.x = sprite.y = 0;
  sprite.height = sprite.width = NaN;
  sprite.scaleX = sprite.scaleY = sprite.alpha = 1;
  return sprite;
}

/**
 * @author zpj
 * @date 2025/6/9
 */
export class SkillComponent extends BaseComponent {
  private _mc: BmpMovieClip;
  private _skillId: number;
  private _skillEffect: string;

  public start(): void {
    super.start();
    if (!this._mc) {
      this._mc = poolMgr.alloc(BmpMovieClip);
      const skills = (this.entity.vo as ScenePlayerVO).skills || [];
      this._skillId = skills.shift();
      this._skillEffect = getSkillEffect(this._skillId);
      if (this._skillEffect) {
        const sprite = createContainer();
        const vo = this.entity.battle.vo;
        this.entity.battle
          .getComponent(ComponentType.AVATAR)
          .display.addChildAt(sprite, 0);
        this._mc.play(
          this._skillEffect,
          sprite,
          1,
          CallBack.alloc(this, this.playSkillEnd),
          true,
          true,
        );
      }
    }
  }

  private playSkillEnd(): void {
    this.entity.removeComponent(this.type);
  }

  public stop(): void {
    super.stop();
  }
}

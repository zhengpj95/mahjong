import { ScenePlayerVO } from "./SceneEntityVO";
import { ComponentType } from "../component/ComponentConst";
import { SceneEntity } from "./SceneEntity";

/**
 * @date 2025/6/9
 */
export class ScenePlayer extends SceneEntity {
  public init(vo: ScenePlayerVO): void {
    super.init(vo);
    if (!vo.skills) {
      vo.skills = [];
    }
    this.addComponent(ComponentType.AVATAR);
    this.addComponent(ComponentType.BATTLE);
  }

  public update(elapsed: number): void {
    super.update(elapsed);

    this.addSkillId();

    if (this.canAddSkill()) {
      this.addSkill();
    }
  }

  private addSkillId(): void {
    if (
      this.vo &&
      this.battle &&
      !this.getComponent(ComponentType.SKILL) &&
      this.battle.vo.hp < (this.battle.vo.maxHp / 2) >> 0
    ) {
      if (!(this.vo as ScenePlayerVO).skills) {
        (this.vo as ScenePlayerVO).skills = [];
      }
      (this.vo as ScenePlayerVO).skills.push(10001);
    }
  }

  private canAddSkill(): boolean {
    if (!this.battle || !this.vo) return false;
    const skills = (this.vo as ScenePlayerVO).skills || [];
    if (!skills || !skills.length) return false;
    return skills.length && !this.getComponent(ComponentType.SKILL);
  }

  private addSkill(): void {
    if (!this.getComponent(ComponentType.SKILL)) {
      this.addComponent(ComponentType.SKILL);
    }
  }
}

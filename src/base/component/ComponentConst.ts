import { AvatarComponent } from "./AvatarComponent";
import { MoveComponent } from "./MoveComponent";
import { BattleComponent } from "./BattleComponent";
import { SkillComponent } from "./SkillComponent";

/**
 * @date 2025/6/9
 */
export const enum ComponentType {
  NONE = 0,
  AVATAR = 1,
  MAP = 2,
  MOVE = 3,
  CAMERA = 4,
  BATTLE = 5,
  SKILL = 6,
}

/**代码提示用*/
export interface IComponentTypeMap {
  [ComponentType.AVATAR]: AvatarComponent;
  [ComponentType.MOVE]: MoveComponent;
  [ComponentType.BATTLE]: BattleComponent;
  [ComponentType.SKILL]: SkillComponent;
}

export const ComponentTypeMap: {
  [K in keyof IComponentTypeMap]: new () => IComponentTypeMap[K];
} = {
  [ComponentType.AVATAR]: AvatarComponent,
  [ComponentType.MOVE]: MoveComponent,
  [ComponentType.BATTLE]: BattleComponent,
  [ComponentType.SKILL]: SkillComponent,
};

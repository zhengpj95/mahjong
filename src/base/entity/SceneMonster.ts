import { SceneMonsterVo } from "./SceneEntityVO";
import { ComponentType } from "../component/ComponentConst";
import { SceneEntity } from "./SceneEntity";
import { PathNode } from "../BaseConst";

/**
 * @date 2025/6/9
 */
export class SceneMonster extends SceneEntity {
  public init(vo: SceneMonsterVo): void {
    super.init(vo);
    this.addComponent(ComponentType.AVATAR);
    this.addComponent(ComponentType.MOVE);
    this.addComponent(ComponentType.BATTLE);
  }

  /**添加路径*/
  public addPath(node: PathNode): void {
    const comp = this.getComponent(ComponentType.MOVE);
    if (comp) {
      comp.addPath(node);
    }
  }

  public update(elapsed: number): void {
    super.update(elapsed);
  }
}

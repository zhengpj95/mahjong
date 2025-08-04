import { SceneViewType } from "@def/scene";
import { SceneMdr } from "./mdr/SceneMdr";
import { SceneProxy } from "./model/SceneProxy";
import { ModuleName, ProxyType } from "@def/module-name";
import BaseModule = base.BaseModule;

/**
 * @date 2025/6/9
 */
export class SceneModule extends BaseModule {
  constructor() {
    super(ModuleName.SCENE);
  }

  protected initCmd(): void {
    //
  }

  public initProxy(): void {
    this.regProxy(ProxyType.SCENE, SceneProxy);
  }

  public initMdr(): void {
    this.regMdr(SceneViewType.SCENE, SceneMdr);
  }
}

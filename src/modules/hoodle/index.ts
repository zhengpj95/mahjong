import BaseModule = base.BaseModule;
import { ModuleType } from "@def/module-type";
import { HoodleMdr } from "./view/HoodleMdr";
import { HoodleViewType } from "@def/hoodle";

/**
 * @author zpj
 * @date 2025/5/20
 */
export class HoodleModule extends BaseModule {
  constructor() {
    super(ModuleType.HOODLE);
  }

  protected initCmd(): void {
  }

  protected initMdr(): void {
    this.regMdr(HoodleViewType.HOODLE, HoodleMdr);
  }

  protected initProxy(): void {
  }

}
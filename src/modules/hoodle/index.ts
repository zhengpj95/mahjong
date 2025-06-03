import BaseModule = base.BaseModule;
import { ModuleName } from "@def/module-name";
import { HoodleMdr } from "./view/HoodleMdr";
import { HoodleViewType } from "@def/hoodle";

/**
 * @author zpj
 * @date 2025/5/20
 */
export class HoodleModule extends BaseModule {
  constructor() {
    super(ModuleName.HOODLE);
  }

  protected initCmd(): void {
  }

  protected initMdr(): void {
    this.regMdr(HoodleViewType.HOODLE, HoodleMdr);
  }

  protected initProxy(): void {
  }

}
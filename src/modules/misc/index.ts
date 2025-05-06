import BaseModule = base.BaseModule;
import { ModuleType } from "@def/module-type";
import { MiscViewType } from "@def/misc";
import RuleMdr from "./view/RuleMdr";

/**
 * @author zpj
 * @date 2025/4/29
 */
export class MiscModule extends BaseModule {
  constructor() {
    super(ModuleType.MISC);
  }

  protected initCmd(): void {
  }

  protected initMdr(): void {
    this.regMdr(MiscViewType.RULE, RuleMdr);
  }

  protected initProxy(): void {
  }
}
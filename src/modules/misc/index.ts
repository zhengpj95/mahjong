import BaseModule = base.BaseModule;
import { ModuleType } from "@def/module-type";
import { MiscEvent, MiscViewType } from "@def/misc";
import RuleMdr from "./view/RuleMdr";
import { ShowTipsCmd } from "./cmd/ShowTipsCmd";
import { TestMdr } from "./view/TestMdr";

/**
 * @author zpj
 * @date 2025/4/29
 */
export class MiscModule extends BaseModule {
  constructor() {
    super(ModuleType.MISC);
  }

  protected initCmd(): void {
    this.regCmd(MiscEvent.SHOW_TIPS, ShowTipsCmd);
  }

  protected initMdr(): void {
    this.regMdr(MiscViewType.RULE, RuleMdr);
    this.regMdr(MiscViewType.TEST, TestMdr);
  }

  protected initProxy(): void {
  }
}
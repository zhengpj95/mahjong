import BaseModule = base.BaseModule;
import { ModuleName } from "@def/module-name";
import { MiscEvent, MiscViewType } from "@def/misc";
import RuleMdr from "./view/RuleMdr";
import { ShowTipsCmd } from "./cmd/ShowTipsCmd";
import { PlaySoundCmd } from "./cmd/PlaySoundCmd";

/**
 * @author zpj
 * @date 2025/4/29
 */
export class MiscModule extends BaseModule {
  constructor() {
    super(ModuleName.MISC);
  }

  protected initCmd(): void {
    this.regCmd(MiscEvent.SHOW_TIPS, ShowTipsCmd);
    this.regCmd(MiscEvent.PLAY_SOUND, PlaySoundCmd);
  }

  protected initMdr(): void {
    this.regMdr(MiscViewType.RULE, RuleMdr);
  }

  protected initProxy(): void {
  }
}
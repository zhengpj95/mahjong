import BaseCommand = base.BaseCommand;
import EventVo = base.EventVo;
import { TipsMdr } from "../view/TipsMdr";

let mdr: TipsMdr | undefined;

/**
 * @author zpj
 * @date 2025/5/6
 */
export class ShowTipsCmd extends BaseCommand {
  public exec(e: EventVo<string>): void {
    const str = e.data ?? "";
    if (!mdr) {
      mdr = new TipsMdr();
    }
    mdr.addTips(str);
  }
}

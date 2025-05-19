import BaseCommand = base.BaseCommand;
import { TipsMdr } from "../view/TipsMdr";

let mdr: TipsMdr | undefined;

/**
 * @author zpj
 * @date 2025/5/6
 */
export class ShowTipsCmd extends BaseCommand {
  public exec(str: string): void {
    if (!mdr) {
      mdr = new TipsMdr();
    }
    mdr.addTips(str);
  }
}
import { ui } from "@ui/layaMaxUI";
import Image = Laya.Image;
import Label = Laya.Label;
import RuleUI = ui.modules.common.RuleUI;
import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;

/**
 * @author zpj
 * @date 2025/4/23
 */
export default class RuleMdr extends BaseMediator<RuleUI> {
  private _btnClose: Image;

  constructor() {
    super(LayerIndex.MODAL, "modules/common/Rule.scene",true);
  }

  protected addEvents(): void {
  }

  protected initUI(): void {
  }

  protected onClose(): void {
    console.log(`11111 RuleMdr onClose`);
  }

  protected onOpen(): void {
    const labDesc = <Label>this.ui.getChildByName("boxInfo").getChildByName("labDesc");
    labDesc.text = this.params;
    this._btnClose = <Image>this.ui.getChildByName("boxInfo").getChildByName("btnClose");
    this._btnClose.once(Laya.Event.CLICK, this, this.close);
  }
}
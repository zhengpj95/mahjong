import { ui } from "@ui/layaMaxUI";
import { addPopupMask, LayerIndex, removePopupMask, setLayerIndex } from "@base/LayerManager";
import Image = Laya.Image;
import Label = Laya.Label;
import RuleUI = ui.modules.common.RuleUI;

/**
 * @author zpj
 * @date 2025/4/23
 */
export default class RuleMdr extends RuleUI {
  private _btnClose: Image;

  public createChildren(): void {
    super.createChildren();
    setLayerIndex(this, LayerIndex.MODAL);
    addPopupMask();
  }

  public onOpened(param?: any): void {
    super.onOpened(param);

    const labDesc = <Label>this.getChildByName("boxInfo").getChildByName("labDesc");
    labDesc.text = param;
    this._btnClose = <Image>this.getChildByName("boxInfo").getChildByName("btnClose");
    this._btnClose.once(Laya.Event.CLICK, this, this.close);
  }

  onDestroy() {
    super.onDestroy();
    console.log(`11111 destroy`);
  }

  onClosed(type?: string) {
    super.onClosed(type);
    console.log(`11111 closed`);
    removePopupMask();
  }
}
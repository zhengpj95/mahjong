import { ui } from "@ui/layaMaxUI";
import { LayerIndex, setLayerIndex } from "@base/LayerManager";

/**
 * 结算弹窗
 * @date 2025/1/19
 */
export default class MahjongResultMdr extends ui.modules.mahjong.MahjongResultUI {
  createChildren() {
    super.createChildren();
    setLayerIndex(this, LayerIndex.MODAL);
  }

  onOpened(param: any) {
    super.onOpened(param);
  }

  onClosed(type?: string) {
    super.onClosed(type);
  }
}
import { ui } from "@ui/layaMaxUI";

/**
 * 结算弹窗
 * @date 2025/1/19
 */
export default class MahjongResultMdr extends ui.modules.mahjong.MahjongResultUI {
  /** 标记为modal层处理 */
  public _isModal_ = true;

  createChildren() {
    super.createChildren();
  }

  onOpened(param: any) {
    super.onOpened(param);
  }

  onClosed(type?: string) {
    super.onClosed(type);
  }
}
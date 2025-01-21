import { ui } from "@ui/layaMaxUI";
import { LayerIndex, setLayerIndex } from "@base/LayerManager";
import { MahjongEvent } from "@def/mahjong";
import Handler = Laya.Handler;

/**
 * 结算弹窗
 * @date 2025/1/19
 */
export default class MahjongResultMdr extends ui.modules.mahjong.MahjongResultUI {
  createChildren() {
    super.createChildren();
    setLayerIndex(this, LayerIndex.MODAL);

    this.btnHome.clickHandler = Handler.create(this, this.onClickHome, undefined, false);
    this.btnNext.clickHandler = Handler.create(this, this.onClickNext, undefined, false);
  }

  onOpened(param: any) {
    super.onOpened(param);
  }

  onClosed(type?: string) {
    super.onClosed(type);
  }

  private onClickHome(): void {
    //
  }

  private onClickNext(): void {
    base.facade.sendNt(MahjongEvent.UPDATE_NEXT);
    this.close();
  }
}
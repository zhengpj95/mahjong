import { ui } from "@ui/layaMaxUI";
import { LayerIndex, setLayerIndex } from "@base/LayerManager";
import { MahjongEvent } from "@def/mahjong";
import { eventMgr } from "@base/event/EventManager";
import { MahjongProxy } from "./MahjongProxy";
import ComUtils from "@base/utils/ComUtils";
import Handler = Laya.Handler;
import Label = Laya.Label;
import Scene = Laya.Scene;

/**
 * 结算弹窗
 * @date 2025/1/19
 */
export default class MahjongResultMdr extends ui.modules.mahjong.MahjongResultUI {
  private _lab: Label;
  private _proxy: MahjongProxy;

  createChildren() {
    super.createChildren();
    setLayerIndex(this, LayerIndex.MODAL);

    this._proxy = MahjongProxy.ins();
    this._lab = ComUtils.getNodeByNameList<Label>(this, ["boxHtml", "lab"]);
    this.btnHome.clickHandler = Handler.create(this, this.onClickHome, undefined, true);
    this.btnNext.clickHandler = Handler.create(this, this.onClickNext, undefined, true);
  }

  onOpened(param: any) {
    super.onOpened(param);

    this._lab.text = `得分: ` + this._proxy.model.levelScore;
  }

  onClosed(type?: string) {
    super.onClosed(type);
  }

  private onClickHome(): void {
    Scene.open("modules/mahjong/MahjongHome.scene");
    this.close();
  }

  private onClickNext(): void {
    eventMgr.event(MahjongEvent.UPDATE_NEXT);
    this.close();
  }
}
import { ui } from "@ui/layaMaxUI";
import { LayerIndex, setLayerIndex } from "@base/LayerManager";
import { IMahjongResultParam, MahjongEvent } from "@def/mahjong";
import { eventMgr } from "@base/event/EventManager";
import { MahjongProxy } from "../model/MahjongProxy";
import ComUtils from "@base/utils/ComUtils";
import Label = Laya.Label;
import Scene = Laya.Scene;
import Event = Laya.Event;

/**
 * 结算弹窗
 * @date 2025/1/19
 */
export default class MahjongResultMdr extends ui.modules.mahjong.MahjongResultUI {
  private _lab: Label;
  private _proxy: MahjongProxy;
  private _param?: IMahjongResultParam;

  createChildren() {
    super.createChildren();
    setLayerIndex(this, LayerIndex.MODAL);

    this._proxy = MahjongProxy.ins();
    this._lab = ComUtils.getNodeByNameList<Label>(this, ["boxHtml", "lab"]);
    this.btnHome.once(Event.CLICK, this, this.onClickHome);
    this.btnNext.once(Event.CLICK, this, this.onClickNext);
  }

  onOpened(param: any) {
    super.onOpened(param);
    this._param = param;

    if (!this._param || !this._param.type) {
      this._lab.text = `得分: ` + this._proxy.model.levelScore;
      this.btnNext.text.text = `下一关`;
      this._proxy.model.challengeSuccess();
    } else {
      this._lab.text = `挑战时间已到，挑战失败！`;
      this.btnNext.text.text = `重新挑战`;
    }
  }

  onClosed(type?: string) {
    super.onClosed(type);
    this.btnHome.off(Event.CLICK, this, this.onClickHome);
    this.btnNext.off(Event.CLICK, this, this.onClickNext);
  }

  private onClickHome(): void {
    console.warn("MahjongResultMdr.onClickHome...");
    Scene.open("modules/mahjong/MahjongHome.scene");
    this.close();
  }

  private onClickNext(): void {
    const challengeAgain = this._param && this._param.type === 1;
    console.warn(`MahjongResultMdr.onClickNext... challengeAgain:${challengeAgain}`);
    eventMgr.event(MahjongEvent.UPDATE_NEXT, challengeAgain); // true 是重新挑战
    this.close();
  }
}
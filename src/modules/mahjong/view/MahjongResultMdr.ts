import { ui } from "@ui/layaMaxUI";
import { addPopupMask, LayerIndex, removePopupMask, setLayerIndex } from "@base/LayerManager";
import { IMahjongResultParam, MahjongEvent } from "@def/mahjong";
import { MahjongProxy } from "../model/MahjongProxy";
import ComUtils from "@base/utils/ComUtils";
import { ModuleType, ProxyType } from "@def/module-type";
import Label = Laya.Label;
import MahjongResultUI = ui.modules.mahjong.MahjongResultUI;
import Scene = Laya.Scene;
import eventMgr = base.eventMgr;

/**
 * 结算弹窗
 * @date 2025/1/19
 */
export default class MahjongResultMdr extends MahjongResultUI {
  private _lab: Label;
  private _proxy: MahjongProxy;
  private _param?: IMahjongResultParam;

  createChildren() {
    super.createChildren();
    setLayerIndex(this, LayerIndex.MODAL);
    addPopupMask();
  }

  onOpened(param: any) {
    super.onOpened(param);
    this._proxy = base.facade.getProxy(ModuleType.MAHJONG, ProxyType.MAHJONG);
    this._param = param;

    this._lab = ComUtils.getNodeByNameList<Label>(this, ["boxHtml", "lab"]);
    this.btnHome.on(Laya.Event.CLICK, this, this.onClickHome);
    this.btnNext.on(Laya.Event.CLICK, this, this.onClickNext);

    const btnNextLab = <Label>this.btnNext.getChildByName("lab");
    if (!this._param || !this._param.type) {
      this._lab.text = `得分: ` + this._proxy.model.levelScore;
      btnNextLab.text = `下一关`;
      this._proxy.cMahjongSuccess();
    } else {
      this._lab.text = `挑战时间已到，挑战失败！`;
      btnNextLab.text = `重新挑战`;
    }
  }

  onClosed(type?: string) {
    super.onClosed(type);
    this.btnHome.off(Laya.Event.CLICK, this, this.onClickHome);
    this.btnNext.off(Laya.Event.CLICK, this, this.onClickNext);
  }

  private onClickHome(): void {
    console.warn("MahjongResultMdr.onClickHome...");
    Scene.open("modules/mahjong/MahjongHome.scene");
    this.close();
  }

  private onClickNext(): void {
    const challengeAgain = this._param && this._param.type === 1;
    console.warn(`MahjongResultMdr.onClickNext... challengeAgain:${challengeAgain}`);
    eventMgr.emit(MahjongEvent.UPDATE_NEXT, challengeAgain); // true 是重新挑战
    this.close();
  }

  public close(type?: string) {
    super.close(type);
    removePopupMask();
  }
}
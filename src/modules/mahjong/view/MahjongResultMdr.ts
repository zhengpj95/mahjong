import { IMahjongResultParam, MahjongEvent, MahjongViewType } from "@def/mahjong";
import { MahjongProxy } from "../model/MahjongProxy";
import ComUtils from "@base/utils/ComUtils";
import { ModuleType, ProxyType } from "@def/module-type";
import Label = Laya.Label;
import eventMgr = base.eventMgr;
import BaseMediator = base.BaseMediator;
import facade = base.facade;
import Sprite = Laya.Sprite;
import Image = Laya.Image;

/**
 * 结算弹窗
 * @date 2025/1/19
 */
export default class MahjongResultMdr extends BaseMediator<Sprite> {
  private _lab: Label;
  private _proxy: MahjongProxy;
  private _param?: IMahjongResultParam;
  private _btnHome: Image;
  private _btnNext: Image;

  constructor() {
    super(2, "scene/mahjong/MahjongResult.ls");
  }

  protected addEvents(): void {
  }

  protected initUI(): void {
    this._btnHome = <Image>this.ui.getChildByName("btnHome");
    this._btnNext = <Image>this.ui.getChildByName("btnNext");
  }

  protected onClose(): void {
    this.removeEvents();
  }

  protected onOpen(): void {
    this._proxy = base.facade.getProxy(ModuleType.MAHJONG, ProxyType.MAHJONG);
    this._param = this.params;

    this._lab = ComUtils.getNodeByNameList<Label>(this.ui, ["boxHtml", "lab"]);
    this._btnHome.on(Laya.Event.CLICK, this, this.onClickHome);
    this._btnNext.on(Laya.Event.CLICK, this, this.onClickNext);

    const btnNextLab = <Label>this._btnNext.getChildByName("lab");
    if (!this._param || !this._param.type) {
      this._lab.text = `得分: ` + this._proxy.model.levelScore;
      btnNextLab.text = `下一关`;
      this._proxy.cMahjongSuccess();
    } else {
      this._lab.text = `挑战时间已到，挑战失败！`;
      btnNextLab.text = `重新挑战`;
    }
  }

  private removeEvents(): void {
    this._btnHome.off(Laya.Event.CLICK, this, this.onClickHome);
    this._btnNext.off(Laya.Event.CLICK, this, this.onClickNext);
  }

  private onClickHome(): void {
    console.warn("MahjongResultMdr.onClickHome...");
    facade.openView(ModuleType.MAHJONG, MahjongViewType.HOME);
    facade.closeView(ModuleType.MAHJONG, MahjongViewType.MAIN);
    this.close();
  }

  private onClickNext(): void {
    const challengeAgain = this._param && this._param.type === 1;
    console.warn(`MahjongResultMdr.onClickNext... challengeAgain:${challengeAgain}`);
    eventMgr.emit(MahjongEvent.UPDATE_NEXT, challengeAgain); // true 是重新挑战
    this.close();
  }

  public close(): void {
    super.close();
  }
}
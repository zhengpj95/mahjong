import { ui } from "@ui/layaMaxUI";
import { MahjongProxy } from "../model/MahjongProxy";
import ComUtils from "@base/utils/ComUtils";
import { MahjongEvent } from "@def/mahjong";
import { eventMgr } from "@base/event/EventManager";
import { showTips } from "../../misc/TipsMdr";
import { MahjongCardData } from "../model/MahjongCardData";
import { BarProgressComp } from "@script/index";
import List = Laya.List;
import Handler = Laya.Handler;
import Box = Laya.Box;
import Image = Laya.Image;
import Event = Laya.Event;
import SoundManager = Laya.SoundManager;
import Button = Laya.Button;
import Label = Laya.Label;
import CallBack = base.CallBack;

type BoxRender = Box & {
  boxCard: Box & {
    img: Image
  }
}

type BoxCard = Box & {
  img: Image
  imgSelected: Image;
}

const INIT_SCALE = 0.4;
const BIG_SCALE = 0.42;

/**
 * @date 2024/12/22
 */
export default class MahjongMdr extends ui.modules.mahjong.MahjongUI {
  private _proxy: MahjongProxy;
  private _list: List;
  private _preIdx = -1;
  private _btnTips: Button;
  private _btnRefresh: Button;
  private _lastScoreTime = 0;
  private _endTime = 0;

  constructor() {
    super();
    this._proxy = MahjongProxy.ins();
  }

  createChildren() {
    super.createChildren();
    this._list = <List>this.getChildByName("listItem");
    this._list.renderHandler = Handler.create(this, this.onRenderListItem, undefined, false);

    this._btnTips = <Button>this.getChildByName("btnTips");
    this._btnRefresh = <Button>this.getChildByName("btnRefresh");
    this._btnTips.clickHandler = Handler.create(this, this.onBtnTips, undefined, false);
    this._btnRefresh.clickHandler = Handler.create(this, this.onBtnRefresh, undefined, false);


    eventMgr.on(MahjongEvent.UPDATE_NEXT, this, this.onRefreshNext);
    eventMgr.on(MahjongEvent.SHOW_RESULT, this, this.showResultToClear);
  }

  onOpened(param: any) {
    super.onOpened(param);
    this._proxy.model.clearData();
    Laya.loader.load("res/atlas/mahjong.atlas", Laya.Handler.create(this, this.onLoadedSuccess, undefined, true));
  }

  onClosed(type?: string) {
    super.onClosed(type);
    this._preIdx = -1;
    this._btnTips.clickHandler.clear();
    this._btnTips.clickHandler = undefined;
    this._btnRefresh.clickHandler.clear();
    this._btnRefresh.clickHandler = undefined;
  }

  private onLoadedSuccess(): void {
    console.warn("11111 onLoadedSuccess");
    this.onRefreshNext();
  }

  private onRefreshNext(data?: boolean): void {
    console.warn(`11111 onRefreshNext level:${this._proxy.model.level}`);
    this._proxy.model.showNext(data);

    this.resetScore();
    this.updateLevel();
    const list = this._proxy.model.getMahjongData();
    this._list.array = list.reduce((a, b) => a.concat(b));
    this.updateBar();
  }

  private updateBar(): void {
    const now = Date.now() / 1000 >> 0;
    this._endTime = now + this._proxy.model.getChallengeTime();
    const bar = <BarProgressComp>this.getChildByName("bar");
    bar.value = 1;
    base.tweenMgr.remove(bar);
    base.tweenMgr.get(bar).to({ value: 0 }, (this._endTime - now) * 1000, null, CallBack.alloc(this, this.onTimeOut, true));
  }

  // 展示结算弹窗时候，清除操作
  private showResultToClear(): void {
    const bar = <Box>this.getChildByName("bar");
    base.tweenMgr.remove(bar);
  }

  // 失败结束
  private onTimeOut(): void {
    this._proxy.model.showResult({ type: 1 });
  }

  private onRenderListItem(item: BoxRender, index: number): void {
    const boxCard = <BoxCard>item.getChildByName("boxCard");
    const img = ComUtils.getNodeByNameList<Image>(boxCard, ["img"]);
    const data: MahjongCardData = item.dataSource;
    if (!data) {
      img.skin = "";
      return;
    }
    item.tag = data;
    img.skin = data.getIcon();
    ComUtils.setScale(boxCard, INIT_SCALE);
    this.setSelect(boxCard, false);

    item.on(Event.CLICK, this, this.onClickItem, [index]);
  }

  private onClickItem(index: number): void {
    if (this._preIdx > -1 && index === this._preIdx) {
      // 同一个牌，则清除
      const boxCard = <BoxCard>this._list.getCell(index).getChildByName("boxCard");
      this._preIdx = -1;
      ComUtils.setScale(boxCard, INIT_SCALE);
      this.setSelect(boxCard, false);
      return;
    }

    SoundManager.playSound("audio/mixkit-flop.wav");
    if (this._preIdx > -1 && index !== this._preIdx) {
      const curItemData: MahjongCardData = this._list.getItem(index);
      const preItemData: MahjongCardData = this._list.getItem(this._preIdx);
      const curItem = <BoxCard>this._list.getCell(index).getChildByName("boxCard");
      const preItem = <BoxCard>this._list.getCell(this._preIdx).getChildByName("boxCard");
      if (curItemData && curItemData.checkSame(preItemData)
        && this._proxy.model.canConnect(preItemData, curItemData)) {
        ComUtils.setScale(curItem, BIG_SCALE);
        this.clearCardItem(curItem, index);
        this.setSelect(curItem, true);
        this.clearCardItem(preItem, this._preIdx);
        this.addScore();
      } else {
        ComUtils.setScale(curItem, INIT_SCALE);
        ComUtils.setScale(preItem, INIT_SCALE);
        this.setSelect(curItem, false);
        this.setSelect(preItem, false);
      }
      this._preIdx = -1;
    } else {
      const item = this._list.getCell(index);
      const cardData = <MahjongCardData>item.dataSource;
      if (!cardData || !cardData.isValid()) {
        this._preIdx = -1;
        return;
      }
      this._preIdx = index;
      const boxCard = <BoxCard>item.getChildByName("boxCard");
      ComUtils.setScale(boxCard, BIG_SCALE);
      this.setSelect(boxCard, true);
    }
  }

  private updateLevel(): void {
    const lab = <Label>this.getChildByName("labLevel");
    lab.text = "关卡：" + this._proxy.model.level;
  }

  private addScore(): void {
    const now = Date.now();
    const diffTime = now - this._lastScoreTime;
    let score = 1; // 消除间隔不同，加分不同
    if (diffTime < 2 * 1000) {
      score = 5;
    } else if (diffTime < 5 * 1000) {
      score = 3;
    }
    this._proxy.model.levelScore += score;
    this._lastScoreTime = now;
    const lab = ComUtils.getNodeByNameList<Label>(this, ["boxScore", "lab"]);
    lab.text = this._proxy.model.levelScore + "";
  }

  private resetScore(): void {
    this._lastScoreTime = 0;
    const lab = ComUtils.getNodeByNameList<Label>(this, ["boxScore", "lab"]);
    lab.text = "0";
  }

  private clearCardItem(box: BoxCard, index: number): void {
    const idx = index;
    ComUtils.setTween(box, true, Handler.create(this, () => {
      const curImg = box.getChildByName("img") as Image;
      curImg.skin = "";
      const imgSel = box.getChildByName("imgSelected") as Image;
      imgSel.visible = false;
      this._proxy.model.deleteCard(idx);
    }));
  }

  private setSelect(boxCard: BoxCard, isSel = false): void {
    const imgSel = ComUtils.getNodeByNameList<Image>(boxCard, ["imgSelected"]);
    if (imgSel) imgSel.visible = isSel;
  }

  // 提示
  private onBtnTips(): void {
    // 检查次数，有就继续，没有则拉起广告，给予次数 todo
    const cardList = this._proxy.model.getTipsCardDataList();
    if (cardList.length) {
      const cells = this._list.cells || [];
      for (let card of cardList) {
        const idx = card.row * this._proxy.model.col + card.col;
        const cardItem = <BoxCard>cells[idx].getChildByName("boxCard");
        if (cardItem) {
          ComUtils.setTween(cardItem);
        }
      }
    } else {
      showTips("无可消除的卡牌，请洗牌");
    }
  }

  // 洗牌
  private onBtnRefresh(): void {
    // 检查次数，有就继续，没有则拉起广告，给予次数 todo
    const list = this._proxy.model.getRefreshCardDataList();
    this._list.array = list.reduce((a, b) => a.concat(b));
    this._list.refresh();
    showTips("洗牌成功！");
  }
}
import { ui } from "@ui/layaMaxUI";
import { MahjongProxy } from "./MahjongProxy";
import { MahjongCardData } from "./MahjongModel";
import ComUtils from "@base/utils/ComUtils";
import { MahjongEvent } from "@def/mahjong";
import { eventMgr } from "@base/event/EventManager";
import List = Laya.List;
import Handler = Laya.Handler;
import Box = Laya.Box;
import Image = Laya.Image;
import Event = Laya.Event;
import SoundManager = Laya.SoundManager;
import Button = Laya.Button;
import Label = Laya.Label;

type BoxRender = Box & {
  boxCard: Box & {
    img: Image
  }
}

type BoxCard = Box & {
  img: Image;
}

const INIT_SCALE = 0.4;
const BIG_SCALE = 0.45;

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

    Laya.loader.load("res/atlas/mahjong.atlas", Laya.Handler.create(this, this.onLoadedSuccess, undefined, true));

    eventMgr.on(MahjongEvent.UPDATE_NEXT, this, this.onRefreshNext);
  }

  onOpened(param: any) {
    super.onOpened(param);
  }

  onClosed(type?: string) {
    super.onClosed(type);
    this._preIdx = -1;
  }

  private onLoadedSuccess(): void {
    console.warn("11111 onLoadedSuccess");
    this.onRefreshNext();
  }

  private onRefreshNext(): void {
    console.warn(`11111 onRefreshNext`);
    this._proxy.model.showNext();

    this.resetScore();
    this.updateLevel();
    const list = this._proxy.model.getMahjongData();
    this._list.array = list.reduce((a, b) => a.concat(b));
  }

  private onRenderListItem(item: BoxRender, index: number): void {
    const img = ComUtils.getNodeByNameList<Image>(item, ["boxCard", "img"]);
    const data: MahjongCardData = item.dataSource;
    if (!data) {
      img.skin = "";
      return;
    }
    item.tag = data;
    img.skin = data.getIcon();
    ComUtils.setScale(<BoxCard>item.getChildByName("boxCard"), INIT_SCALE);

    item.on(Event.CLICK, this, this.onClickItem, [index]);
    item.on(Event.MOUSE_DOWN, this, this.onClickMouseDown, [index]);
    item.on(Event.MOUSE_UP, this, this.onClickMouseUp, [index]);
    item.on(Event.MOUSE_OUT, this, this.onClickMouseUp, [index]);
  }

  private onClickItem(index: number): void {
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
        this.clearCardItem(preItem, this._preIdx);
        this.addScore();
      } else {
        ComUtils.setScale(curItem, INIT_SCALE);
        ComUtils.setScale(preItem, INIT_SCALE);
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
      this._proxy.model.deleteCard(idx);
    }));
  }

  private onClickMouseDown(index: number): void {
    //
  }

  private onClickMouseUp(index: number): void {
    //
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
    }
  }

  // 洗牌
  private onBtnRefresh(): void {
    // 检查次数，有就继续，没有则拉起广告，给予次数 todo
    const list = this._proxy.model.getRefreshCardDataList();
    this._list.array = list.reduce((a, b) => a.concat(b));
    this._list.refresh();
  }
}
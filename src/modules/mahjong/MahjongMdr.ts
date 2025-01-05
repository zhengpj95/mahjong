import { ui } from "@ui/layaMaxUI";
import { MahjongProxy } from "./MahjongProxy";
import { MahjongCardData } from "./MahjongModel";
import ComUtils from "@base/utils/ComUtils";
import List = Laya.List;
import Handler = Laya.Handler;
import Box = Laya.Box;
import Image = Laya.Image;
import Event = Laya.Event;
import SoundManager = Laya.SoundManager;
import Button = Laya.Button;

type BoxCard = Box & {
  boxCard: Box & {
    img: Image;
  }
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

    Laya.loader.load("res/atlas/mahjong.atlas", Laya.Handler.create(this, this.onLoadedSuccess));
    SoundManager.autoStopMusic = false;
    SoundManager.playMusic("audio/mixkit-tick-tock-clock-timer-music.wav", 0);
  }

  onOpened(param: any) {
    super.onOpened(param);
  }

  onClosed(type?: string) {
    super.onClosed(type);
    this._preIdx = -1;
  }

  private onLoadedSuccess(): void {
    console.log("11111 onLoadedSuccess");
    this._proxy.model.updateData(8, 10);
    const list = this._proxy.model.getMahjongData();
    this._list.array = list.reduce((a, b) => a.concat(b));
  }

  private onRenderListItem(item: BoxCard, index: number): void {
    const img = <Image>item.getChildByName("boxCard").getChildByName("img");
    const data: MahjongCardData = item.dataSource;
    if (!data) {
      img.skin = "";
      return;
    }
    item.tag = data;
    img.skin = data.getIcon();

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
      if (curItemData.checkSame(preItemData) && this._proxy.model.canConnect(curItemData, preItemData)) {
        ComUtils.setScale(curItem, BIG_SCALE);
        this.clearCardItem(curItem, index);
        this.clearCardItem(preItem, this._preIdx);
      } else {
        ComUtils.setScale(curItem, INIT_SCALE);
        ComUtils.setScale(preItem, INIT_SCALE);
      }
      this._preIdx = -1;
    } else {
      this._preIdx = index;
      const item = <BoxCard>this._list.getCell(index).getChildByName("boxCard");
      ComUtils.setScale(item, BIG_SCALE);
    }
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
    //
  }
}
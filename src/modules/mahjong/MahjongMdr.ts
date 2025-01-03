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

type BoxCard = Box & {
  boxCard: Box & {
    img: Image;
  }
}

/**
 * @date 2024/12/22
 */
export default class MahjongMdr extends ui.modules.mahjong.MahjongUI {
  private _proxy: MahjongProxy;
  private _list: List;
  private _preIdx = -1;

  constructor() {
    super();
    this._proxy = MahjongProxy.ins();
  }

  createChildren() {
    super.createChildren();
    this._list = <List>this.getChildByName("listItem");
    this._list.renderHandler = Handler.create(this, this.onRenderListItem, undefined, false);

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
    const list = this._proxy.model.getMahjongData();
    this._list.array = list.reduce((a, b) => a.concat(b));
    console.log(list);
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
      if (curItemData.checkSame(preItemData) && this._proxy.model.checkDfs(curItemData, preItemData)) {
        ComUtils.setScale(curItem, 0.45);
        this.clearCardItem(curItem, index);
        this.clearCardItem(preItem, this._preIdx);
      } else {
        ComUtils.setScale(curItem, 0.4);
        ComUtils.setScale(preItem, 0.4);
      }
      this._preIdx = -1;
    } else {
      this._preIdx = index;
      const item = <BoxCard>this._list.getCell(index).getChildByName("boxCard");
      // ComUtils.setTween(item);
      ComUtils.setScale(item, 0.45);
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
}
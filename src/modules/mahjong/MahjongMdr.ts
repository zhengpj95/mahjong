import { ui } from "@ui/layaMaxUI";
import { MahjongProxy } from "./MahjongProxy";
import { MahjongCardData } from "./MahjongModel";
import List = Laya.List;
import Handler = Laya.Handler;
import Box = Laya.Box;
import Image = Laya.Image;
import Event = Laya.Event;

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
    if (this._preIdx > -1) {
      const curItemData: MahjongCardData = this._list.getItem(index);
      const preItemData: MahjongCardData = this._list.getItem(this._preIdx);
      if (curItemData.checkSame(preItemData)) {
        const curImg = this._list.getCell(index).getChildByName("boxCard").getChildByName("img") as Image;
        curImg.skin = "";
        const preImg = this._list.getCell(this._preIdx).getChildByName("boxCard").getChildByName("img") as Image;
        preImg.skin = "";
        this._proxy.model.deleteCard(index);
        this._proxy.model.deleteCard(this._preIdx);
        console.log(11111, index, this._preIdx, curItemData, preItemData);
      }
      this._preIdx = -1;
    } else {
      this._preIdx = index;
    }
  }

  private onClickMouseDown(index: number): void {
    //
  }

  private onClickMouseUp(index: number): void {
    //
  }
}
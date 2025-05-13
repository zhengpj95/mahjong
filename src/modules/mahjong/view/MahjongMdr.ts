import { MahjongProxy } from "../model/MahjongProxy";
import ComUtils from "@base/utils/ComUtils";
import { MahjongEvent, MahjongScoreType } from "@def/mahjong";
import { MahjongCardData } from "../model/MahjongCardData";
import { BarProgressComp } from "@script/index";
import { ModuleType, ProxyType } from "@def/module-type";
import { ui } from "@ui/layaMaxUI";
import { MiscEvent, MiscViewType } from "@def/misc";
import List = Laya.List;
import Handler = Laya.Handler;
import Box = Laya.Box;
import Image = Laya.Image;
import Event = Laya.Event;
import SoundManager = Laya.SoundManager;
import Label = Laya.Label;
import BaseMediator = base.BaseMediator;
import MahjongUI = ui.modules.mahjong.MahjongUI;
import CallBack = base.CallBack;
import facade = base.facade;
import LayerIndex = base.LayerIndex;
import Point = Laya.Point;
import Sprite = Laya.Sprite;

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

const ruleDesc = `1.点击两张相同牌，用≤3条直线连接（可拐弯）\n
2.路径无阻挡即可消除\n 
3.⚡连击加分，消除间隔越短，分数加成越高！\n
4.💡 用 提示（扣5分） 👉 显示可消的一对牌\n
5.用 洗牌（扣10分）👉 重置剩余牌位置`;

/**
 * @date 2024/12/22
 */
export default class MahjongMdr extends BaseMediator<MahjongUI> {
  private _proxy: MahjongProxy;
  private _list: List;
  private _preIdx = -1;
  private _btnTips: Image;
  private _btnRefresh: Image;
  private _lastScoreTime = 0;
  private _endTime = 0;
  private _btnRule: Image;

  constructor() {
    super(LayerIndex.MAIN, "modules/mahjong/Mahjong.scene");
  }

  protected addEvents(): void {
    this.on(MahjongEvent.UPDATE_INFO, this.onRefreshNext, this);
    this.on(MahjongEvent.UPDATE_NEXT, this.onRefreshNext, this);
    this.on(MahjongEvent.SHOW_RESULT, this.showResultToClear, this);
    this.on(MahjongEvent.UPDATE_SCORE, this.updateScore, this);
  }

  protected initUI(): void {
    this._proxy = base.facade.getProxy(ModuleType.MAHJONG, ProxyType.MAHJONG);

    this._list = <List>this.ui.getChildByName("listItem");
    this._list.renderHandler = Handler.create(this, this.onRenderListItem, undefined, false);

    this._btnTips = <Image>this.ui.getChildByName("btnTips");
    this._btnRefresh = <Image>this.ui.getChildByName("btnRefresh");
    this._btnTips.on(Laya.Event.CLICK, this, this.onBtnTips);
    this._btnRefresh.on(Laya.Event.CLICK, this, this.onBtnRefresh);

    this._btnRule = <Image>this.ui.getChildByName("btnRule");
    this._btnRule.on(Laya.Event.CLICK, this, this.onClickRule);

  }

  protected onClose(): void {
    this._preIdx = -1;
    this._btnTips.off(Laya.Event.CLICK, this, this.onBtnTips);
    this._btnRefresh.off(Laya.Event.CLICK, this, this.onBtnRefresh);
    this.removeEvents();
  }

  protected onOpen(): void {
    this._proxy.model.clearData();
    this.onRefreshNext();
  }

  private removeEvents(): void {
    this.off(MahjongEvent.UPDATE_INFO, this.onRefreshNext, this);
    this.off(MahjongEvent.UPDATE_NEXT, this.onRefreshNext, this);
    this.off(MahjongEvent.SHOW_RESULT, this.showResultToClear, this);
    this.off(MahjongEvent.UPDATE_SCORE, this.updateScore, this);
  }

  private onRefreshNext(): void {
    console.warn(`11111 onRefreshNext cLv:${this._proxy.model.level}, nLv:${this._proxy.model.getNextLevel()}`);
    this._proxy.model.showNext();

    this.resetScore();
    this.updateLevel();
    const list = this._proxy.model.getMahjongData();
    this._list.array = list.reduce((a, b) => a.concat(b));
    this.updateBar();
  }

  private updateBar(): void {
    const now = Date.now() / 1000 >> 0;
    this._endTime = now + this._proxy.model.getChallengeTime();
    const bar = <BarProgressComp>this.ui.getChildByName("bar");
    bar.value = 1;
    base.tweenMgr.remove(bar);
    base.tweenMgr.get(bar).to({ value: 0 }, (this._endTime - now) * 1000, null, CallBack.alloc(this, this.onTimeOut, true));
  }

  // 展示结算弹窗时候，清除操作
  private showResultToClear(): void {
    const bar = <Box>this.ui.getChildByName("bar");
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
      const paths = this._proxy.model.findPath(preItemData, curItemData);
      if (curItemData && curItemData.checkSame(preItemData) && !!paths.length) {
        ComUtils.setScale(curItem, BIG_SCALE);
        this.clearCardItem(curItem, index);
        this.setSelect(curItem, true);
        this.clearCardItem(preItem, this._preIdx);
        this.addScore();
        const p = paths.map(item => {
          return { x: item[1] - 1, y: item[0] - 1 };
        });
        this.animateDrawLine(p);
        this.createGlowEffect(p);
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
    const lab = <Label>this.ui.getChildByName("labLevel");
    lab.text = "关卡：" + this._proxy.model.getNextLevel();
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
    this._lastScoreTime = now;
    this._proxy.model.updateScore(score);
    this.updateScore();
  }

  private updateScore(): void {
    const lab = ComUtils.getNodeByNameList<Label>(this.ui, ["boxScore", "lab"]);
    lab.text = this._proxy.model.levelScore + "";
    lab.color = this._proxy.model.levelScore > 0 ? "#42e422" : "#ff4646";
  }

  private resetScore(): void {
    this._lastScoreTime = 0;
    const lab = ComUtils.getNodeByNameList<Label>(this.ui, ["boxScore", "lab"]);
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
      this.emit(MiscEvent.SHOW_TIPS, "无可消除的卡牌，请洗牌!");
    }
    this._proxy.model.updateScore(-MahjongScoreType.TIPS);
  }

  // 洗牌
  private onBtnRefresh(): void {
    // 检查次数，有就继续，没有则拉起广告，给予次数 todo
    const list = this._proxy.model.getRefreshCardDataList();
    this._list.array = list.reduce((a, b) => a.concat(b));
    this._list.refresh();
    this.emit(MiscEvent.SHOW_TIPS, "洗牌成功!");
    this._proxy.model.updateScore(-MahjongScoreType.REFRESH);
  }

  private onClickRule(): void {
    facade.openView(ModuleType.MISC, MiscViewType.RULE, ruleDesc);
  }

  private _lineSprite: Sprite;
  private _glowSprite: Sprite;

  private animateDrawLine(path: { x: number, y: number }[], color: string = "#42e422"): void {
    const tileWidth = 52;
    const tileHeight = 70;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    if (!this._lineSprite) {
      this._lineSprite = new Laya.Sprite();
      this._lineSprite.width = Laya.stage.width;
      this._lineSprite.height = Laya.stage.height;
    }
    this.ui.addChild(this._lineSprite);

    let i = 0;
    const lineLayer = this._lineSprite;
    const gPoint = Point.create();
    gPoint.x = this._list.x;
    gPoint.y = this._list.y;
    const time = path.length >= 10 ? 15 : path.length >= 5 ? 30 : 120;

    function drawNextSegment(): void {
      if (i >= path.length - 1) {
        // 所有段绘制完成后清除
        Laya.timer.once(100, null, () => {
          lineLayer.removeSelf();
          lineLayer.removeChildren();
        });
        return;
      }

      const from = path[i];
      const to = path[i + 1];

      const fromX = gPoint.x + from.x * tileWidth + offsetX + 4 + from.x * 3;
      const fromY = gPoint.y + from.y * tileHeight + offsetY + 4 + from.y * 3;
      const toX = gPoint.x + to.x * tileWidth + offsetX + 4 + to.x * 3;
      const toY = gPoint.y + to.y * tileHeight + offsetY + 4 + to.y * 3;

      // 模拟绘制动画（线条从 from 到 to）
      const progress = { x: fromX, y: fromY };

      const tempLine = new Laya.Sprite();
      lineLayer.addChild(tempLine);

      Laya.Tween.to(progress, { x: toX, y: toY }, time, null, Laya.Handler.create(null, () => {
        i++;
        drawNextSegment();
      }), 0, true); // true 表示使用帧率模式

      // 每帧重绘当前段的动态线条
      tempLine.frameLoop(1, null, () => {
        tempLine.graphics.clear();
        tempLine.graphics.drawLine(fromX, fromY, progress.x, progress.y, color, 5);
      });
    }

    drawNextSegment();
  }


  private createGlowEffect(path: { x: number, y: number }[]): void {
    if (!this._glowSprite) {
      this._glowSprite = new Laya.Sprite();
      this._glowSprite.alpha = 1;
      this._glowSprite.width = this._glowSprite.height = 1;
      this._glowSprite.name = "glow";
    }
    this._glowSprite.graphics.drawCircle(0, 0, 10, "#FFFF00"); // 黄色发光球
    this.ui.addChild(this._glowSprite);

    const tileWidth = 52;
    const tileHeight = 70;
    const offsetX = tileWidth / 2;
    const offsetY = tileHeight / 2;
    const gPoint = Point.create();
    gPoint.x = this._list.x;
    gPoint.y = this._list.y;

    const points: Laya.Point[] = path.map(p => new Laya.Point(
      gPoint.x + p.x * tileWidth + offsetX + 4 + p.x * 3,
      gPoint.y + p.y * tileHeight + offsetY + 4 + p.y * 3)
    );
    let index = 0;
    const glow = this._glowSprite;
    const time = path.length >= 10 ? 15 : path.length >= 5 ? 30 : 120;

    function moveNext(): void {
      if (index >= points.length - 1) {
        glow.removeSelf();
        return;
      }

      const from = points[index];
      const to = points[index + 1];
      glow.pos(from.x, from.y);
      Laya.Tween.to(glow, { x: to.x, y: to.y }, time, null, Laya.Handler.create(null, () => {
        index++;
        moveNext();
      }));
    }

    moveNext();
  }
}
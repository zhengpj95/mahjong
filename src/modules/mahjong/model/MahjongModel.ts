import {
  CardType,
  IMahjongResultParam,
  MahjongEvent,
  MahjongViewType,
} from "@def/mahjong";
import { AStarMgr, GridPoint } from "@base/astar";
import { MahjongCardData } from "./MahjongCardData";
import { CARD_COUNT, CARD_NUM_LIST, CardData } from "./MahjongConst";
import { GameCfg } from "@base/cfg/GameCfg";
import { ModuleName } from "@def/module-name";
import { MahjongLevelConfig } from "@config/config";
import { ConfigName } from "@config/config-name";
import poolMgr = base.poolMgr;
import eventMgr = base.eventMgr;
import facade = base.facade;

/**
 * @date 2024/12/22
 */
export class MahjongModel {
  public row = 0;
  public col = 0;

  public level = 0;
  public levelScore = 0;

  private _dataMap = new Map<string, MahjongCardData>();
  private _sameMap = new Map<string, Map<string, MahjongCardData>>();

  private _rowColStrList: string[] = [];
  private _pathData: number[][] = [];
  private _astarMgr: AStarMgr;

  private getLevelCfg(): MahjongLevelConfig {
    const lv = this.getNextLevel();
    const list = GameCfg.getCfgListByName(ConfigName.MAHJONG_LEVEl) || [];
    if (lv >= list.length) {
      return list[list.length - 1];
    }
    return GameCfg.getCfgByNameId(ConfigName.MAHJONG_LEVEl, lv || 1);
  }

  public updateScore(score: number): void {
    this.levelScore += score;
    eventMgr.emit(MahjongEvent.UPDATE_SCORE);
  }

  public updateData(): void {
    const cfg = this.getLevelCfg();
    this.row = cfg && cfg.layout ? cfg.layout[0] : 8;
    this.col = cfg && cfg.layout ? cfg.layout[1] : 10;
    this._dataMap.clear();
  }

  // 清除当前关卡数据
  public clearData(): void {
    this.levelScore = 0;
    this.row = 0;
    this.col = 0;
    this._pathData.length = 0;
    this._astarMgr = <any>undefined;
    this._rowColStrList = <any>undefined;
    this._dataMap.clear();
    this._sameMap.clear();
  }

  // 麻将牌类型集
  private getMahjongCardList(): CardData[] {
    const list: CardData[] = [];
    const cardTypeList = this.getLevelCfg().cardType || [];
    const fengTypeList = this.getLevelCfg().fengType || [];
    for (const type of cardTypeList) {
      for (const num of CARD_NUM_LIST) {
        list.push([type, num]);
      }
    }
    for (const feng of fengTypeList) {
      list.push([CardType.FENG, feng]);
    }
    return list;
  }

  private getRowColStrList(): string[] {
    if (!this._rowColStrList?.length) {
      const rst: string[] = [];
      for (let i = 0; i < this.row; i++) {
        for (let j = 0; j < this.col; j++) {
          rst[i * this.col + j] = i + "_" + j;
        }
      }
      this._rowColStrList = rst;
    }
    return this._rowColStrList || [];
  }

  // 随机位置
  private getRandomRowCol(): number[] {
    const list = this.getRowColStrList();
    const idx = (Math.random() * list.length) >> 0;
    const listItem = list.splice(idx, 1)[0];
    return listItem.split("_").map((item) => +item);
  }

  public getMahjongData(): MahjongCardData[] {
    const list = this.getMahjongCardList();
    for (const item of list) {
      for (let i = 0; i < CARD_COUNT; i++) {
        const randomItemAry = this.getRandomRowCol();
        const cardData = poolMgr.alloc(MahjongCardData);
        cardData.updateInfo(randomItemAry[0], randomItemAry[1], item);
        this._dataMap.set(randomItemAry.join("_"), cardData);
        if (!this._sameMap.has(item.join("_"))) {
          this._sameMap.set(item.join("_"), new Map<string, MahjongCardData>());
        }
        this._sameMap
          .get(item.join("_"))
          .set(cardData.row + "_" + cardData.col, cardData);
      }
    }
    const rst: MahjongCardData[] = [];
    this._dataMap.forEach((value) => (rst[value.row * 10 + value.col] = value));
    return rst;
  }

  // 移除牌
  public deleteCard(index: number): boolean {
    const row = (index / 10) >> 0;
    const col = index % 10;
    if (!this._dataMap.has(`${row}_${col}`)) {
      return false;
    }
    const cardData = this._dataMap.get(`${row}_${col}`);
    const key = cardData.cardData.join("_");
    const key1 = `${row}_${col}`;
    this._dataMap.delete(key1);
    this._sameMap.get(key).delete(key1);
    poolMgr.free(cardData);
    if (!this._sameMap.get(key).size) {
      this._sameMap.delete(key);
    }
    if (this._pathData.length) {
      this._pathData[row + 1][col + 1] = 0;
    }
    const cnt = this._dataMap.size;
    if (cnt <= 0) {
      this.showResult();
    }
    return true;
  }

  // dfs检查是否可以消除
  public findPath(
    startData: MahjongCardData,
    targetData: MahjongCardData,
  ): GridPoint[] {
    if (!startData || !targetData || !startData.checkSame(targetData)) {
      return [];
    }
    if (!this._astarMgr) {
      const dfsAry: number[][] = [];
      for (let i = 0; i <= this.row + 1; i++) {
        for (let j = 0; j <= this.col + 1; j++) {
          if (!dfsAry[i]) {
            dfsAry[i] = [];
          }
          if (i === 0 || j === 0 || i === this.row + 1 || j === this.col + 1) {
            dfsAry[i][j] = 0;
          } else {
            const cardData = this._dataMap.get(`${i - 1}_${j - 1}`);
            dfsAry[i][j] = cardData ? 1 : 0;
          }
        }
      }
      this._pathData = dfsAry;
      this._astarMgr = new AStarMgr(this._pathData);
    }
    const paths = this._astarMgr.findPath(
      [startData.row + 1, startData.col + 1],
      [targetData.row + 1, targetData.col + 1],
    );
    return paths || [];
  }

  // 根据某张牌得到相同牌的信息
  public getConnectCardDataList(cardData: MahjongCardData): MahjongCardData[] {
    if (!cardData) {
      return [];
    }
    const map = this._sameMap.get(cardData.cardData.join("_"));
    const rst: MahjongCardData[] = [];
    map.forEach((value) => rst.push(value));
    return rst;
  }

  // 提示可消除的牌
  public getTipsCardDataList(): MahjongCardData[] {
    if (!this._dataMap.size) {
      return [];
    }
    const checkSet = new Set<string>();
    const list = this._dataMap.entries();
    for (const [_, item] of list) {
      if (!item || !item.cardData || !item.isValid()) continue; // 已消除
      if (checkSet.has(item.cardData.toString())) continue;
      checkSet.add(item.cardData.toString());
      const connectList = this.getConnectCardDataList(item);
      if (!connectList.length) continue;
      for (let i = 0; i < connectList.length; i++) {
        const cardI = connectList[i];
        if (!cardI || !cardI.isValid()) continue;
        for (let j = i + 1; j < connectList.length; j++) {
          const cardJ = connectList[j];
          if (!cardJ || !cardJ.isValid()) continue;
          const paths = this.findPath(cardI, cardJ);
          if (paths.length) {
            return [cardI, cardJ];
          }
        }
      }
    }
    return [];
  }

  // 洗牌
  public getRefreshCardDataList(): MahjongCardData[] {
    const list: MahjongCardData[] = [];
    for (const item of this._dataMap.values()) {
      list.push(item);
    }

    this._astarMgr = <any>undefined;
    this._rowColStrList = <any>undefined;
    this._dataMap.clear();
    this._pathData = [];

    for (const card of list) {
      if (!card) {
        continue;
      }
      const random = this.getRandomRowCol();
      card.updateInfo(random[0], random[1], card.cardData);
      this._dataMap.set(random.join("_"), card);
    }

    const rst: MahjongCardData[] = [];
    this._dataMap.forEach((value) => (rst[value.row * 10 + value.col] = value));
    return rst;
  }

  // 关卡挑战时间
  public getChallengeTime(): number {
    const cfg = this.getLevelCfg();
    if (cfg.time) {
      return cfg.time;
    }
    return 90;
  }

  /**下一关*/
  public showNext(): void {
    this.clearData();
    this.updateData();
  }

  public getNextLevel(): number {
    return this.level + 1;
  }

  /**展示结算弹窗*/
  public showResult(param?: IMahjongResultParam): void {
    eventMgr.emit(MahjongEvent.SHOW_RESULT);
    facade.openView(ModuleName.MAHJONG, MahjongViewType.RESULT, param);
  }
}

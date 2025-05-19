import { CardType, IMahjongResultParam, MahjongEvent, MahjongViewType } from "@def/mahjong";
import { AStarMgr, GridPoint } from "@base/astar";
import { MahjongCardData } from "./MahjongCardData";
import { CARD_COUNT, CARD_NUM_LIST, CardData } from "../MahjongConst";
import { GameCfg } from "@base/cfg/GameCfg";
import { ModuleType } from "@def/module-type";
import { ConfigName } from "@configName";
import poolMgr = base.poolMgr;
import eventMgr = base.eventMgr;
import facade = base.facade;

export const MAHJONG_LEVEL = "mahjong_level";

/**
 * @date 2024/12/22
 */
export class MahjongModel {
  public row = 0;
  public col = 0;
  public data: MahjongCardData[][] = [];

  public level = 0;
  public levelScore = 0;

  private _rowColStrList: string[];
  private _pathData: number[][] = [];
  private _astarMgr: AStarMgr;
  private _sameCardMap: { [key: string]: MahjongCardData[] } = {};

  private getLevelCfg(): LevelConfig {
    const lv = this.getNextLevel();
    const list = GameCfg.getCfgListByName<LevelConfig>(ConfigName.LEVEl) || [];
    if (lv >= list.length) {
      return list[list.length - 1];
    }
    return GameCfg.getCfgByNameId<LevelConfig>(ConfigName.LEVEl, lv || 1);
  }

  public updateScore(score: number): void {
    this.levelScore += score;
    eventMgr.emit(MahjongEvent.UPDATE_SCORE);
  }

  public updateData(): void {
    const cfg = this.getLevelCfg();
    this.row = cfg && cfg.layout ? cfg.layout[0] : 8;
    this.col = cfg && cfg.layout ? cfg.layout[1] : 10;
    this.data = [];
  }

  // 清除当前关卡数据
  public clearData(): void {
    this.levelScore = 0;
    this.row = 0;
    this.col = 0;
    this.data.length = 0;
    this._pathData.length = 0;
    this._astarMgr = <any>undefined;
    this._rowColStrList = <any>undefined;
    this._sameCardMap = {};
  }

  // 麻将牌类型集
  private getMahjongCardList(): CardData[] {
    const list: CardData[] = [];
    const cardTypeList = this.getLevelCfg().cardType || [];
    const fengTypeList = this.getLevelCfg().fengType || [];
    for (let type of cardTypeList) {
      for (let num of CARD_NUM_LIST) {
        list.push([type, num]);
      }
    }
    for (let feng of fengTypeList) {
      list.push([CardType.FENG, feng]);
    }
    return list;
  }

  private getRowColStrList(): string[] {
    if (!this._rowColStrList) {
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

  private getRandomRowCol(): number[] {
    const list = this.getRowColStrList();
    const idx = Math.random() * list.length >> 0;
    const listItem = list.splice(idx, 1)[0];
    return listItem.split("_").map(item => +item);
  }

  public getMahjongData(): MahjongCardData[][] {
    const list = this.getMahjongCardList();
    for (let item of list) {
      for (let i = 0; i < CARD_COUNT; i++) {
        const randomItemAry = this.getRandomRowCol();
        if (!this.data[randomItemAry[0]]) {
          this.data[randomItemAry[0]] = [];
        }
        const cardData = poolMgr.alloc(MahjongCardData);
        cardData.updateInfo(randomItemAry[0], randomItemAry[1], item);
        this.data[randomItemAry[0]][randomItemAry[1]] = cardData;
      }
    }
    return this.data;
  }

  // 移除牌
  public deleteCard(index: number): boolean {
    const row = (index / 10 >> 0);
    const col = index % 10;
    if (!this.data || !this.data[row]) {
      return false;
    }
    poolMgr.free(this.data[row][col]);
    this.data[row][col] = undefined;
    if (this._pathData.length) {
      this._pathData[row + 1][col + 1] = 0;
    }
    const cnt = this.getLeaveCardDataList().length;
    if (cnt <= 0) {
      this.showResult();
    }
    return true;
  }

  // dfs检查是否可以消除
  public findPath(startData: MahjongCardData, targetData: MahjongCardData): GridPoint[] {
    if (!startData || !targetData || !startData.checkSame(targetData)) {
      return [];
    }
    if (!this._astarMgr) {
      const dfsAry: number[][] = [];
      for (let i = 0; i < this.row + 2; i++) {
        for (let j = 0; j < this.col + 2; j++) {
          if (!dfsAry[i]) {
            dfsAry[i] = [];
          }
          if (i === 0 || j === 0 || i === this.row + 1 || j === this.col + 1) {
            dfsAry[i][j] = 0;
          } else {
            const cardData = this.data[i - 1][j - 1];
            dfsAry[i][j] = cardData ? 1 : 0;
          }
        }
      }
      this._pathData = dfsAry;
      this._astarMgr = new AStarMgr(this._pathData);
    }
    const paths = this._astarMgr.findPath([startData.row + 1, startData.col + 1], [targetData.row + 1, targetData.col + 1]);
    return paths || [];
  }

  public canConnect(startData: MahjongCardData, targetData: MahjongCardData): boolean {
    if (!startData || !targetData) {
      return false;
    }
    const paths = this.findPath(startData, targetData);
    return !!paths.length;
  }

  // 根据某张牌得到相同牌的信息
  public getConnectCardDataList(cardData: MahjongCardData): MahjongCardData[] {
    if (!cardData) {
      return [];
    }
    const cardKey = cardData.cardData.toString();
    if (this._sameCardMap[cardKey]) {
      return this._sameCardMap[cardKey] || [];
    }
    const rst: MahjongCardData[] = [];
    for (let data of this.data) {
      for (let item of data) {
        if (item && item.checkSame(cardData)) {
          rst.push(item);
        }
      }
    }
    this._sameCardMap[cardKey] = rst;
    return rst;
  }

  // 提示可消除的牌
  public getTipsCardDataList(): MahjongCardData[] {
    if (!this.data.length) {
      return [];
    }
    let minPath = Number.MAX_SAFE_INTEGER;
    let rst: MahjongCardData[] = [];
    const checkSet = new Set<string>();
    for (let rows of this.data) {
      if (!rows || !rows.length) continue;
      for (let item of rows) {
        if (!item || !item.cardData || !item.isValid()) continue;// 已消除
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
            if (!paths.length) continue;
            if (paths.length === 2) {
              return [cardI, cardJ];
            }
            if (paths.length < minPath) {
              rst = [cardI, cardJ];
              minPath = paths.length;
            }
          }
        }
      }
    }
    return rst;
  }

  // 剩余牌列表
  public getLeaveCardDataList(): MahjongCardData[] {
    return this.data.reduce((arr, item) => {
        return arr.concat(item.filter(card => card && card.isValid()));
      },
      []
    );
  }

  // 洗牌
  public getRefreshCardDataList(): MahjongCardData[][] {
    const list = this.getLeaveCardDataList();
    this._astarMgr = <any>undefined;
    this._rowColStrList = <any>undefined;
    this.data = [];
    for (let i = 0; i < this.row; i++) {
      this.data[i] = new Array(this.col).fill(undefined);
    }
    this._pathData = [];
    for (let card of list) {
      if (!card) {
        continue;
      }
      const random = this.getRandomRowCol();
      if (!this.data[random[0]]) {
        this.data[random[0]] = new Array(this.col).fill(undefined);
      }
      card.updateInfo(random[0], random[1], card.cardData);
      this.data[random[0]][random[1]] = card;
    }
    return this.data;
  }

  // 关卡挑战时间
  public getChallengeTime(): number {
    const cfg = this.getLevelCfg();
    if (cfg.time) {
      return cfg.time;
    }
    return 90;
  }

  /**重新挑战*/
  public challengeAgain(): void {
    this.clearData();
    this.updateData();
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
    facade.openView(ModuleType.MAHJONG, MahjongViewType.RESULT, param);
  }
}

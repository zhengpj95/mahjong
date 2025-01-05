import { CardType, FengType } from "@def/mahjong";
import { AStarMgr, GridPoint } from "@base/astar";

/**
 * @date 2024/12/22
 */

const CARD_COUNT = 4;
const CARD_NUM_LIST: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const CARD_TYPE_LIST: CardType[] = [CardType.TONG, CardType.TIAO];
const FENG_TYPE_LIST: FengType[] = [FengType.ZHONG, FengType.FA];
const CardTypeName = {
  [CardType.TONG]: "tong",
  [CardType.WAN]: "wan",
  [CardType.TIAO]: "tiao",
  [CardType.FENG]: "feng"
};
// 卡牌格式 [牌类型, 牌数字]
type CardData = [CardType, number]
type CardPoint = { row: number, col: number }

export class MahjongModel {
  public row = 0;
  public col = 0;
  public data: MahjongCardData[][] = [];

  private _rowColStrList: string[];
  private _pathData: number[][] = [];
  private _astarMgr: AStarMgr;
  private _sameCardMap: { [key: string]: MahjongCardData[] } = {};

  public updateData(row: number = 8, col: number = 10): void {
    this.row = row;
    this.col = col;
    this.data = [];
  }

  // 清除当前关卡数据 todo
  public clearData(): void {
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
    for (let type of CARD_TYPE_LIST) {
      for (let num of CARD_NUM_LIST) {
        list.push([type, num]);
      }
    }
    for (let feng of FENG_TYPE_LIST) {
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
        const cardData = new MahjongCardData();
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
    this.data[row][col] = undefined;
    if (this._pathData.length) {
      this._pathData[row + 1][col + 1] = 0;
    }
    return true;
  }

  // dfs检查是否可以消除
  public findPath(startData: MahjongCardData, targetData: MahjongCardData): GridPoint[] {
    if (!startData || !targetData || !startData.checkSame(targetData)) {
      return [];
    }
    const startPoint: CardPoint = {row: startData.row + 1, col: startData.col + 1};
    const targetPoint: CardPoint = {row: targetData.row + 1, col: targetData.col + 1};
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
    const paths = this._astarMgr.findPath([startPoint.row, startPoint.col], [targetPoint.row, targetPoint.col]);
    return paths || [];
  }

  public canConnect(startData: MahjongCardData, targetData: MahjongCardData): boolean {
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
    for (let rows of this.data) {
      for (let item of rows) {
        if (!item) continue;// 已消除
        const connectList = this.getConnectCardDataList(item);
        if (!connectList.length) continue;
        for (let card of connectList) {
          if (!card || card.checkPos(item)) continue;
          if (!this.data[card.row][card.col]) continue;
          const paths = this.findPath(item, card);
          if (!paths.length) continue;
          if (paths.length === 2) {
            return [item, card]; //相邻的有限
          }
          if (paths.length < minPath) {
            rst = [item, card];
            minPath = paths.length;
          }
        }
      }
    }
    return rst;
  }
}

/**单张麻将的数据*/
export class MahjongCardData {
  public row: number;
  public col: number;
  public cardData: CardData;

  public updateInfo(row: number, col: number, data: CardData): void {
    this.row = row;
    this.col = col;
    this.cardData = data;
  }

  public getIcon(): string {
    if (!this.cardData) {
      return "";
    }
    return `mahjong/${CardTypeName[this.cardData[0] + ""] + this.cardData[1]}.png`;
  }

  public checkSame(data: MahjongCardData): boolean {
    if (!data || !data.cardData) {
      return false;
    }
    return data.cardData[0] === this.cardData[0] && data.cardData[1] === this.cardData[1];
  }

  public checkPos(data: MahjongCardData): boolean {
    if (!data) {
      return false;
    }
    return data.row === this.row && data.col === this.col;
  }
}

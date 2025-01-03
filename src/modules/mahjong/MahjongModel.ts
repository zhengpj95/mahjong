import { CardType, FengType } from "@def/mahjong";

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
  [CardType.FENG]: "feng",
};
// 卡牌格式 [牌类型, 牌数字]
type CardData = [CardType, number]
type CardPoint = { row: number, col: number }

export class MahjongModel {
  public row = 8;
  public col = 10;
  public data: MahjongCardData[][] = [];

  public updateRowCol(row: number = 8, col: number = 10): void {
    this.row = row;
    this.col = col;
    this.data = [];
  }

  // 麻将牌类型集
  public getMahjongCardList(): CardData[] {
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

  private _rowColStrList: string[];

  public getRowColStrList(): string[] {
    if (!this._rowColStrList) {
      const rst: string[] = [];
      for (let i = 0; i < this.row; i++) {
        for (let j = 0; j < this.col; j++) {
          rst[i * this.col + j] = i + "_" + j;
        }
      }
      this._rowColStrList = rst;
    }
    return this._rowColStrList;
  }

  public getRandomRowCol(): number[] {
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
    if (this._dfsAry) {
      this._dfsAry[row + 1][col + 1] = 0;
    }
    return true;
  }

  // 获取点击的牌【上右下左】非空牌的序号 todo 非空牌
  public getDirectionList(index: number): number[] {
    const leftIdx = Math.max(0, index - 1);
    const rightIdx = Math.max(index + 1, this.col - 1);
    const topIdx = Math.max(0, index - this.col);
    const bottomIdx = Math.max(index + this.col, this.row - 1);
    return [topIdx, rightIdx, bottomIdx, leftIdx];
  }

  private _dfsAry: number[][];

  // dfs检查是否可以消除
  public checkDfs(startData: MahjongCardData, targetData: MahjongCardData): boolean {
    if (!startData || !targetData || !startData.checkSame(targetData)) {
      return false;
    }
    const startPoint: CardPoint = { row: startData.row + 1, col: startData.col + 1 };
    const targetPoint: CardPoint = { row: targetData.row + 1, col: targetData.col + 1 };
    if (!this._dfsAry) {
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
      this._dfsAry = dfsAry;
    }
    console.log("dfsAry : ", this._dfsAry);
    console.log("carData: ", this.data);
    return this.dfsFunc(this._dfsAry, startPoint, targetPoint);
  }

  private dfsFunc(list: number[][], sPoint: CardPoint, tPoint: CardPoint): boolean {
    const sData = list[sPoint.row][sPoint.col];
    const tData = list[tPoint.row][tPoint.col];
    if (!sData || !tData) {
      return false;
    }
    const visitMap = {};
    const dfs = (row: number, col: number): boolean => {
      if (row < 0 || row > list.length - 1) {
        return false;
      }
      if (col < 0 || col > list[0].length - 1) {
        return false;
      }
      const visitId = row + "_" + col;
      if (visitMap[visitId]) {
        return false;
      }
      visitMap[visitId] = true;
      const data = list[row][col];
      if (data && !(row === tPoint.row && col === tPoint.col)) {
        return false;
      }
      if (row === tPoint.row && col === tPoint.col) {
        return true;//找到
      }
      return dfs(row - 1, col) || dfs(row + 1, col) || dfs(row, col - 1) || dfs(row, col + 1);
    };
    return dfs(sPoint.row - 1, sPoint.col) || dfs(sPoint.row + 1, sPoint.col) || dfs(sPoint.row, sPoint.col - 1) || dfs(sPoint.row, sPoint.col + 1);
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
}

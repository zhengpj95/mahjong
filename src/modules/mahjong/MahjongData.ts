/**
 * @date 2024/12/22
 */
export class MahjongData {
  public row = 8;
  public col = 10;
  public data: string[][] = [];

  public updateRowCol(row: number, col: number): void {
    this.row = row;
    this.col = col;
    this.data = [];
  }

  // 麻将类型
  public getMahjongCardList(): string[] {
    const list: string[] = [];
    for (let type of CARD_TYPE_LIST) {
      for (let num of CARD_NUMBER) {
        list.push(type + "_" + num);
      }
    }
    for (let feng of FENG_TYPE_LIST) {
      list.push(CardType.FENG + "_" + feng);
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

  public getRandomRowCol(): string {
    const list = this.getRowColStrList();
    const idx = Math.random() * list.length >> 0;
    return list.splice(idx, 1)[0];
  }

  public getMahjongData(): string[][] {
    const list = this.getMahjongCardList();
    for (let item of list) {
      for (let i = 0; i < 4; i++) {
        const randomItem = this.getRandomRowCol();
        const randomItemAry = randomItem.split("_").map(item => +item);
        if (!this.data[randomItemAry[0]]) {
          this.data[randomItemAry[0]] = [];
        }
        this.data[randomItemAry[0]][randomItemAry[1]] = item;
      }
    }
    return this.data;
  }

  public getMahjongCardRes(idStr: string): string {
    const typeList = idStr.split("_");
    return `mahjong/${CardTypeName[typeList[0]] + typeList[1]}.png`;
  }

  // 移除牌
  public deleteCard(index: number): boolean {
    index += 1;
    const row = index / 10 >> 0;
    const col = index % 10 - 1;
    if (!this.data || !this.data[row]) {
      return false;
    }
    this.data[row][col] = "";
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
}

export const CARD_NUMBER: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const CARD_TYPE_LIST: CardType[] = [CardType.TONG, CardType.TIAO];
export const FENG_TYPE_LIST: FengType[] = [FengType.ZHONG, FengType.FA];

export const enum CardType {
  TONG = 1, // 9*4
  WAN = 2, // 9*4
  TIAO = 3, // 9*4
  FENG = 4 // 7*4
}

export const enum FengType {
  DONG = 1,
  NAN = 2,
  XI = 3,
  BEI = 4,
  ZHONG = 5,
  FA = 6,
  BAIBAN = 7
}

export const CardTypeName = {
  [CardType.TONG]: "tong",
  [CardType.WAN]: "wan",
  [CardType.TIAO]: "tiao",
  [CardType.FENG]: "feng",
};
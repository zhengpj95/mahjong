import {
  CARD_NUMBER,
  CARD_TYPE_LIST,
  CardType,
  CardTypeName,
  FENG_TYPE_LIST,
  FengType,
  MahjongData
} from "./MahjongData";

/**
 * @date 2024/12/22
 */
export class MahjongProxy {
  private static _instance: MahjongProxy;
  private _data: MahjongData;

  public static ins(): MahjongProxy {
    if (!this._instance) {
      this._instance = new MahjongProxy();
    }
    return this._instance;
  }

  public get data(): MahjongData {
    if (!this._data) {
      this._data = new MahjongData();
    }
    return this._data;
  }

  constructor() {
    this.data.updateRowCol(8, 10);
  }
}
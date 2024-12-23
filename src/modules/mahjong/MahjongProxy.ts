import { MahjongModel } from "./MahjongModel";

/**
 * @date 2024/12/22
 */
export class MahjongProxy {
  private static _instance: MahjongProxy;
  private _data: MahjongModel;

  public static ins(): MahjongProxy {
    if (!this._instance) {
      this._instance = new MahjongProxy();
    }
    return this._instance;
  }

  public get data(): MahjongModel {
    if (!this._data) {
      this._data = new MahjongModel();
    }
    return this._data;
  }

  constructor() {
    this.data.updateRowCol(8, 10);
  }
}
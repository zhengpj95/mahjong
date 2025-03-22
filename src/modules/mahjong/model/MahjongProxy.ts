import { MahjongModel } from "./MahjongModel";
import { DebugUtils } from "@base/utils/DebugUtils";

/**
 * @date 2024/12/22
 */
export class MahjongProxy {
  private static _instance: MahjongProxy;
  private _model: MahjongModel;

  public static ins(): MahjongProxy {
    if (!this._instance) {
      this._instance = new MahjongProxy();
      DebugUtils.debugClass(this._instance);
    }
    return this._instance;
  }

  constructor() {
    if (!this._model) {
      this._model = new MahjongModel();
    }
  }

  public get model(): MahjongModel {
    if (!this._model) {
      this._model = new MahjongModel();
    }
    return this._model;
  }
}
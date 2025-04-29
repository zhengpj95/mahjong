import { MahjongModel } from "./MahjongModel";
import { DebugUtils } from "@base/utils/DebugUtils";
import BaseProxy = base.BaseProxy;

/**
 * @date 2024/12/22
 */
export class MahjongProxy extends BaseProxy {
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
    super();
    // if (!this._model) {
    //   this._model = new MahjongModel();
    // }
  }

  public init(): void {
    //
  }


  public get model(): MahjongModel {
    if (!this._model) {
      this._model = new MahjongModel();
    }
    return this._model;
  }
}
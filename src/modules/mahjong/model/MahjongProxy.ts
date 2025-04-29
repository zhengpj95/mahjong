import { MahjongModel } from "./MahjongModel";
import BaseProxy = base.BaseProxy;

/**
 * @date 2024/12/22
 */
export class MahjongProxy extends BaseProxy {
  private _model: MahjongModel;

  public get model(): MahjongModel {
    if (!this._model) {
      this._model = new MahjongModel();
    }
    return this._model;
  }

  public init(): void {
    this.model.init(); // 初始化一下，获取缓存关卡数据
  }
}
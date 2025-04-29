import { MAHJONG_LEVEL, MahjongModel } from "./MahjongModel";
import { globalAdapter } from "@platform/index";
import { eventMgr } from "@base/event/EventManager";
import { MahjongEvent } from "@def/mahjong";
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
    this.sMahjongInfo(); // 模拟数据下发，获取缓存关卡数据
  }

  public cMahjongSuccess(): void {
    let lev = this.model.level + 1;
    globalAdapter.storage.setItem(MAHJONG_LEVEL, lev, (success?: boolean) => {
      if (success) {
        console.log(`cMahjongSuccess setItem success: `, lev);
      } else {
        console.log(`cMahjongSuccess setItem fail: `, lev);
      }
    });
    this.model.level += 1;// 挑战成功了，直接设置成功关卡
  }

  public sMahjongInfo(): void {
    this.model.clearData();
    globalAdapter.storage.getItem(MAHJONG_LEVEL, (data: number) => {
      console.warn(`sMahjongInfo before getItem: ${this.model.level}`);
      this.model.level = data || 0;
      console.warn(`sMahjongInfo after getItem: ${this.model.level} ${data}`);
      eventMgr.event(MahjongEvent.UPDATE_INFO);
    });
  }
}
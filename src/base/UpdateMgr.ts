import Singleton = base.Singleton;
import { ISceneUpdate } from "@base/BaseConst";

type VoidElapsedMethod = (elapsed: number) => void;

/**
 * 更新管理器，根据游戏帧率更新
 * @author zpj
 * @date 2025/6/9
 */
export class UpdateMgr extends Singleton<UpdateMgr> implements ISceneUpdate {
  private _timerList: { thisObj: any; func: VoidElapsedMethod }[] = [];

  public addTimer(thisObj: any, func: VoidElapsedMethod): void {
    for (const item of this._timerList) {
      if (item.thisObj === thisObj && item.func === func) {
        return;
      }
    }
    this._timerList.push({ thisObj, func });
  }

  public update(elapsed: number): void {
    for (const item of this._timerList) {
      if (item) {
        item.func.call(item.thisObj, elapsed);
      }
    }
  }
}

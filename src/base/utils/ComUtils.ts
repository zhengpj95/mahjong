import TimeLine = Laya.TimeLine;
import UIComponent = Laya.UIComponent;
import Handler = Laya.Handler;
import Event = Laya.Event;

/**
 * @date 2024/12/23
 */
export default class ComUtils {
  /** 组件抖动 */
  public static setTween(box: UIComponent, isTween = true, callback?: Handler): TimeLine | undefined {
    if (!box) {
      return undefined;
    }
    let timeLine = <TimeLine>box["_timeLine_"];
    if (timeLine) {
      timeLine.reset();
      if (!isTween) {
        timeLine.destroy();
        return undefined;
      }
    } else {
      box["_timeLine_"] = timeLine = new TimeLine();
    }
    timeLine.to(box, { rotation: 10 }, 100)
      .to(box, { rotation: -10 }, 100)
      .to(box, { rotation: 5 }, 100)
      .to(box, { rotation: -5 }, 100)
      .to(box, { rotation: 0 }, 50)
      .play();
    timeLine.on(Event.COMPLETE, this, () => {
      if (callback) {
        callback.run();
      }
    });
    return timeLine;
  }
}
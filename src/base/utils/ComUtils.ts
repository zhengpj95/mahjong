import TimeLine = Laya.TimeLine;
import UIComponent = Laya.UIComponent;
import Handler = Laya.Handler;
import Event = Laya.Event;
import Node = Laya.Node;

/**
 * @date 2024/12/23
 */
export default class ComUtils {
  /** 组件抖动 */
  public static setTween(
    box: UIComponent,
    isTween = true,
    callback?: Handler,
  ): TimeLine | undefined {
    if (!box) {
      return undefined;
    }
    let timeLine = <TimeLine>(box as any)["_timeLine_"];
    if (timeLine) {
      timeLine.reset();
      if (!isTween) {
        timeLine.destroy();
        return undefined;
      }
    } else {
      (box as any)["_timeLine_"] = timeLine = new TimeLine();
    }
    timeLine
      .to(box, { rotation: 10 }, 100)
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

  public static setScale(box: UIComponent, scale = 1): void {
    if (!box) {
      return;
    }
    if (box.scaleX !== scale) {
      box.scaleX = box.scaleY = scale;
    }
  }

  /**根据名称获取对应组件*/
  public static getNodeByNameList<T extends Node>(
    box: Node,
    nameList: string | string[],
  ): T | undefined {
    if (!box) {
      return undefined;
    }
    if (Array.isArray(nameList)) {
      let com = box;
      while (nameList.length) {
        const name = nameList.shift();
        com = <UIComponent>com.getChildByName(name);
        if (!com) {
          console.error(`ComUtils.getNodeByNameList error: `, name);
        }
      }
      return <T>com;
    } else {
      return <T>box.getChildByName(nameList);
    }
  }
}

import BaseMediator = base.BaseMediator;
import Sprite = Laya.Sprite;
import LayerIndex = base.LayerIndex;
import tweenMgr = base.tweenMgr;
import CallBack = base.CallBack;
import Label = Laya.Label;

/**
 * @author zpj
 * @date 2025/5/20
 */
export class HoodleMdr extends BaseMediator<Sprite> {

  constructor() {
    super(LayerIndex.MAIN, "scene/hoodle/Hoodle.ls");
  }

  protected addEvents(): void {
  }

  protected initUI(): void {
  }

  protected onClose(): void {
  }

  protected onOpen(): void {
    const sprite = <Sprite>this.ui.getChildByName("ballSprite");
    sprite.on(Laya.Event.TRIGGER_EXIT, (e: Laya.ColliderBase) => {
      console.log(11111, "trigger_exit", e.label === "ground");
      if (e.label === "ground") {
        const lab = (sprite.getChildByName("lab") as Label);
        const curVal = parseInt(lab.text);
        lab.text = (curVal - 2) + "";
        if (curVal - 2 <= 0) {
          tweenMgr.get(sprite).to({ alpha: 0 }, 500, null, CallBack.alloc(this, () => {
            sprite.removeSelf();
          }));
        }
      }
    });
  }
}
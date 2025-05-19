import BaseMediator = base.BaseMediator;
import Sprite = Laya.Sprite;

/**
 * @author zpj
 * @date 2025/5/16
 */
export class TestMdr extends BaseMediator<Sprite> {
  constructor() {
    super(1, "Scene.ls");
  }

  protected addEvents(): void {
  }

  protected initUI(): void {
  }

  protected onClose(): void {
  }

  protected onOpen(): void {
  }
}
import { ITestView } from "@3rd-types/login";
import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;
import Event = Laya.Event;
import ITouchInfo = Laya.ITouchInfo;

/**
 * @author zpj
 * @date 2025/7/8
 */
export class TestMdr extends BaseMediator<ITestView> {
  public constructor() {
    super(LayerIndex.MAIN, "scene/login/Test.ls");
  }

  protected addEvents(): void {
    this.ui.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
    this.ui.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
    this.ui.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);

    this.ui.$panel.$box.on(Event.MOUSE_DOWN, this, this.onMouseDown);
  }

  //上次记录的两个触模点之间距离
  private lastDistance: number = 0;

  private onMouseDown(e: Event): void {
    console.log(11111, e.stageX, e.stageY);
    const touches = e.touches;

    if (touches && touches.length === 2) {
      this.lastDistance = this.getDistance(touches);
    }
  }

  private onMouseUp(e: Event): void {
    console.log(22222, e.stageX, e.stageY);
  }

  private onMouseMove(e: Event): void {
    const distance: number = this.getDistance(e.touches);

    //判断当前距离与上次距离变化，确定是放大还是缩小
    const scale = distance / this.lastDistance;
    console.log(
      `当前距离: ${distance}, 上次距离: ${this.lastDistance}, 缩放比例: ${scale}`,
    );

    this.lastDistance = distance;
  }

  /**计算两个触摸点之间的距离*/
  private getDistance(points: Readonly<ITouchInfo[]>): number {
    let distance: number = 0;
    if (points && points.length === 2) {
      const dx: number = points[0].pos.x - points[1].pos.x;
      const dy: number = points[0].pos.y - points[1].pos.y;

      distance = Math.sqrt(dx * dx + dy * dy);
    }
    return distance;
  }

  protected initUI(): void {
    // this.ui.$panel.hScrollBarSkin = "";
    // this.ui.$panel.vScrollBarSkin = "";
  }

  protected onClose(): void {
    //
  }

  protected onOpen(): void {
    //
  }
}

/**
 * @author zpj
 * @date 2025/1/19
 */
import Sprite = Laya.Sprite;
import layerMgr = base.layerMgr;
import LayerIndex = base.LayerIndex;

// 弹窗遮罩层处理
let sprite: Sprite;

function createPopupMask(): Sprite {
  if (!sprite) {
    sprite = new Sprite();
    sprite.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000CC");
  }
  sprite.name = "popup_mask";
  // sprite.mouseThrough = true;
  // sprite.mouseEnabled = true;
  return sprite;
}

export function addPopupMask(): void {
  const mask = createPopupMask();
  mask.removeSelf();
  layerMgr.getLayer(LayerIndex.MODAL).addChildAt(mask, 0);
}

export function removePopupMask(): void {
  const mask = createPopupMask();
  mask.removeSelf();
}

/**
 * @author zpj
 * @date 2025/1/19
 */
import Sprite = Laya.Sprite;
import Scene = Laya.Scene;
import View = Laya.View;

export enum LayerIndex {
  ROOT = 1,
  MODAL = 2,
  TIPS = 3
}

export function setLayerIndex(scene: Scene | View, idx: LayerIndex = LayerIndex.ROOT): void {
  if (scene) {
    scene["_layerIndex_"] = idx;
  }
}

export class LayerManager {
  private _ins: LayerManager;
  public get ins(): LayerManager {
    if (!this._ins) {
      this._ins = new LayerManager();
      this.init();
    }
    return this._ins;
  }

  public init(): void {
    console.log(Scene.root);
    this.modal;
  }

  // modal层
  private _modal: Sprite;
  public get modal(): Sprite {
    if (!this._modal) {
      this._modal = new Sprite();
      Scene["_modal_"] = Laya.stage.addChildAt(this._modal, 1);
      const modal = Scene["_modal_"];
      modal.name = "modal";

      Laya.stage.on("resize", null, () => {
        modal.size(Laya.stage.width, Laya.stage.height);
        modal.event(Laya.Event.RESIZE);
      });
      modal.size(Laya.stage.width, Laya.stage.height);
      modal.event(Laya.Event.RESIZE);
    }
    return this._modal;
  }
}

export const layerMgr = new LayerManager();
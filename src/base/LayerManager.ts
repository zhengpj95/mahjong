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
    Scene.root;
    this.modal;
    this.tips;
  }

  // modal层
  private _modal: Sprite;
  public get modal(): Sprite {
    if (!this._modal) {
      this._modal = new Sprite();
      Scene["_modal_"] = Laya.stage.addChildAt(this._modal, 1);
      const modal: Sprite = Scene["_modal_"];
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

  // tips层
  private _tips: Sprite;
  public get tips(): Sprite {
    if (!this._tips) {
      this._tips = new Sprite();
      Scene["_tips_"] = Laya.stage.addChildAt(this._tips, 2);
      const tips: Sprite = Scene["_tips_"];
      tips.name = "tips";

      Laya.stage.on("resize", null, () => {
        tips.size(Laya.stage.width, Laya.stage.height);
        tips.event(Laya.Event.RESIZE);
      });
      tips.size(Laya.stage.width, Laya.stage.height);
      tips.event(Laya.Event.RESIZE);
    }
    return this._modal;
  }
}

export const layerMgr = new LayerManager();
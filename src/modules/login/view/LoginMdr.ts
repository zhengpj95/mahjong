import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;
import tweenMgr = base.tweenMgr;
import CallBack = base.CallBack;
import facade = base.facade;
import { LoginView } from "@3rd-types/login";
import { MahjongViewType } from "@def/mahjong";
import { ModuleName } from "@def/module-name";

/**
 * @author zpj
 * @date 2025/6/13
 */
export class LoginMdr extends BaseMediator<LoginView> {
  constructor() {
    super(LayerIndex.MAIN, "scene/login/Login.ls");
  }

  protected initUI(): void {
    //
  }

  protected addEvents(): void {
    //
  }

  protected onOpen(): void {
    // 虚假进度展示
    tweenMgr.remove(this.ui.$ProgressBar);
    const randomTime = (Math.random() * 500 + 1500) >> 0;
    tweenMgr.get(this.ui.$ProgressBar).to({ value: 1 }, randomTime, null, CallBack.alloc(this, this.onLoadComplete));
  }

  protected onClose(): void {
    tweenMgr.remove(this.ui.$ProgressBar);
  }

  private onLoadComplete(): void {
    this.close();
    facade.openView(ModuleName.MAHJONG, MahjongViewType.HOME);
  }
}
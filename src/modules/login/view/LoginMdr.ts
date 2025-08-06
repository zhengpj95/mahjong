import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;
import tweenMgr = base.tweenMgr;
import CallBack = base.CallBack;
import facade = base.facade;
import { ILoginView } from "@3rd-types/login";
import { MahjongViewType } from "@def/mahjong";
import { ModuleName } from "@def/module-name";

/**
 * @author zpj
 * @date 2025/6/13
 */
export class LoginMdr extends BaseMediator<ILoginView> {
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
    tweenMgr
      .get(this.ui.$ProgressBar)
      .to(
        { value: 1 },
        randomTime,
        null,
        CallBack.alloc(this, this.onLoadComplete),
      );

    if (REVIEW_VERSION) {
      const versionLabel = new Laya.Label();
      versionLabel.text = `版本：v${REVIEW_VERSION}`;
      versionLabel.fontSize = 22;
      versionLabel.color = "#ff0000";
      versionLabel.right = 20;
      versionLabel.bottom = 15;
      this.ui.addChild(versionLabel);
      console.log(`game version：v${REVIEW_VERSION}`);
    }
  }

  protected onClose(): void {
    tweenMgr.remove(this.ui.$ProgressBar);
  }

  private onLoadComplete(): void {
    this.close();
    facade.openView(ModuleName.MAHJONG, MahjongViewType.HOME);
  }
}

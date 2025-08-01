import BaseMediator = base.BaseMediator;
import facade = base.facade;
import LayerIndex = base.LayerIndex;
import { ModuleName, ProxyType } from "@def/module-name";
import { MahjongViewType } from "@def/mahjong";
import { HoodleViewType } from "@def/hoodle";
import { MahjongHomeView } from "@3rd-types/mahjong";
import { MahjongProxy } from "../model/MahjongProxy";
import { globalAdapter } from "@platform/index";
import { MiscStorageKey } from "@def/misc";

/**
 * @author zpj
 * @date 2025/1/21
 */
export default class MahjongHomeMdr extends BaseMediator<MahjongHomeView> {
  // 游戏圈按钮
  private _gameClubButton?: WechatMinigame.GameClubButton;

  constructor() {
    super(LayerIndex.MAIN, "scene/mahjong/MahjongHome.ls");
  }

  protected addEvents(): void {
    //
  }

  protected initUI(): void {
    //
  }

  protected onClose(): void {
    if (this._gameClubButton) {
      this._gameClubButton.offTap(this.onClickGameClub);
      this._gameClubButton.hide();
      this._gameClubButton = undefined;
    }
  }

  protected onOpen(): void {
    this.ui.$btnHoodle.visible = _DEBUG_ ?? false;
    const proxy = base.facade.getProxy<MahjongProxy>(ModuleName.MAHJONG, ProxyType.MAHJONG);
    this.ui.$labCurLevel.text = proxy.model.level + "";

    globalAdapter.storage.getItem(MiscStorageKey.PLAY_SOUND, (data: number) => {
      this.ui.$btnSound.skin = !!data ? `atlas/common/img_common_speaker-off.png` : `atlas/common/img_common_speaker.png`;
      this.ui.$btnSound.dataSource = !!data;
    });

    this._gameClubButton = wx.createGameClubButton({
      type: "text",
      text: "进入游戏圈",
      icon: "dark",
      style: {
        left: 10,
        top: 180,
        width: 40,
        height: 25,
        backgroundColor: "#ffffff7f",
        textAlign: "center",
        fontSize: 12,
      },
      hasRedDot: false,
    });
    this._gameClubButton?.onTap(this.onClickGameClub);
  }

  // noinspection JSUnusedGlobalSymbols
  public onClickBtnStart(): void {
    this.close();
    facade.openView(ModuleName.MAHJONG, MahjongViewType.MAIN);
  }

  // noinspection JSUnusedGlobalSymbols
  public onClickBtnHoodle(): void {
    this.close();
    facade.openView(ModuleName.HOODLE, HoodleViewType.HOODLE);
  }

  // noinspection JSUnusedGlobalSymbols
  public onClickSound(): void {
    const isPlay = !!this.ui.$btnSound.dataSource;
    this.ui.$btnSound.dataSource = !isPlay;
    this.ui.$btnSound.skin = !isPlay ? `atlas/common/img_common_speaker-off.png` : `atlas/common/img_common_speaker.png`;
    globalAdapter.storage.setItem(MiscStorageKey.PLAY_SOUND, isPlay ? 0 : 1);
  }

  public onClickGameClub(res: { errMsg: string }): void {
    console.error(res);
    const pageManager = wx.createPageManager();
    pageManager.load({
      // 由不同渠道获得的OPENLINK值
      openlink: "-SSEykJvFV3pORt5kTNpS5InPB_IqDrwbDecPapGAR5BRi9063WAxDL6vde4WxbJD1T3kFOmTWyRVq1APnt66mP02UiPhc9vRuSy2Bzquv-4X7ke0JqZSMiKSfK4f7TQD2bp0h3GE7skQ-nFIMMiKt0KDgjA6a5goe32zY1vhKMZl0wmQBPFad4821-h7EF8FtyfBUUxEHOn3RDjjcFu8QQKIUTuc2wm2y_pBAZEhFA_gGIDq8OG8rRsXHDqgJevsVyZJMClhGIHnHLLz-6zVWAfYP8DHcASf_ef8EsmabepXf-kh8WsquUL2tiVs0grX26qF3mlyaB960fsE6DvEw",
    }).then((res: any) => {
      // 加载成功，res 可能携带不同活动、功能返回的特殊回包信息（具体请参阅渠道说明）
      console.log("onClickGamePage pageManager.load: " + res);
      // 加载成功后按需显示
      pageManager.show();
    }).catch((err: Error) => {
      // 加载失败，请查阅 err 给出的错误信息
      console.error(err);
    });
  }
}
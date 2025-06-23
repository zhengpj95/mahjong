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
    //
  }

  protected onOpen(): void {
    this.ui.$btnHoodle.visible = _DEBUG_ ?? false;
    const proxy = base.facade.getProxy<MahjongProxy>(ModuleName.MAHJONG, ProxyType.MAHJONG);
    this.ui.$labCurLevel.text = proxy.model.level + "";

    globalAdapter.storage.getItem(MiscStorageKey.PLAY_SOUND, (data: number) => {
      this.ui.$btnSound.skin = !!data ? `atlas/common/img_common_speaker-off.png` : `atlas/common/img_common_speaker.png`;
      this.ui.$btnSound.dataSource = !!data;
    });
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
}
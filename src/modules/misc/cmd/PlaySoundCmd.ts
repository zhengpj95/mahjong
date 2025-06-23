import BaseCommand = base.BaseCommand;
import SoundManager = Laya.SoundManager;
import { globalAdapter } from "@platform/index";
import { MiscStorageKey } from "@def/misc";

/**
 * 播放音效
 * @author zpj
 * @date 2025/6/23
 */
export class PlaySoundCmd extends BaseCommand {
  public exec(args: any): void {
    globalAdapter.storage.getItem(MiscStorageKey.PLAY_SOUND, (data: number) => {
      if (!!data) {
        return;
      }
      SoundManager.playSound("resources/audio/mixkit-flop.wav");
    });
  }
}
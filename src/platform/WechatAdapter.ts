/**
 * wx
 * @date 2025/3/22
 */
import { IPlatformAdapter, IPlatformStorage } from "./PlatformConst";

export class WechatAdapter implements IPlatformAdapter {
  private _storage: IPlatformStorage;
  public get storage(): IPlatformStorage {
    if (!this._storage) {
      this._storage = new WechatPlatformStorage();
    }
    return this._storage;
  }

  public share(): void {
    console.log(`wx adapter start share menu...`);
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
      fail: () => {
        //
      },
      success: () => {
        console.log(`wx adapter start share menu success!`);
      },
      complete: () => {
        //
      },
    });
    wx.onShareAppMessage(() => {
      console.log(`11111 onShareAppMessage`);
      return {
        title: "雀神连连，超级给力，快来享受吧",
      };
    });
    wx.onShareTimeline(() => {
      return {
        title: "雀神连连，超级给力，快来享受吧！！",
      };
    });
  }

  // 游戏圈按钮
  private _gameClubButton?: WechatMinigame.GameClubButton;

  public showGameClubButton(): void {
    if (!this._gameClubButton && wx.createGameClubButton) {
      this._gameClubButton = wx.createGameClubButton({
        type: "text",
        text: "进入游戏圈",
        icon: "dark",
        style: {
          left: 10,
          top: 10,
          width: 100,
          height: 40,
          lineHeight: 40,
          backgroundColor: "#000000",
          color: "#ffffff",
          textAlign: "center",
          fontSize: 16,
          borderRadius: 4,
        },
      });
      this._gameClubButton.onTap(this.onClickGameClub.bind(this));
    }
  }

  private onClickGameClub(): void {
    console.log(`wx adapter click game club button`);
    const pageManager = wx.createPageManager();
    pageManager
      .load({
        // 由不同渠道获得的OPENLINK值
        openlink:
          "-SSEykJvFV3pORt5kTNpS5InPB_IqDrwbDecPapGAR5BRi9063WAxDL6vde4WxbJD1T3kFOmTWyRVq1APnt66mP02UiPhc9vRuSy2Bzquv-4X7ke0JqZSMiKSfK4f7TQD2bp0h3GE7skQ-nFIMMiKt0KDgjA6a5goe32zY1vhKMZl0wmQBPFad4821-h7EF8FtyfBUUxEHOn3RDjjcFu8QQKIUTuc2wm2y_pBAZEhFA_gGIDq8OG8rRsXHDqgJevsVyZJMClhGIHnHLLz-6zVWAfYP8DHcASf_ef8EsmabepXf-kh8WsquUL2tiVs0grX26qF3mlyaB960fsE6DvEw",
      })
      .then((res: any) => {
        // 加载成功，res 可能携带不同活动、功能返回的特殊回包信息（具体请参阅渠道说明）
        console.log("onClickGamePage pageManager.load: " + res);
        // 加载成功后按需显示
        pageManager.show();
      })
      .catch((err: Error) => {
        // 加载失败，请查阅 err 给出的错误信息
        console.error(err);
      });
  }

  public hideGameClubButton(): void {
    if (this._gameClubButton) {
      this._gameClubButton.offTap(this.onClickGameClub);
      this._gameClubButton.hide();
      this._gameClubButton = undefined;
    }
  }
}

export class WechatPlatformStorage implements IPlatformStorage {
  clear(): void {
    wx.clearStorage();
  }

  getItem<T = any>(key: string, callback?: (data?: T) => void): T {
    try {
      wx.getStorage({
        key: key,
        success: (result: { data: string }): void => {
          if (callback) callback(JSON.parse(result.data));
        },
        fail: () => {
          if (callback) callback(undefined);
        },
        complete: () => {
          //
        },
      });
    } catch (e) {
      return undefined;
    }
  }

  removeItem(key: string, callback?: (success?: boolean) => void): void {
    try {
      wx.removeStorage({
        key: key,
        success: (): void => {
          if (callback) callback(true);
        },
        fail: () => {
          if (callback) callback(false);
        },
        complete: () => {
          //
        },
      });
    } catch (e) {
      if (callback) callback(false);
    }
  }

  setItem(key: string, val: any, callback?: (success?: boolean) => void): void {
    try {
      wx.setStorage({
        key: key,
        data: JSON.stringify(val),
        success: (): void => {
          if (callback) callback(true);
        },
        fail: () => {
          if (callback) callback(false);
        },
        complete: () => {
          //
        },
      });
    } catch (e) {
      if (callback) callback(false);
    }
  }
}

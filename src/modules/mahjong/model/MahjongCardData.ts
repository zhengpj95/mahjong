/**
 * @author zpj
 * @date 2025/3/21
 */

import { CardData, getCardTypeRes } from "../MahjongConst";
import { GameCfg } from "@base/cfg/GameCfg";
import ConfigName = config.ConfigName;
import CardConfig = config.CardConfig;
import PoolObject = base.PoolObject;

/**单张麻将的数据*/
export class MahjongCardData implements PoolObject {
  public row: number;
  public col: number;
  public cardData: CardData;

  public updateInfo(row: number, col: number, data: CardData): void {
    this.row = row;
    this.col = col;
    this.cardData = data;
    const cardCfg = GameCfg.getCfgByNameId<CardConfig>(ConfigName.CARD, data[0]);
    this["cardName"] = cardCfg.res + data[1];
  }

  public isValid(): boolean {
    return this.cardData && this.cardData.length > 0;
  }

  public getIcon(): string {
    if (!this.cardData) {
      return "";
    }
    return getCardTypeRes(this.cardData[0], this.cardData[1]);
  }

  public checkSame(data: MahjongCardData): boolean {
    if (!data || !data.cardData) {
      return false;
    }
    if (!this.isValid()) {
      return false;
    }
    return data.cardData[0] === this.cardData[0] && data.cardData[1] === this.cardData[1];
  }

  public checkPos(data: MahjongCardData): boolean {
    if (!data) {
      return false;
    }
    return data.row === this.row && data.col === this.col;
  }

  onAlloc(): void {
    this.row = 0;
    this.col = 0;
    this.cardData = <any>undefined;
  }

  onFree(): void {
    this.onAlloc();
  }
}

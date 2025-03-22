import { CardType, FengType } from "@def/mahjong";
import { GameCfg } from "@base/cfg/GameCfg";
import ConfigName = config.ConfigName;
import CardConfig = config.CardConfig;

/**
 * @author zpj
 * @date 2025/3/21
 */

// 每种牌数量
export const CARD_COUNT = 4;
// 非字牌的数字类型
export const CARD_NUM_LIST: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// 卡牌格式 [牌类型, 牌数字]
export type CardData = [CardType, number | FengType]

export function getCardTypeRes(type: CardType, num: number): string {
  const cardCfg = GameCfg.getCfgByNameId<CardConfig>(ConfigName.CARD, type);
  return `mahjong/${cardCfg.res + num}.png`;
}

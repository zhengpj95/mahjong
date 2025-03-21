import { CardType, FengType } from "@def/mahjong";

/**
 * @author zpj
 * @date 2025/3/21
 */

export const CARD_COUNT = 4;
export const CARD_NUM_LIST: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const CARD_TYPE_LIST: CardType[] = [CardType.TONG, CardType.TIAO];
export const FENG_TYPE_LIST: FengType[] = [FengType.ZHONG, FengType.FA];
export const CardTypeName = {
  [CardType.TONG]: "tong",
  [CardType.WAN]: "wan",
  [CardType.TIAO]: "tiao",
  [CardType.FENG]: "feng"
};
// 卡牌格式 [牌类型, 牌数字]
export type CardData = [CardType, number | FengType]

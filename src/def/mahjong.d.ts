/**
 * @date 2024/12/23
 */

export const enum CardType {
  TONG = 1, // 9*4
  TIAO = 2, // 9*4
  WAN = 3, // 9*4
  FENG = 4 // 7*4
}

export const enum FengType {
  DONG = 1,
  NAN = 2,
  XI = 3,
  BEI = 4,
  ZHONG = 5,
  FA = 6,
  BAIBAN = 7
}


export const enum MahjongEvent {
  UPDATE_NEXT = "mahjong_update_next",
  SHOW_RESULT = "mahjong_show_result",
  UPDATE_SCORE = "mahjong_update_score",
}

export interface IMahjongResultParam {
  /**0成功，1失败*/
  type: number;
}

export const enum MahjongScoreType {
  TIPS = 5,
  REFRESH = 10
}
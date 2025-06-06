/** 关联配置表结构 */

/** 牌资源 */
interface CardConfig {
  /** card */
  readonly card: number;
  /** res */
  readonly res: string;
}

/** 关卡 */
interface LevelConfig {
  /** 关卡 */
  readonly level: number;
  /** 闯关时间 */
  readonly time: number;
  /** 牌类型 */
  readonly cardType: number[];
  /** 字牌（风牌和箭牌） */
  readonly fengType: number[];
  /** 布局[行,列] */
  readonly layout: number[];
}

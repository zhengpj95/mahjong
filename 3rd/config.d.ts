/** 本文件为导表工具导出，不可手动修改 */

declare module config {
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
    readonly cardType: any[];
    /** 字牌（风牌和箭牌） */
    readonly fengType: any[];
  }
}

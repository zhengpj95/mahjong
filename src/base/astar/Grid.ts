import { CellType } from "./AStarConst";

/**
 * Grid 类表示一个网格，在路径搜索中用于检查节点是否有效。
 */
export class Grid {
  private readonly _gridData: CellType[][]; // 网格数据

  /**
   * 构造函数
   * @param gridData - 二维数组，表示网格
   */
  constructor(gridData: CellType[][]) {
    this._gridData = gridData;
  }

  public get gridData(): CellType[][] {
    return this._gridData;
  }

  /**
   * 检查一个点是否在网格内且可通行
   * @param x - 点的 x 坐标
   * @param y - 点的 y 坐标
   * @returns 如果点有效且可通行，返回 true，否则返回 false
   */
  public isValid(x: number, y: number): boolean {
    return this.isInBounds(x, y) && this._gridData[x][y] === CellType.WALKABLE;
  }

  /**
   * 判断给定坐标是否在网格边界内
   * @param x 坐标 x
   * @param y 坐标 y
   * @returns 如果在边界内返回 true，否则返回 false
   */
  public isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
  }

  public getValue(x: number, y: number): CellType {
    if (!this.isInBounds(x, y)) {
      throw new Error(`Grid.getValue(${x}, ${y}) are out of bounds.`);
    }
    return this._gridData[x][y];
  }

  public setValue(x: number, y: number, val: CellType): boolean {
    if (!this.isInBounds(x, y)) {
      throw new Error(`Grid.getValue(${x}, ${y}) are out of bounds.`);
    }
    this._gridData[x][y] = val;
    return true;
  }

  /**
   * 获取网格的宽度
   * @returns 网格的列数
   */
  public get cols(): number {
    return this._gridData[0].length;
  }

  /**
   * 获取网格的高度
   * @returns 网格的行数
   */
  public get rows(): number {
    return this._gridData.length;
  }
}

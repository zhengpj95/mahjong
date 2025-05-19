/**
 * @date 2025/1/3
 */
import { AStar } from "./AStar";
import { Grid } from "./Grid";
import { CellType, GridPoint } from "./AStarConst";

export class AStarMgr {
  private _grid: Grid;
  private _astar: AStar;

  constructor(data: number[][]) {
    this.createAStar(data);
  }

  private createAStar(data: number[][]): void {
    this._grid = new Grid(data);
    this._astar = new AStar(this._grid);
  }

  public updateGrid(point: GridPoint, value: CellType): boolean {
    if (this._grid) {
      return this._grid.setValue(point[0], point[1], value);
    }
    return false;
  }

  public findPath(start: GridPoint, end: GridPoint): GridPoint[] {
    if (this._astar) {
      return this._astar.findPath(start, end);
    }
    return [];
  }
}
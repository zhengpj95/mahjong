/**
 * @date 2025/1/3
 */
import { AStar } from "./AStar";
import { Grid } from "./Grid";
import { GridPoint } from "./AStarConst";

export class AStarMgr {
  private _astar: AStar;

  constructor(data: number[][]) {
    this.createAStar(data);
  }

  private createAStar(data: number[][]): void {
    this._astar = new AStar(new Grid(data));
  }

  public findPath(start: GridPoint, end: GridPoint): GridPoint[] {
    if (this._astar) {
      return this._astar.findPath(start, end);
    }
    return [];
  }
}
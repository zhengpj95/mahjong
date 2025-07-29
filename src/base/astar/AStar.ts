import { Grid } from "./Grid";
import { CellType, GridPoint } from "./AStarConst";

/** 默认拐点数 */
const DEFAULT_TURN_COUNT = 2;
/** 方向（下 右 左 上） */
const DIRECTION: number[][] = [[0, 1], [1, 0], [-1, 0], [0, -1]];
const DIRECTION_NAME = ["down", "right", "left", "up"];

/**
 * 表示路径搜索中的节点信息
 */
class PathNode {
  public position: GridPoint; // 当前节点的位置 [x, y]
  public g: number;           // 从起点到当前节点的实际代价
  public h: number;           // 当前节点到目标节点的启发式估计代价
  public parent: PathNode | null; // 当前节点的父节点，用于回溯路径
  public direction: GridPoint | null; // 从父节点到当前节点的移动方向

  constructor(position: GridPoint, g: number, h: number, parent: PathNode | null = null, direction: GridPoint | null = null) {
    this.position = position;
    this.g = g;
    this.h = h;
    this.parent = parent;
    this.direction = direction;
  }

  /**
   * 获取节点的总代价 f = g + h
   */
  public get f(): number {
    return this.g + this.h;
  }

  /**路径信息*/
  private getPathStr(): string {
    const list: string[] = [this.position.join("_")];
    let p = this.parent;
    while (p) {
      list.push(p.position.join("_"));
      p = p.parent;
    }
    return list.reverse().join(",");
  }

  /**路径信息*/
  public get pathStr(): string {
    return this.getPathStr();
  }

  /**方向*/
  public get directionName(): string {
    if (!this.direction) {
      return "";
    }
    for (let i = 0; i < DIRECTION.length; i++) {
      if (DIRECTION[i].toString() === this.direction.toString()) {
        return DIRECTION_NAME[i];
      }
    }
    return "";
  }

  /**
   * 全部拐点数
   */
  public getTurnCountTotal(): number {
    if (!this.parent || !this.parent.direction || !this.direction) {
      return 0; // 起点没有拐点
    }
    let cnt = 0;
    let p = this.parent;
    let d = this.direction;
    while (p && d) {
      if (p.direction && d.toString() !== p.direction.toString()) {
        cnt++;
      }
      d = p.direction;
      p = p.parent;
    }
    return cnt;
  }
}

/**
 * A* 算法类
 */
export class AStar {
  private _grid: Grid; // 网格实例
  private _turnCount: number = 0;// 拐点数

  /**
   * 构造函数
   * @param grid - Grid 实例
   * @param turnCnt - 拐点数，默认2
   */
  constructor(grid: Grid, turnCnt = DEFAULT_TURN_COUNT) {
    this._grid = grid;
    this._turnCount = turnCnt;
  }

  /**
   * 启发式函数，用于估计从某个点到目标点的代价
   * 此处使用曼哈顿距离
   * @param a - 当前点 [x, y]
   * @param b - 目标点 [x, y]
   * @returns 曼哈顿距离
   */
  private heuristic(a: GridPoint, b: GridPoint): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  /**
   * 获取某个节点的所有邻居节点
   * @param node - 当前节点
   * @param end - 目标点
   * @returns 邻居节点的位置数组和方向
   */
  private getNeighbors(node: PathNode, end: GridPoint): [GridPoint, GridPoint][] {
    const [x, y] = node.position;
    const list = DIRECTION.map(([dx, dy]) => ([[x + dx, y + dy], [dx, dy]] as [GridPoint, GridPoint]));
    return list.filter(([pos]) => end[0] === pos[0] && end[1] === pos[1]
      ? this._grid.isInBounds(pos[0], pos[1])
      : this._grid.isValid(pos[0], pos[1]));
  }

  /**
   * 执行 A* 算法，查找从起点到终点的最短路径
   * @param start - 起点 [x, y]
   * @param end - 终点 [x, y]
   * @returns 最短路径的数组，如果无路径则返回空数组
   */
  public findPath(start: GridPoint, end: GridPoint): GridPoint[] {
    const openList: PathNode[] = [];        // 打开列表，存储待处理的节点
    const closedSet: Set<string> = new Set(); // 关闭列表，存储已处理的节点
    const excludeSet: Set<string> = new Set(); // 排除的路径

    // 创建起点节点并加入打开列表
    const startNode = new PathNode(start, 0, this.heuristic(start, end));
    openList.push(startNode);

    while (openList.length > 0) {
      // 按照 f 值 + 拐点数排序，选择最优的节点
      openList.sort((a, b) => (a.f + a.getTurnCountTotal()) - (b.f + b.getTurnCountTotal()));
      const currentNode = openList.shift()!; // 当前节点
      if (excludeSet.has(currentNode.pathStr)) {
        continue;
      }

      // 如果到达终点，则回溯路径
      if (currentNode.position[0] === end[0] && currentNode.position[1] === end[1]) {
        const path: GridPoint[] = [];
        let node: PathNode | null = currentNode;
        while (node) {
          path.unshift(node.position); // 将路径反向插入
          node = node.parent;
        }
        return path;
      }

      // 将当前节点标记为已处理
      closedSet.add(currentNode.pathStr);

      // 遍历当前节点的邻居
      const neighborList = this.getNeighbors(currentNode, end);
      for (const [neighbor, direction] of neighborList) {
        const neighborPath = currentNode.pathStr + "," + neighbor.toString();
        if (closedSet.has(neighborPath) || excludeSet.has(neighborPath)) {
          continue; // 如果邻居已处理，跳过
        }

        const g = currentNode.g + 1; // 从起点到邻居的实际代价
        const h = this.heuristic(neighbor, end); // 邻居到目标的启发式代价
        const neighborNode = new PathNode(neighbor, g, h, currentNode, direction);
        if (neighborNode.getTurnCountTotal() > this._turnCount) {
          excludeSet.add(neighborPath);//排除的路径
          continue;
        }
        const existingNode = openList.find(node => node.pathStr === neighborPath);

        // 如果邻居节点不在打开列表或新的路径代价更低
        if (!existingNode || g < existingNode.g) {
          if (existingNode) {
            // 如果邻居节点已存在，移除旧的节点
            openList.splice(openList.indexOf(existingNode), 1);
          }
          // 将邻居节点加入打开列表
          openList.push(neighborNode);
        }
      }
    }

    // 如果打开列表为空且未找到路径，则返回空数组
    return [];
  }

  public findPath2(start: GridPoint, end: GridPoint): GridPoint[] {
    const linePath = isLinePath(start[0], start[1], end[0], end[1], this._grid.gridData);
    if (linePath?.length > 1) {
      return linePath.map(value => [value.x, value.y]);
    }
    const lPath = connectLPath({ x: start[0], y: start[1] }, {
      x: end[0],
      y: end[1]
    }, this._grid.gridData);
    if (lPath?.length > 1) {
      return lPath.map(value => [value.x, value.y]);
    }
    const turnsPath = connect2TurnsPath({ x: start[0], y: start[1] }, {
      x: end[0],
      y: end[1]
    }, this._grid.gridData);
    if (turnsPath?.length > 1) {
      return turnsPath.map(value => [value.x, value.y]);
    }
    return [];
  }
}

// 点坐标定义
interface Point {
  x: number;
  y: number;
  dir?: number;
  dirName?: string;
}

function mergePath(p1: Point[], p2: Point[]): Point[] {
  if (p1.length === 0) return p2;
  if (p2.length === 0) return p1;
  if (p1[p1.length - 1].x === p2[0].x && p1[p1.length - 1].y === p2[0].y) {
    return [...p1, ...p2.slice(1)];
  }
  return [...p1, ...p2];
}

// 判断两个点之间直线是否无障碍，并返回路径
function isLinePath(x1: number, y1: number, x2: number, y2: number, grid: CellType[][]): Point[] | null {
  const path: Point[] = [{ x: x1, y: y1 }];
  if (x1 === x2) {
    if (y1 > y2) {
      for (let y = y1 - 1; y > y2; y--) {
        if (grid[x1][y] !== CellType.WALKABLE) return null;
        path.push({ x: x1, y });
      }
    } else {
      for (let y = y1 + 1; y < y2; y++) {
        if (grid[x1][y] !== CellType.WALKABLE) return null;
        path.push({ x: x1, y });
      }
    }
    path.push({ x: x2, y: y2 });
    return path;
  } else if (y1 === y2) {
    if (x1 > x2) {
      for (let x = x1 - 1; x > x2; x--) {
        if (grid[x][y1] !== CellType.WALKABLE) return null;
        path.push({ x, y: y1 });
      }
    } else {
      for (let x = x1 + 1; x < x2; x++) {
        if (grid[x][y1] !== CellType.WALKABLE) return null;
        path.push({ x, y: y1 });
      }
    }
    path.push({ x: x2, y: y2 });
    return path;
  }
  return null;
}

// 判断是否可通过一次转折相连，并返回路径
function connectLPath(a: Point, b: Point, grid: CellType[][]): Point[] | null {
  const { x: x1, y: y1 } = a;
  const { x: x2, y: y2 } = b;

  if (grid[x2][y1] === CellType.WALKABLE) {
    const path1 = isLinePath(x1, y1, x2, y1, grid);
    const path2 = isLinePath(x2, y1, x2, y2, grid);
    if (path1 && path2) return mergePath(path1, path2);
  }
  if (grid[x1][y2] === CellType.WALKABLE) {
    const path1 = isLinePath(x1, y1, x1, y2, grid);
    const path2 = isLinePath(x1, y2, x2, y2, grid);
    if (path1 && path2) return mergePath(path1, path2);
  }
  return null;
}

// 判断是否可通过最多两次转折连接，并返回路径
function connect2TurnsPath(start: Point, end: Point, grid: CellType[][]): Point[] | null {
  const tryConnect = (a: Point, b: Point): Point[] | null => {
    const { x: x1, y: y1 } = a;
    const { x: x2, y: y2 } = b;
    const rows = grid.length;
    const cols = grid[0].length;

    const visited = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Array(4).fill(Infinity))
    );
    const queue: { x: number; y: number; path: Point[]; turn: number; dir: number }[] = [];

    for (let d = 0; d < DIRECTION.length; d++) {
      visited[x1][y1][d] = 0;
      queue.push({ x: x1, y: y1, path: [{ x: x1, y: y1, dir: d, dirName: DIRECTION_NAME[d] }], turn: 0, dir: d });
    }

    while (queue.length > 0) {
      const { x, y, path, turn, dir } = queue.shift();
      // if (_DEBUG_) {
      //   console.log(dir, DIRECTION_NAME[dir], path);
      // }
      const dx = x + DIRECTION[dir][0];
      const dy = y + DIRECTION[dir][1];

      if (turn > DEFAULT_TURN_COUNT || dx < 0 || dx >= rows || dy < 0 || dy >= cols) continue;
      if (!(dx === x2 && dy === y2) && grid[dx][dy] !== CellType.WALKABLE) continue;
      if (visited[dx][dy][dir] <= turn) continue;

      visited[dx][dy][dir] = turn;
      const last = path[path.length - 1];
      const newPath = last.x === dx && last.y === dy ? [...path] : [...path, {
        x: dx,
        y: dy,
        dir: dir,
        dirName: DIRECTION_NAME[dir]
      }];
      if (dx === x2 && dy === y2) {
        return newPath;
      }

      for (let d1 = 0; d1 < DIRECTION.length; d1++) {
        const isTurn = d1 === dir ? 0 : 1;
        const dx1 = x + DIRECTION[d1][0];
        const dy1 = y + DIRECTION[d1][1];
        if (dx1 < 0 || dx1 >= rows || dy1 < 0 || dy1 >= cols) continue;
        if (last.x === dx1 && last.y === dy1) continue;
        queue.push({ x: dx, y: dy, path: newPath, turn: turn + isTurn, dir: d1 });
      }
    }

    return null;
  };
  return tryConnect(start, end) || tryConnect(end, start);
}

import { Grid } from "./Grid";
import { GridPoint } from "./AStarConst";

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
    if (this.getTurnCount()) {
      this.g += 1;
    }
  }

  /**
   * 获取节点的总代价 f = g + h
   */
  public get f(): number {
    return this.g + this.h;
  }

  /**
   * 计算当前节点的拐点数
   */
  public getTurnCount(): number {
    if (!this.parent || !this.parent.direction || !this.direction) {
      return 0; // 起点没有拐点
    }
    return this.direction.toString() !== this.parent.direction.toString() ? 1 : 0;
  }
}

/**
 * A* 算法类
 */
export class AStar {
  private _grid: Grid; // 网格实例

  /**
   * 构造函数
   * @param grid - Grid 实例
   */
  constructor(grid: Grid) {
    this._grid = grid;
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
   * @returns 邻居节点的位置数组和方向
   */
  private getNeighbors(node: PathNode): [GridPoint, GridPoint][] {
    const [x, y] = node.position;
    const directions: GridPoint[] = [
      [0, 1], [1, 0], [0, -1], [-1, 0], // 上下左右四个方向
    ];
    return directions
      .map(([dx, dy]) => ([[x + dx, y + dy], [dx, dy]] as [GridPoint, GridPoint]))
      .filter(([pos]) => this._grid.isValid(pos[0], pos[1]));
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

    // 创建起点节点并加入打开列表
    const startNode = new PathNode(start, 0, this.heuristic(start, end));
    openList.push(startNode);

    while (openList.length > 0) {
      // 按照 f 值 + 拐点数排序，选择最优的节点
      openList.sort((a, b) => (a.f + a.getTurnCount()) - (b.f + b.getTurnCount()));
      const currentNode = openList.shift()!; // 当前节点

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
      closedSet.add(currentNode.position.toString());

      // 遍历当前节点的邻居
      const neighbors = this.getNeighbors(currentNode);
      for (const [neighborPos, direction] of neighbors) {
        if (closedSet.has(neighborPos.toString())) {
          continue; // 如果邻居已处理，跳过
        }

        const g = currentNode.g + 1; // 从起点到邻居的实际代价
        const h = this.heuristic(neighborPos, end); // 邻居到目标的启发式代价
        const existingNode = openList.find(
          node => node.position[0] === neighborPos[0] && node.position[1] === neighborPos[1]
        );

        // 如果邻居节点不在打开列表或新的路径代价更低
        if (!existingNode || g < existingNode.g) {
          if (existingNode) {
            // 如果邻居节点已存在，移除旧的节点
            openList.splice(openList.indexOf(existingNode), 1);
          }
          // 将邻居节点加入打开列表
          openList.push(new PathNode(neighborPos, g, h, currentNode, direction));
        }
      }
    }

    // 如果打开列表为空且未找到路径，则返回空数组
    return [];
  }
}

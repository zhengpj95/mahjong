/**
 * @date 2025/1/3
 */

// 定义网格单元类型
export enum CellType {
  WALKABLE = 0, // 可行走
  OBSTACLE = 1, // 障碍
}

// 表示网格中点的坐标类型 [x, y]
export type GridPoint = [number, number];

/**
 * @author zpj
 * @date 2025/6/9
 */
export interface ISceneUpdate {
  update: (elapsed: number) => void;
}

export interface IComponent extends ISceneUpdate {
  start: () => void;
  stop: () => void;
}

export interface PathNode {
  x: number;
  y: number;
}

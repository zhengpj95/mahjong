import { Action, Direction, MonsterType, SceneEntityType } from "./EntityConst";

export interface SceneEntityVO {
  entityId: number; //唯一id
  name: string;
  hp: number;
  maxHp: number;
  power: number;
  type: SceneEntityType;
  point: { x: number; y: number };
  action: Action;
  avatarName: string;
  dir: Direction;
}

export interface ScenePlayerVO extends SceneEntityVO {
  vip: number;
  skills?: number[];
}

export interface SceneMonsterVo extends SceneEntityVO {
  monsterType: MonsterType;
}

export interface SceneDropVO extends SceneEntityVO {
  itemId: number; // 道具id
}

/**
 * @date 2025/6/9
 */

export const enum SceneEntityType {
  PLAYER = 1,
  MONSTER = 2,
  DROP = 3,
}

export const enum Action {
  WALK = "Walk",
  IDLE = "Idle",
  ATTACK = "Attack",
  HURT = "Hurt",
  DEATH = "Death",
}

export const enum Direction {
  TOP = 0,
  TOP_RIGHT = 1,
  RIGHT = 2,
  BOTTOM_RIGHT = 3,
  BOTTOM = 4,
  BOTTOM_LEFT = 5,
  LEFT = 6,
  TOP_LEFT = 7,
}

export const enum MonsterType {
  BOSS = 1,
  MONSTER = 2,
}

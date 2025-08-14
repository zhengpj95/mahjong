import { SceneMonsterVo, ScenePlayerVO } from "@base/entity/SceneEntityVO";
import {
  Action,
  Direction,
  MonsterType,
  SceneEntityType,
} from "@base/entity/EntityConst";
import { ScenePlayer } from "@base/entity/ScenePlayer";
import { SceneMonster } from "@base/entity/SceneMonster";
import { SceneEntity } from "@base/entity/SceneEntity";
import { ComponentType } from "@base/component/ComponentConst";
import { SceneEvent } from "@def/scene";
import { FrameUpdateMgr } from "@base/FrameUpdateMgr";
import Sprite = Laya.Sprite;
import Handler = Laya.Handler;
import BaseMediator = base.BaseMediator;
import LayerIndex = base.LayerIndex;
import eventMgr = base.eventMgr;
import poolMgr = base.poolMgr;
import EventVo = base.EventVo;

function createMonster(): SceneMonsterVo {
  return {
    entityId: 2001,
    name: "monster" + ((Math.random() * 10) >> 0),
    hp: 10000,
    maxHp: 10000,
    power: 999999,
    type: SceneEntityType.MONSTER,
    point: { x: 550, y: 100 },
    action: Action.WALK,
    avatarName: `resources/player/rogue`,
    monsterType: MonsterType.MONSTER,
    dir: Direction.LEFT,
  };
}

/**
 * 场景
 * @date 2025/6/9
 */
export class SceneMdr extends BaseMediator {
  private _entitySprite: Sprite;
  private _singleMap: Sprite;
  private _player: ScenePlayer;
  private _entityList: SceneEntity[] = [];

  constructor() {
    super(LayerIndex.MAP, "");
  }

  protected addEvents(): void {
    eventMgr.on(SceneEvent.ADD_TO_SCENE, this.onAddEntity, this);
    eventMgr.on(SceneEvent.REMOVE_FROM_SCENE, this.onDelEntity, this);
  }

  protected initUI(): void {
    //
  }

  protected initView(handler: Laya.Handler): void {
    const sprite = new Sprite();
    sprite.size(Laya.stage.width, Laya.stage.height);
    handler.runWith(sprite);
  }

  protected onClose(): void {
    //
  }

  protected removeEvents(): void {
    eventMgr.off(SceneEvent.ADD_TO_SCENE, this.onAddEntity, this);
    eventMgr.off(SceneEvent.REMOVE_FROM_SCENE, this.onDelEntity, this);
  }

  private createEntitySprite(): Sprite {
    const sprite = new Sprite();
    sprite.width = Laya.stage.width;
    sprite.height = Laya.stage.height;
    sprite.name = "_entitySprite";
    sprite.mouseEnabled = false;
    sprite.mouseThrough = true;
    return sprite;
  }

  public onOpen(): void {
    this._singleMap = new Sprite();
    this.ui.addChild(this._singleMap);
    this._singleMap.loadImage(
      "resources/map/s320_s.jpg",
      Handler.create(this, () => {
        const offsetX = (this._singleMap.width - Laya.stage.width) / 2;
        const offsetY = (this._singleMap.height - Laya.stage.height) / 2;
        this._singleMap.pos(-offsetX, -offsetY);
      }),
    );

    if (!this._entitySprite) {
      this._entitySprite = this.createEntitySprite();
      this.ui.addChild(this._entitySprite);
    }

    const playerVo: ScenePlayerVO = {
      entityId: 1001,
      name: "无尽猪猪",
      hp: 10000,
      maxHp: 10000,
      power: 999999,
      type: SceneEntityType.PLAYER,
      vip: 0,
      point: { x: 100, y: 100 },
      action: Action.IDLE,
      avatarName: `resources/player/knight`,
      dir: Direction.RIGHT,
    };
    this._player = new ScenePlayer();
    this._player.init(playerVo);

    FrameUpdateMgr.ins().addTimer(this, this.update);
  }

  private onAddEntity(e: EventVo<SceneEntity>): void {
    const entity = e.data;
    if (!entity) return;
    const avatar = entity.getComponent(ComponentType.AVATAR);
    if (avatar) {
      this._entitySprite.addChild(avatar.display);
    }
    if (this._entityList.indexOf(entity) < 0) {
      this._entityList.push(entity);
    }
  }

  private onDelEntity(e: EventVo<SceneEntity>): void {
    const entity = e.data;
    if (!entity) return;
    const idx = this._entityList.indexOf(entity);
    const avatar = entity.getComponent(ComponentType.AVATAR);
    if (avatar && avatar.display) {
      avatar.display.removeSelf();
    }
    if (idx > -1) {
      this._entityList.splice(idx, 1);
    }
  }

  private createMonster(): void {
    if (this._entityList.length > 1) return;
    const monsterVo = createMonster();
    const monster = poolMgr.alloc(SceneMonster);
    monster.init(monsterVo);
    monster.addPath({ x: 150, y: 100 });
    this._player.battle = monster;
  }

  public update(elapsed: number): void {
    this.createMonster();

    const delTmp: SceneEntity[] = [];
    const list = this._entityList;
    for (const entity of list) {
      if (entity) {
        if (entity.isDone) {
          delTmp.push(entity);
        } else {
          entity.update(elapsed);
        }
      }
    }
    if (delTmp.length) {
      for (const item of delTmp) {
        item.destroy();
        const idx = this._entityList.indexOf(item);
        if (idx > -1) this._entityList.splice(idx, 1);
      }
      delTmp.length = 0;
    }
  }
}

import { SceneEntity } from "../entity/SceneEntity";
import { ComponentType } from "./ComponentConst";
import { IComponent } from "../BaseConst";

/**
 * 实体组件基类
 * @date 2025/6/9
 */
export class BaseComponent implements IComponent {
  /** 组件所属类型  */
  private _type: ComponentType;
  /** 组件在运行否 */
  private _isRunning: boolean;
  /** 组件所属场景实体 */
  private _entity: SceneEntity;

  get entity(): SceneEntity {
    return this._entity;
  }

  set entity(value: SceneEntity) {
    this._entity = value;
  }

  get isRunning(): boolean {
    return this._isRunning;
  }

  get type(): ComponentType {
    return this._type;
  }

  set type(value: ComponentType) {
    this._type = value;
  }

  public start(): void {
    this._isRunning = true;
  }

  public stop(): void {
    this._isRunning = false;
    this._type = ComponentType.NONE;
    this._entity = <any>undefined;
  }

  public update(elapsed: number): void {
    //
  }
}

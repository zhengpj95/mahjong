import { SceneEntityVO } from "./SceneEntityVO";
import { BaseComponent } from "../component/BaseComponent";
import { ComponentType, ComponentTypeMap, IComponentTypeMap, } from "../component/ComponentConst";
import { ISceneUpdate } from "../BaseConst";
import PoolObject = base.PoolObject;

/**
 * 场景实体
 * @date 2025/6/9
 */
export class SceneEntity implements ISceneUpdate, PoolObject {
  private _components: Record<number, BaseComponent> = {};

  private _vo: SceneEntityVO;
  get vo(): SceneEntityVO {
    return this._vo;
  }

  set vo(value: SceneEntityVO) {
    this._vo = value;
  }

  private _battle: SceneEntity;
  get battle(): SceneEntity {
    return this._battle;
  }

  set battle(value: SceneEntity) {
    this._battle = value;
  }

  private _isDone: boolean = false;
  public set isDone(value: boolean) {
    this._isDone = value;
  }

  public get isDone(): boolean {
    return this._isDone;
  }

  public init(vo: SceneEntityVO): void {
    this.vo = vo;
  }

  public addComponent<K extends keyof IComponentTypeMap>(
    type: K,
  ): IComponentTypeMap[K] {
    if (this._components[type]) {
      return <IComponentTypeMap[K]>this._components[type];
    }
    const comp = ComponentTypeMap[type];
    const compIns = new comp();
    compIns.type = type;
    compIns.entity = this;
    this._components[type] = compIns;
    compIns.start();
    return <IComponentTypeMap[K]>compIns;
  }

  public getComponent<K extends keyof IComponentTypeMap>(
    type: K,
  ): IComponentTypeMap[K] {
    return <IComponentTypeMap[K]>this._components[type];
  }

  public removeComponent(type: ComponentType | number): boolean;
  public removeComponent<K extends keyof IComponentTypeMap>(type: K): boolean {
    if (!this._components[type]) {
      return false;
    }
    const compIns = <IComponentTypeMap[K]>this._components[type];
    compIns.stop();
    this._components[type] = null;
    delete this._components[type];
    return true;
  }

  public update(elapsed: number): void {
    if (!this.vo) return;

    const delTmp: BaseComponent[] = [];
    const keys = Object.keys(this._components);
    for (const key of keys) {
      const comp = <BaseComponent>this._components[+key];
      if (comp && comp.isRunning) {
        comp.update(elapsed);
      } else {
        delTmp.push(comp);
      }
    }
    if (delTmp.length) {
      for (const tmp of delTmp) {
        if (tmp) this.removeComponent(tmp.type);
      }
      delTmp.length = 0;
    }
  }

  public destroy(): void {
    this.onFree();
  }

  public onAlloc(): void {
    this._components = {};
    this.vo = <any>undefined;
    this.battle = <any>undefined;
  }

  public onFree(): void {
    const keys = Object.keys(this._components);
    for (const key of keys) {
      this.removeComponent(+key);
    }
    this._components = {};
    this._isDone = false;
    this._vo = <any>undefined;
  }
}

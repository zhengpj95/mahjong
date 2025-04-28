declare module base {
  class CallBack<T extends any[] = [], R = any, C = any> {
      get method(): (this: C, ...args: T) => R;
      get caller(): C | undefined;
      get once(): boolean;
      get id(): number;
      static alloc<T extends any[], R, C>(context: C, func: (this: C, ...args: T) => R, once?: boolean): CallBack<T, R, C>;
      static alloc<T extends any[], R, C, A0>(context: C, func: (this: C, arg0: A0, ...args: T) => R, args: [A0], once?: boolean): CallBack<T, R, C>;
      static alloc<T extends any[], R, C, A0, A1>(context: C, func: (this: C, arg0: A0, arg1: A1, ...args: T) => R, args: [A0, A1], once?: boolean): CallBack<T, R, C>;
      exec(...data: T): R | undefined;
      free(): void;
      isEqual(caller: any, method: (...args: any[]) => any): boolean;
  }
  
  interface PoolObject {
      onAlloc?: () => void;
      onFree?: () => void;
  }
  
  class PoolManager {
      alloc<T>(cls: new (...params: any[]) => T, ...args: any[]): T;
      free(obj: any): boolean;
  }
  const poolMgr: PoolManager;
  
  class GEvent<T = any> implements PoolObject {
      static alloc<T>(type: string, data: T): GEvent<T>;
      get type(): string;
      get data(): T;
      onAlloc(): void;
      onFree(): void;
  }
  
  type EventFunc = (...args: any[]) => any;
  class EventManager {
      on(key: string, method: EventFunc, caller: any): void;
      off(key: string, method: EventFunc, caller: any): void;
      emit(key: string, data?: any): void;
      offAllByKey(key: string): void;
      offAll(): void;
  }
  const eventMgr: EventManager;
  
  interface IEase {
      in: EaseFunc;
      out: EaseFunc;
      inOut: EaseFunc;
  }
  type EaseFunc = (t: number) => number;
  type TweenProperties = Record<string, number>;
  interface TweenManger {
      get: (target: any, vars?: {
          loop?: boolean;
          yoyo?: boolean;
          repeat?: number;
          scale?: number;
      }) => Tween;
      remove: (target: any) => void;
  }
  interface Tween {
      to: (properties: TweenProperties, duration: number, ease?: EaseFunc, onComplete?: CallBack) => void;
      from: (properties: TweenProperties, duration: number, ease?: EaseFunc, onComplete?: CallBack) => void;
  }
  
  class Ease {
      static Quad: IEase;
      static Linear: IEase;
      static Cubic: IEase;
      static Quart: IEase;
      static Quint: IEase;
      static Strong: IEase;
      static Sine: IEase;
      static Back: IEase;
      static Circ: IEase;
      static Bounce: IEase;
      static Elastic: IEase;
      static Expo: IEase;
  }
  
  const tweenMgr: TweenManger;
  
  class TimerManager {
      tick(): boolean;
      setTimeOut(delay: number, cb: CallBack): void;
      setFrameOut(delay: number, cb: CallBack): void;
      doTimer(delay: number, repeat: number, cb: CallBack, finishCb?: CallBack): void;
      doTimerDelay(startTime: number, delay: number, repeat: number, cb: CallBack, finishCb?: CallBack): void;
      doFrame(delay: number, repeat: number, cb: CallBack, finishCb?: CallBack): void;
      doFrameDelay(startTime: number, delay: number, repeat: number, cb: CallBack, finishCb?: CallBack): void;
      remove(cb: CallBack): void;
      removeAll(caller: any): void;
      isExist(cb: CallBack): boolean;
  }
  const timerMgr: TimerManager;
  
  interface ISocket {
      connect(host?: string, port?: number): void;
      send(msg: any): void;
      receive(event?: MessageEvent): void;
      decodeMsg(): any;
      encodeMsg(data: any): any;
  }
  class SocketManager implements ISocket {
      connect(host?: string, port?: number): void;
      send(data: string): void;
      receive(event?: MessageEvent): void;
      decodeMsg(): any;
      encodeMsg(data: any): any;
  }
  const socketMgr: SocketManager;
  
  type ResourceLoader = (url: string, callback: (err: any, asset: any) => void) => void;
  class ResourceManager {
      init(loader: ResourceLoader): void;
      load(url: string, callback: (err: any, asset: any) => void): void;
      preload(urls: string[], onComplete?: () => void): void;
      release(url: string): void;
      tick(): void;
  }
  const resourceMgr: ResourceManager;
  
  type VoidFunc = (...args: any) => void;
  class BaseEmitter {
      emit(event: string, args?: any): void;
      on(event: string, method: VoidFunc, caller: any): void;
      off(event: string, method: (...args: any) => void, caller: any): void;
      offAll(event: string, caller: any): void;
  }
  
  abstract class BaseProxy extends BaseEmitter {
      abstract init(): void;
  }
  
  abstract class BaseCommand extends BaseEmitter {
      abstract exec(args: any): void;
  }
  
  const MdrKey = "_mediator_";
  function findMediator<T extends BaseMediator<any>>(comp: Laya.Node & {
      [MdrKey]?: T;
  }): T | undefined;
  type ModuleType$2 = number;
  abstract class BaseMediator<T extends Laya.Sprite = Laya.Sprite> extends BaseEmitter {
      protected ui: T | undefined;
      protected params?: any;
      protected isOpened: boolean;
      protected parent: Laya.Sprite;
      protected uiUrl?: string;
      protected _module: BaseModule;
      protected _moduleName: ModuleType$2;
      protected _viewType: number;
      private __name__;
      protected constructor(url: string, parent: any);
      setModule(module: BaseModule): void;
      setViewType(view: number): void;
      getViewType(): number;
      setName(name: string): void;
      getName(): string;
      open(params?: any): void;
      close(): void;
      protected initView(handler: Laya.Handler): void;
      private onUILoaded;
      protected abstract initUI(): void;
      protected abstract addEvents(): void;
      protected abstract onOpen(): void;
      protected abstract onClose(): void;
      protected abstract removeEvents(): void;
      protected destroyUI(): void;
  }
  
  type MdrCls = new () => BaseMediator;
  type CmdCls = new () => BaseCommand;
  type ModuleType$1 = number;
  type ProxyType$1 = number;
  abstract class BaseModule {
      name: ModuleType$1;
      private _cmdMap;
      private _proxyInsMap;
      private _mdrMap;
      private _mdrInsMap;
      protected constructor(module: ModuleType$1);
      onReg(): void;
      protected abstract initCmd(): void;
      protected abstract initProxy(): void;
      protected abstract initMdr(): void;
      regCmd(event: string, cls: CmdCls): void;
      private exeCmd;
      regProxy(type: ProxyType$1, proxy: new () => BaseProxy): void;
      retProxy<T extends BaseProxy>(type: ProxyType$1): T;
      regMdr(viewType: number, mdr: MdrCls): void;
      retMdr(viewType: number): MdrCls;
      regMdrIns(mdr: BaseMediator): void;
      retMdrIns(viewType: number): BaseMediator;
      removeMdrIns(viewType: number): void;
  }
  
  let facade: Facade;
  type ModuleType = number;
  type ProxyType = number;
  type BaseModuleCls = new () => BaseModule;
  class Facade {
      private readonly _moduleMap;
      private readonly _moduleList;
      regModule(m: BaseModule): void;
      retModule(type: ModuleType): BaseModule;
      push<T extends BaseModuleCls>(cls: T): void;
      instantiate(): void;
      getProxy<T extends BaseProxy>(module: ModuleType, proxy: ProxyType): T | undefined;
  }
  
  function baseLoop(): void;
  function baseInit(): void;
  
  export { BaseCommand, BaseMediator, BaseModule, BaseProxy, CallBack, Ease, GEvent, PoolObject, baseInit, baseLoop, eventMgr, facade, findMediator, poolMgr, resourceMgr, socketMgr, timerMgr, tweenMgr };
  
}
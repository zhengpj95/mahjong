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
      free?: () => void;
      destroy?: () => void;
      onAlloc?: () => void;
      onFree?: () => void;
  }
  
  class PoolManager {
      alloc<T>(cls: new (...params: any[]) => T, ...args: any[]): T;
      free(obj: any): boolean;
  }
  const poolMgr: PoolManager;
  
  const LoadPriority: {
      FIRST: number;
      UI: number;
      UI_SCENE: number;
      SCENE: number;
      DEFAULT: number;
  };
  type LoadPriority = (typeof LoadPriority)[keyof typeof LoadPriority];
  function resetDisplay(dis: Laya.Sprite): void;
  class BitmapBase extends Laya.Sprite implements PoolObject {
      center: boolean;
      loadPri: LoadPriority;
      set source(value: Laya.Texture | string | undefined);
      get source(): Laya.Texture | string | undefined;
      setAnchor(x?: number, y?: number): void;
      protected onLoaded(): void;
      onAlloc(): void;
      onFree(): void;
      free(): void;
  }
  
  type SingletonConstructor<T> = {
      new (): T;
      _instance?: T;
      name?: string;
  };
  class Singleton<T> {
      static ins<T>(this: SingletonConstructor<T>): T;
  }
  
  class EventData<T = any> implements PoolObject {
      static alloc<T>(type: string, data: T): EventData<T>;
      get type(): string;
      get data(): T;
      free(): void;
      onAlloc(): void;
      onFree(): void;
  }
  
  type EventFunc = (...args: any[]) => any;
  class EventManager {
      on(event: string, method: EventFunc, caller: any, args?: any[]): void;
      once(event: string, method: EventFunc, caller: any, args?: any[]): void;
      off(event: string, method: EventFunc, caller: any): void;
      emit(event: string, data?: any): void;
      offAllByKey(event: string): void;
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
  
  const LayerIndex: {
      readonly NONE: -1;
      readonly MAP: 0;
      readonly MAIN: 1;
      readonly MODAL: 2;
      readonly TIPS: 3;
  };
  type LayerIndex = (typeof LayerIndex)[keyof typeof LayerIndex];
  
  class BaseLayer extends Laya.Sprite {
      idx: number;
      constructor(idx?: number);
      onResize(): void;
  }
  class LayerManager {
      getLayer(idx: LayerIndex): BaseLayer;
      onResize(): void;
  }
  const layerMgr: LayerManager;
  
  type VoidMethod = (...args: any) => void;
  type LayaEvent = {
      target: Laya.EventDispatcher;
      event: string;
      method: VoidMethod;
      thisObject: any;
      args?: any[] | undefined;
  };
  class BaseEmitter {
      protected emit(event: string, args?: any): void;
      protected mulOn(events: string[], method: VoidMethod, caller?: any): void;
      protected on(event: string, method: VoidMethod, caller?: any, args?: any[]): void;
      protected once(event: string, method: VoidMethod, caller?: any, args?: any[]): void;
      protected off(event: string, method: VoidMethod, caller?: any): void;
      protected onLaya(target: LayaEvent["target"], event: LayaEvent["event"], method: LayaEvent["method"], thisObject?: LayaEvent["thisObject"], args?: any[] | undefined): void;
      protected offLaya(target: LayaEvent["target"], event: LayaEvent["event"], listener: LayaEvent["method"], thisObject?: LayaEvent["thisObject"]): void;
      protected offAll(): void;
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
  abstract class BaseMediator<T extends Laya.Sprite = Laya.Sprite> extends BaseEmitter {
      protected ui: T | undefined;
      protected params?: any;
      protected constructor(parent: LayerIndex | Laya.Sprite, url?: string, isEasyClose?: boolean);
      getViewType(): number;
      getName(): string;
      close(): void;
      protected initView(handler: Laya.Handler): void;
      protected abstract initUI(): void;
      protected abstract addEvents(): void;
      protected abstract onOpen(): void;
      protected abstract onClose(): void;
  }
  
  type MdrCls = new () => BaseMediator;
  type CmdCls = new () => BaseCommand;
  type ModuleType$1 = number;
  type ProxyType$1 = number;
  abstract class BaseModule {
      protected constructor(module: ModuleType$1);
      protected abstract initCmd(): void;
      protected abstract initProxy(): void;
      protected abstract initMdr(): void;
      regCmd(event: string, cls: CmdCls): void;
      regProxy(type: ProxyType$1, proxy: new () => BaseProxy): void;
      retProxy<T extends BaseProxy>(type: ProxyType$1): T;
      regMdr(viewType: number, mdr: MdrCls): void;
      retMdr(viewType: number): MdrCls;
      regMdrIns(mdr: BaseMediator): void;
      retMdrIns(viewType: number): BaseMediator;
      removeMdrIns(viewType: number): void;
  }
  
  type ModuleType = number;
  type ProxyType = number;
  type BaseModuleCls = new () => BaseModule;
  class Facade {
      push<T extends BaseModuleCls>(cls: T): void;
      instantiate(): void;
      getProxy<T extends BaseProxy>(module: ModuleType, proxy: ProxyType): T | undefined;
      openView(module: ModuleType, viewType: number, params?: any): void;
      closeView(module: ModuleType, viewType: number): void;
  }
  const facade: Facade;
  
  interface IFrameData {
      filename: string;
      frame: {
          x: number;
          y: number;
          w: number;
          h: number;
      };
      rotated: boolean;
      trimmed: boolean;
      spriteSourceSize: {
          x: number;
          y: number;
          w: number;
          h: number;
      };
      sourceSize: {
          w: number;
          h: number;
      };
  }
  class MergedBitmap implements PoolObject {
      get frames(): IFrameData[] | undefined;
      get texture(): Laya.Texture | undefined;
      get loadComplete(): boolean;
      static onLoad(url: string, callback: CallBack<[MergedBitmap]>): void;
      onLoad(url: string, callback: CallBack<[MergedBitmap]>): void;
      getTextureList(): Laya.Texture[];
      onAlloc(): void;
      onRelease(): void;
  }
  
  class BmpMovieClip extends BitmapBase implements PoolObject {
      center: boolean;
      play(url: string, container: Laya.Sprite, cnt?: number, callBack?: CallBack, remove?: boolean, removeParent?: boolean): void;
      onAlloc(): void;
      onFree(): void;
  }
  
  class RpgMovieClip extends BitmapBase implements PoolObject {
      center: boolean;
      setAction(action: string): void;
      setCnt(cnt: number): void;
      play(url: string, container: Laya.Sprite, cnt?: number, loadCallBack?: CallBack, finishCallback?: CallBack, remove?: boolean): void;
      onAlloc(): void;
      onFree(): void;
  }
  
  function baseLoop(): void;
  function baseInit(): void;
  
  export { BaseCommand, BaseMediator, BaseModule, BaseProxy, BitmapBase, BmpMovieClip, CallBack, Ease, EventData, LayerIndex, LoadPriority, MergedBitmap, PoolObject, RpgMovieClip, Singleton, baseInit, baseLoop, eventMgr, facade, findMediator, layerMgr, poolMgr, resetDisplay, resourceMgr, socketMgr, timerMgr, tweenMgr };
  
}
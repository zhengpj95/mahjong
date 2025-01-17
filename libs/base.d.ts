declare namespace base {
  const ON_CONNECT_CREATE: string;
  const ON_CONNECT_LOST: string;
  const ON_CONNECT_ERROR: string;
  let traceProto: (type: string, proto?: any) => void;
  let onMsg: (proto: any) => void;

  function __reg(id: number, c: any): void;
}
declare namespace base {
  class ObjBase extends egret.HashObject {
  }
}
declare namespace base {
  class Notifier extends ObjBase {
    sendNt(notify: string, data?: any): void;
  }
}
declare namespace base {
  class GameService extends ObjBase {
    connectTo(host: string, port: string): void;

    isConnected(): boolean;

    close(): void;

    onNt(protoT: any, method: (ntfy: GameNT) => void, context: any): void;

    offNt(protoT: any, method: (ntfy: GameNT) => void, context: any): void;

    sendProto(proto: any): void;
  }
}
declare namespace base {
  class Pool {
    static alloc<T>(cls: new () => T): T;

    static release(item: any): undefined;

    static releaseList(list: any[]): void;
  }
}
declare namespace base {
  import DisplayObjectContainer = egret.DisplayObjectContainer;

  class Mod extends ObjBase implements UpdateItem {
    constructor(name: string);

    getName(): string;

    onRegister(): void;

    protected initCmd(): void;

    protected initModel(): void;

    protected initView(): void;

    regCmd<T extends Cmd>(notify: string, cls: new () => T): void;

    unregCmd(notify: string): void;

    regProxy<T extends IProxy>(type: number, cls: new () => T): void;

    retProxy<T extends IProxy>(type: number): T;

    regMdr<T extends Mdr>(type: string, mdr: new (parent: DisplayObjectContainer) => T): void;

    showView(type: string, data?: any, parent?: DisplayObjectContainer): void;

    hideView(type: string): void;

    onConnectLost(): void;

    update(time: Time): void;
  }
}
declare namespace base {
  const Consts: {
    Pool_Size: number;
    Pool_Unused_T: number;
    Pool_Resize_T: number;
    Mdr_Dispose_T: number;
  };
}
declare namespace base {
  class Proxy extends Notifier implements IProxy {
    readonly service: GameService;

    initialize(): void;

    onStartReconnect(): void;

    protected onProto(protoT: any, method: (ntfy: GameNT) => void, context: any): void;

    protected offProto(protoT: any, method: (ntfy: GameNT) => void, context: any): void;

    protected sendProto(proto: any): void;
  }
}
declare namespace base {
  class Connection extends ObjBase {
    onMsgReceive: Handler;
    onCreated: Handler;
    onLost: Handler;
    onError: Handler;

    connect(url: string): void;

    readonly isConnected: boolean;

    disconnect(): void;

    send(proto: any): void;

    dispose(): void;
  }
}
declare namespace base {
  class Cmd extends Notifier {
    protected owner: Mod;

    exec(n: GameNT): void;

    protected retProxy<T extends IProxy>(type: number): T;
  }
}
declare namespace base {
  class Socket {
    onOpen: Handler;
    onClose: Handler;
    onError: Handler;
    onMessage: Handler;
    readonly connected: boolean;

    connect(url: string): void;

    close(): void;

    send(buffer: ArrayBuffer): void;

    dispose(): void;
  }
}
declare namespace base {
  import DisplayObjectContainer = egret.DisplayObjectContainer;

  class Facade {
    regMod(o: Mod): void;

    retMod(name: string): Mod;

    showView(moduleName: string, viewType: string, data?: any, parent?: DisplayObjectContainer): void;

    hideView(moduleName: string, viewType: string): void;

    onNt(notify: string, method: Function, context: any): void;

    sendNt(notify: string, data?: any): void;

    onConnectLost(): void;
  }

  const facade: Facade;
}
declare namespace base {
  class GameNT extends ObjBase implements PoolObject {
    static alloc(type: string, body?: any): GameNT;

    readonly type: string;
    readonly body: any;

    onAlloc(): void;

    onRelease(): void;

    dispose(): void;
  }
}
declare namespace base {
  function getClassName(value: any): string;
}
declare namespace base {
  function getProtoName(proto: any): string;
}
declare namespace base {
  interface IProxy {
    readonly service: GameService;

    initialize(): void;

    onStartReconnect(): void;
  }
}
declare namespace base {
  interface PoolObject extends DisposeObject {
    onAlloc(): void;

    onRelease(): void;
  }
}
declare namespace base {
  class Time {
    /**
     * 游戏运行经过的时间，毫秒，getTimer()
     */
    readonly time: number;
    /**
     * 当前服务器时间，毫秒
     */
    readonly serverTime: number;
    /**
     * 当前服务器时间，秒
     */
    readonly serverTimeSecond: number;
  }
}
declare namespace base {
  class TimeMgr {
    static init(): void;

    static needPause: boolean;
    static readonly isActivate: boolean;
    static readonly time: Time;

    static addUpdateItem(item: UpdateItem, interval?: number): void;

    static removeUpdateItem(item: UpdateItem): void;

    static hasUpdateItem(item: UpdateItem): boolean;

    static setServerTime(now: number, startTime?: number): void;

    static getCount(item: UpdateItem): number;

    static getElapseTime(item: UpdateItem): number;

    static setWorker(worker: Worker): void;
  }
}
declare namespace base {
  interface UpdateItem {
    update(time: Time): void;
  }
}
declare namespace base {
  function delayCall(handler: Handler, delay?: number): number;

  function clearDelay(key: number): void;
}
declare namespace base {
  type EaseFun = (t: number, b: number, c: number, d: number) => number;

  class Tween {
    /**
     * 获取一个新的缓动对象
     * @param target 缓动目标
     * @param {{loop?: boolean}} vars 额外参数
     * @param {boolean?} vars.loop 是否循环缓动
     * @return {base.Tween}
     */
    static get(target: any, vars?: {
      loop?: boolean;
    }): Tween;

    /**
     * 移除一个对象所有的缓动
     * @param target 缓动目标
     */
    static remove(target: any): void;

    /**
     * 开始缓动，从当前值变化到目标值
     * @param {{onUpdate?: base.Handler}} vars 变更的目标值合集
     * @param {number} duration 持续时间，毫秒
     * @param {Handler} [onUpdate=null] 更新时回调
     * @param {base.EaseFun} [ease=Linear.easeNone] 缓动函数
     * @return {base.Tween}
     */
    to(vars: any, duration: number, onUpdate?: Handler, ease?: EaseFun): Tween;

    /**
     * 开始缓动，从目标值变化到当前值
     * @param {{onUpdate?: base.Handler}} vars 变更的目标值合集
     * @param {number} duration 持续时间，毫秒
     * @param {Handler} [onUpdate=null] 更新时回调
     * @param {base.EaseFun} [ease=Linear.easeNone] 缓动函数
     * @return {base.Tween}
     */
    from(vars: any, duration: number, onUpdate?: Handler, ease?: EaseFun): Tween;

    /**
     * 延迟
     * @param {number} duration 延迟时间，毫秒
     * @return {base.Tween}
     */
    delay(duration: number): Tween;

    /**
     * 执行回调
     * @param {base.Handler} handler 回调
     * @return {base.Tween}
     */
    exec(handler: Handler): Tween;

    dispose(): void;
  }
}
declare namespace base {
  class Back {
    static easeIn(t: number, b: number, c: number, d: number, s?: number): number;

    static easeOut(t: number, b: number, c: number, d: number, s?: number): number;

    static easeInOut(t: number, b: number, c: number, d: number, s?: number): number;

    static easeOutExtra(t: number, b: number, c: number, d: number, s?: number): number;
  }

  class Bounce {
    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Circ {
    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Cubic {
    static power: number;

    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Elastic {
    static easeIn(t: number, b: number, c: number, d: number, a?: number, p?: number): number;

    static easeOut(t: number, b: number, c: number, d: number, a?: number, p?: number): number;

    static easeInOut(t: number, b: number, c: number, d: number, a?: number, p?: number): number;
  }

  class Expo {
    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class IntegerSine {
    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Linear {
    static power: number;

    static easeNone(t: number, b: number, c: number, d: number): number;

    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Quad {
    static power: number;

    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Quart {
    static power: number;

    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Quint {
    static power: number;

    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Sine {
    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }

  class Strong {
    static power: number;

    static easeIn(t: number, b: number, c: number, d: number): number;

    static easeOut(t: number, b: number, c: number, d: number): number;

    static easeInOut(t: number, b: number, c: number, d: number): number;
  }
}
declare namespace base {
  class Handler extends ObjBase implements PoolObject {
    static alloc(context: any, method: Function, args?: any[], once?: boolean): Handler;

    static equalMethod(handler: Handler, method: Function, context: any): boolean;

    static equal(handler: Handler, other: Handler): boolean;

    readonly context: any;
    readonly method: Function;

    exec(data?: any): any;

    dispose(): void;

    onAlloc(): void;

    onRelease(): void;
  }
}
declare namespace base {
  import DisplayObjectContainer = egret.DisplayObjectContainer;
  import DisplayObject = egret.DisplayObject;
  import EventDispatcher = egret.EventDispatcher;

  class Mdr extends Notifier implements DisposeObject {
    isEasyHide: boolean;
    protected _showArgs: any;
    protected _owner: Mod;

    constructor(parent: DisplayObjectContainer);

    readonly name: string;

    $setOwner(base: Mod): void;

    protected mark<T extends DisplayObject>(key: string, type: new () => T): T;

    protected newView(): void;

    protected getView(): DisplayObject;

    protected onNt(notify: string, method: Function, context: any): void;

    protected offNt(notify: string): void;

    protected onEgret(target: EventDispatcher, type: string, listener: Function, thisObject?: any): void;

    protected offEgret(target: EventDispatcher, type: string, listener: Function, thisObject?: any): void;

    show(obj?: any): void;

    protected doShow(): void;

    hide(disposeImmediately?: boolean): void;

    protected doHide(disposeImmediately: boolean): void;

    dispose(): void;

    protected onAssetLoaded(): void;

    protected onInit(): void;

    protected addListeners(): void;

    protected onShow(): void;

    protected onHide(): void;

    protected showView(type: string, data?: any): void;

    protected retProxy<T extends IProxy>(type: number): T;
  }
}
declare namespace base {
  interface DisposeObject {
    dispose(): void;
  }
}

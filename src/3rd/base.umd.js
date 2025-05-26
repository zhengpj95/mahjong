(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.base = {}));
})(this, (function (exports) { 'use strict';
          if (typeof globalThis !== "undefined") {
              globalThis.base = exports;
          } else if (typeof window !== "undefined") {
              window.base = exports;
          } else if (typeof global !== "undefined") {
              global.base = exports;
          }

  class CallBack {
      constructor() {
          this._id = 0;
          this._caller = undefined;
          this._method = undefined;
          this._args = [];
          this._once = false;
      }
      get method() {
          return this._method;
      }
      get caller() {
          return this._caller;
      }
      get once() {
          return this._once;
      }
      get id() {
          return this._id;
      }
      static alloc(context, func, args, once) {
          if (typeof func !== "function") {
              throw new Error("CallBack func must be Function!");
          }
          if (typeof args === "boolean") {
              once = args;
              args = undefined;
          }
          const instance = this._pool.length > 0
              ? this._pool.pop()
              : new CallBack();
          instance._id = ++CallBack._gid;
          instance._caller = context || undefined;
          instance._method = func;
          instance._args = args;
          instance._once = !!once;
          return instance;
      }
      exec(...data) {
          if (!this._method) {
              return undefined;
          }
          const id = this._id;
          let args;
          if (!data.length) {
              args = this._args;
          }
          else if (this._args) {
              args = this._args.concat(data);
          }
          else {
              args = data;
          }
          const result = this._method.apply(this._caller, args);
          this._id === id && this._once && this.free();
          return result;
      }
      free() {
          if (!this.id) {
              return;
          }
          this._caller = undefined;
          this._method = undefined;
          if (this._args) {
              this._args.length = 0;
          }
          this._once = false;
          this._id = 0;
          CallBack._pool.push(this);
      }
      isEqual(caller, method) {
          if (!method) {
              return false;
          }
          return this._caller === caller && this._method === method;
      }
  }
  CallBack._pool = [];
  CallBack._gid = 1;

  function getQualifiedClassName(value) {
      const type = typeof value;
      if (!value || (type !== "object" && !value.prototype)) {
          return type + "";
      }
      const prototype = value.prototype
          ? value.prototype
          : Object.getPrototypeOf(value);
      if (Object.prototype.hasOwnProperty.call(prototype, "__class__") &&
          prototype["__class__"]) {
          return prototype["__class__"];
      }
      else if (type === "function" && value.name) {
          return value.name;
      }
      else if (prototype.constructor && prototype.constructor.name) {
          return prototype.constructor.name;
      }
      const constructorString = prototype.constructor.toString().trim();
      const index = constructorString.indexOf("(");
      const className = constructorString.substring(9, index);
      Object.defineProperty(prototype, "__class__", {
          value: className,
          enumerable: false,
          writable: true,
      });
      return className;
  }
  const PoolObjectName = "__PoolObjectName__";
  class PoolManager {
      constructor() {
          this._poolMap = {};
      }
      alloc(cls, ...args) {
          const className = getQualifiedClassName(cls);
          if (!this._poolMap[className]) {
              this._poolMap[className] = [];
          }
          const list = this._poolMap[className];
          if (list.length) {
              const vo = list.pop();
              if (vo["onAlloc"] && typeof vo["onAlloc"] === "function") {
                  vo["onAlloc"]();
              }
              return vo;
          }
          const clazz = new cls(...args);
          if (clazz["onAlloc"] && typeof clazz["onAlloc"] === "function") {
              clazz["onAlloc"]();
          }
          clazz[`${PoolObjectName}`] = className;
          return clazz;
      }
      free(obj) {
          if (!obj) {
              return false;
          }
          const refKey = obj[`${PoolObjectName}`];
          if (!refKey ||
              !this._poolMap[refKey] ||
              this._poolMap[refKey].indexOf(obj) > -1) {
              return false;
          }
          if (obj["onFree"] && typeof obj["onFree"] === "function") {
              obj["onFree"]();
          }
          this._poolMap[refKey].push(obj);
          return true;
      }
      clear() {
          this._poolMap = {};
      }
      getContent() {
          return this._poolMap;
      }
      setCount(count = 5) {
          for (const key in this._poolMap) {
              const list = this._poolMap[key];
              if (list.length > count) {
                  list.length = count;
              }
          }
      }
  }
  const poolMgr = new PoolManager();

  class TimerVo {
      constructor() {
          this.useFrame = false;
          this.interval = 0;
          this.isRepeat = false;
          this.repeatCount = 0;
          this.exeTime = 0;
          this.lastExeTime = 0;
          this.callBack = undefined;
          this.finishCallBack = undefined;
      }
      onAlloc() {
          this.onFree();
      }
      onFree() {
          var _a, _b;
          this.interval = 0;
          this.isRepeat = false;
          this.repeatCount = 0;
          this.exeTime = 0;
          (_a = this.callBack) === null || _a === undefined ? undefined : _a.free();
          this.callBack = undefined;
          (_b = this.finishCallBack) === null || _b === undefined ? undefined : _b.free();
          this.finishCallBack = undefined;
          this.useFrame = false;
          this.lastExeTime = 0;
      }
      isEqual(cb) {
          if (!this.callBack) {
              return false;
          }
          return (this.callBack.method === cb.method && this.callBack.caller === cb.caller);
      }
      isEqualCaller(caller) {
          if (!caller || !this.callBack) {
              return false;
          }
          return caller === this.callBack.caller;
      }
  }

  class TimerManager {
      constructor() {
          this._curTime = 0;
          this._curFrame = 0;
          this._timeList = [];
          this._frameList = [];
          this._deleteList = [];
          this._curTime = Date.now();
          this._curFrame = 0;
          this._timeList = [];
          this._frameList = [];
          this._deleteList = [];
      }
      removeVo(vo) {
          if (!vo) {
              return;
          }
          let idx = this._timeList.indexOf(vo);
          if (idx > -1) {
              this._timeList.splice(idx, 0);
          }
          idx = this._frameList.indexOf(vo);
          if (idx > -1) {
              this._frameList.splice(idx, 0);
          }
          poolMgr.free(vo);
      }
      tick() {
          var _a, _b, _c, _d, _e;
          this._curTime = Date.now();
          this._curFrame++;
          while ((_a = this._deleteList) === null || _a === undefined ? undefined : _a.length) {
              this.removeVo(this._deleteList.pop());
          }
          if ((_b = this._frameList) === null || _b === undefined ? undefined : _b.length) {
              for (const vo of this._frameList) {
                  if (this._deleteList.includes(vo)) {
                      continue;
                  }
                  if (vo.exeTime <= this._curFrame) {
                      vo.callBack.exec(this._curFrame - vo.lastExeTime);
                      vo.lastExeTime = this._curFrame;
                      vo.exeTime += vo.interval;
                      if (!vo.isRepeat) {
                          if (vo.repeatCount > 0) {
                              vo.repeatCount--;
                          }
                          else {
                              (_c = vo.finishCallBack) === null || _c === undefined ? undefined : _c.exec(this._curFrame - vo.lastExeTime);
                              if (!this._deleteList.includes(vo)) {
                                  this._deleteList.push(vo);
                              }
                          }
                      }
                  }
              }
          }
          if ((_d = this._timeList) === null || _d === undefined ? undefined : _d.length) {
              for (const vo of this._timeList) {
                  if (this._deleteList.includes(vo)) {
                      continue;
                  }
                  if (vo.exeTime <= this._curTime) {
                      vo.callBack.exec(this._curTime - vo.lastExeTime);
                      vo.lastExeTime = this._curTime;
                      vo.exeTime = this._curTime + vo.interval;
                      if (!vo.isRepeat) {
                          if (vo.repeatCount > 0) {
                              vo.repeatCount--;
                          }
                          else {
                              (_e = vo.finishCallBack) === null || _e === undefined ? undefined : _e.exec(this._curFrame - vo.lastExeTime);
                              if (!this._deleteList.includes(vo)) {
                                  this._deleteList.push(vo);
                              }
                          }
                      }
                  }
              }
          }
          return true;
      }
      create(useFrame, delay, repeat, cb, finishCb) {
          if (delay < 0 || repeat < 0 || !cb) {
              return;
          }
          this.remove(cb);
          const vo = poolMgr.alloc(TimerVo);
          vo.interval = delay;
          vo.isRepeat = repeat === 0;
          vo.repeatCount = repeat;
          vo.exeTime = delay + (useFrame ? this._curFrame : this._curTime);
          vo.callBack = cb;
          vo.finishCallBack = finishCb;
          vo.useFrame = useFrame;
          vo.lastExeTime = 0;
          if (useFrame) {
              this._frameList.push(vo);
          }
          else {
              this._timeList.push(vo);
          }
      }
      setTimeOut(delay, cb) {
          this.doTimer(delay, 1, cb);
      }
      setFrameOut(delay, cb) {
          this.doFrame(delay, 1, cb);
      }
      doTimer(delay, repeat, cb, finishCb) {
          this.create(false, delay, repeat, cb, finishCb);
      }
      doTimerDelay(startTime, delay, repeat, cb, finishCb) {
          this.setTimeOut(startTime, CallBack.alloc(this, () => {
              this.doTimer(delay, repeat, cb, finishCb);
          }));
      }
      doFrame(delay, repeat, cb, finishCb) {
          this.create(true, delay, repeat, cb, finishCb);
      }
      doFrameDelay(startTime, delay, repeat, cb, finishCb) {
          this.setFrameOut(startTime, CallBack.alloc(this, () => {
              this.doFrame(delay, repeat, cb, finishCb);
          }));
      }
      remove(cb) {
          const list = this._timeList.concat(this._frameList).slice();
          for (const vo of list) {
              if (vo === null || vo === undefined ? undefined : vo.isEqual(cb)) {
                  this._deleteList.push(vo);
                  break;
              }
          }
      }
      removeAll(caller) {
          const list = this._timeList.concat(this._frameList).slice();
          for (const vo of list) {
              if (vo === null || vo === undefined ? undefined : vo.isEqualCaller(caller)) {
                  this._deleteList.push(vo);
                  break;
              }
          }
      }
      isExist(cb) {
          const list = this._timeList.concat(this._frameList).slice();
          return !!list.find((vo) => { var _a; return cb && cb.id === ((_a = vo.callBack) === null || _a === undefined ? undefined : _a.id); });
      }
  }
  const timerMgr = new TimerManager();

  function checkInStage(target) {
      if (!target) {
          return false;
      }
      return target instanceof Laya.Node && target.displayedInStage;
  }
  const EaseNone = (p) => p;

  class TweenImpl {
      constructor() {
          this.target = undefined;
          this.duration = 0;
          this.properties = {};
          this.startTime = null;
          this.startProperties = {};
          this.loop = false;
          this.yoyo = false;
          this.isReversing = false;
          this.repeat = 0;
          this.repeatCount = 0;
          this.ease = EaseNone;
          this.timeScale = 1;
      }
      init(target, vars) {
          var _a, _b, _c, _d;
          this.target = target;
          this.loop = (_a = vars === null || vars === undefined ? undefined : vars.loop) !== null && _a !== undefined ? _a : false;
          this.yoyo = (_b = vars === null || vars === undefined ? undefined : vars.yoyo) !== null && _b !== undefined ? _b : false;
          this.repeat = (_c = vars === null || vars === undefined ? undefined : vars.repeat) !== null && _c !== undefined ? _c : 0;
          this.timeScale = (_d = vars === null || vars === undefined ? undefined : vars.scale) !== null && _d !== undefined ? _d : 1;
          this.ease = EaseNone;
          this.duration = 0;
          this.properties = {};
          this.onComplete = undefined;
          return this;
      }
      to(properties, duration, ease = EaseNone, onComplete) {
          this.properties = properties;
          this.duration = duration;
          this.ease = ease || EaseNone;
          this.onComplete = onComplete;
          this.start();
      }
      from(properties, duration, ease = EaseNone, onComplete) {
          this.properties = properties;
          this.duration = duration;
          this.ease = ease || EaseNone;
          this.onComplete = onComplete;
          this.start(true);
      }
      start(isFrom = false) {
          this.startTime = Date.now();
          if (isFrom) {
              for (const prop in this.properties) {
                  this.startProperties[prop] = this.properties[prop];
                  this.properties[prop] = this.target[prop];
              }
          }
          else {
              for (const prop in this.properties) {
                  this.startProperties[prop] = this.target[prop];
              }
          }
      }
      update(currentTime) {
          if (!this.target || !checkInStage(this.target))
              return true;
          if (this.startTime === null)
              return false;
          const elapsed = currentTime - this.startTime;
          let t = (elapsed * this.timeScale) / this.duration;
          if (t >= 1) {
              if (this.yoyo && !this.isReversing) {
                  this.isReversing = true;
                  this.startTime = currentTime;
                  return false;
              }
              else if (this.loop || (this.repeat && this.repeatCount < this.repeat)) {
                  this.isReversing = false;
                  this.startTime = currentTime;
                  this.repeatCount++;
                  return false;
              }
              else {
                  for (const prop in this.properties) {
                      this.target[prop] = this.isReversing
                          ? this.startProperties[prop]
                          : this.properties[prop];
                  }
                  if (this.onComplete) {
                      this.onComplete.exec();
                  }
                  return true;
              }
          }
          else {
              if (this.isReversing) {
                  t = 1 - t;
              }
              t = this.ease(t);
              for (const prop in this.properties) {
                  const startValue = this.startProperties[prop];
                  const endValue = this.properties[prop];
                  this.target[prop] = startValue + (endValue - startValue) * t;
              }
              return false;
          }
      }
      checkTarget(target) {
          return this.target && this.target === target;
      }
      dispose() {
          if (this.onComplete) {
              this.onComplete.free();
              this.onComplete = undefined;
          }
          this.target = undefined;
          this.properties = {};
          this.startTime = null;
      }
  }

  let TWEEN_ID = 0;
  const TWEEN_ID_FLAG = "$TWEEN_ID";
  class TweenManagerImpl {
      constructor() {
          this._tweens = [];
          this._tmpTweens = [];
      }
      reg(tw) {
          tw[TWEEN_ID_FLAG] = ++TWEEN_ID;
          this._tmpTweens.push(tw);
          return tw;
      }
      get(target, vars) {
          return this.reg(new TweenImpl().init(target, vars));
      }
      remove(target) {
          if (this._tmpTweens.length) {
              this._tweens.push(...this._tmpTweens);
              this._tmpTweens.length = 0;
          }
          for (const tw of this._tweens) {
              if (tw.checkTarget(target)) {
                  tw.dispose();
              }
          }
      }
      update() {
          const currentTime = Date.now();
          if (this._tmpTweens.length) {
              this._tweens.push(...this._tmpTweens);
              this._tmpTweens.length = 0;
          }
          const delList = [];
          const list = this._tweens;
          for (const tw of list) {
              if (tw.update(currentTime)) {
                  delList.push(tw);
              }
          }
          if (delList === null || delList === undefined ? undefined : delList.length) {
              for (const tw of delList) {
                  if (tw) {
                      tw.dispose();
                      const idx = this._tweens.indexOf(tw);
                      if (idx > -1) {
                          this._tweens.splice(idx, 1);
                      }
                  }
              }
              delList.length = 0;
          }
      }
  }
  const tweenMgr = new TweenManagerImpl();
  function _loopTween() {
      tweenMgr.update();
  }

  const LayerIndex = {
      NONE: -1,
      MAP: 0,
      MAIN: 1,
      MODAL: 2,
      TIPS: 3,
  };

  function createEmptyTexture(width, height) {
      const pixelData = new Uint8Array(width * height * 4);
      pixelData.fill(0);
      for (let i = 3; i < pixelData.length; i += 4) {
          pixelData[i] = 255 * 0.5;
      }
      const tex2D = new Laya.Texture2D(width, height, Laya.TextureFormat.R8G8B8A8, false, false);
      tex2D.setPixelsData(pixelData, false, false);
      return Laya.Texture.create(tex2D, 0, 0, width, height, 0, 0);
  }
  function createPopupSprite(w, h) {
      const sp = new Laya.Sprite();
      sp.texture = createEmptyTexture(w, h);
      return sp;
  }
  const MdrKey$1 = "_mediator_";
  function findMediatorTemp(comp) {
      if (!comp)
          return undefined;
      let mdr = comp[MdrKey$1];
      while (comp && !mdr) {
          comp = comp.parent;
          if (comp[MdrKey$1]) {
              mdr = comp[MdrKey$1];
          }
      }
      return mdr;
  }
  class BaseLayer extends Laya.Sprite {
      constructor(idx = LayerIndex.NONE) {
          super();
          this.idx = idx;
          this.name = "layer_" + idx;
          this.mouseThrough = true;
      }
      onResize() {
          this.width = Laya.stage.width;
          this.height = Laya.stage.height;
      }
  }
  class MapLayer extends BaseLayer {
      constructor() {
          super(LayerIndex.MAP);
      }
  }
  class MainLayer extends BaseLayer {
      constructor() {
          super(LayerIndex.MAIN);
      }
  }
  class ModalLayer extends BaseLayer {
      constructor() {
          super(LayerIndex.MODAL);
      }
      addChild(node) {
          const res = super.addChild(node);
          if (res === this._popupSp) {
              return res;
          }
          if (node instanceof Laya.Scene) {
              const mdr = findMediatorTemp(node);
              if (mdr === null || mdr === undefined ? undefined : mdr.isEasyClose) {
                  node.mouseThrough = true;
              }
          }
          this.updateModel();
          return res;
      }
      removeChild(node) {
          const res = super.removeChild(node);
          if (res === this._popupSp) {
              return res;
          }
          this.updateModel();
          return res;
      }
      updateModel() {
          if (!this.numChildren) {
              return;
          }
          if (this._popupSp) {
              const idx = this.getChildIndex(this._popupSp);
              if (!idx && this.numChildren === 1) {
                  this.remModel();
                  return;
              }
              if (idx > -1) {
                  this.setChildIndex(this._popupSp, this.numChildren - 2);
                  return;
              }
          }
          this.addModel();
      }
      addModel() {
          if (!this._popupSp) {
              this._popupSp = createPopupSprite(Laya.stage.width, Laya.stage.height);
              this._popupSp.name = `popup_sprite`;
          }
          this._popupSp.mouseEnabled = true;
          this.addChildAt(this._popupSp, this.numChildren - 1);
          this._popupSp.on(Laya.Event.CLICK, this, this.onClickPopup);
      }
      onClickPopup() {
          var _a, _b;
          const parent = (_a = this._popupSp) === null || _a === undefined ? undefined : _a.parent;
          if (parent) {
              const mdr = findMediatorTemp(parent.getChildAt(parent.numChildren - 1));
              if (mdr === null || mdr === undefined ? undefined : mdr.isEasyClose) {
                  (_b = mdr === null || mdr === undefined ? undefined : mdr.close) === null || _b === undefined ? undefined : _b.call(mdr);
              }
          }
      }
      remModel() {
          if (!this._popupSp || !this.contains(this._popupSp)) {
              return;
          }
          this.removeChildAt(0);
      }
  }
  class TipsLayer extends BaseLayer {
      constructor() {
          super(LayerIndex.TIPS);
      }
  }
  class LayerManager {
      constructor() {
          this._layers = Object.create(null);
      }
      initLayer() {
          this.setLayer(new MapLayer());
          this.setLayer(new MainLayer());
          this.setLayer(new ModalLayer());
          this.setLayer(new TipsLayer());
      }
      setLayer(layer) {
          this._layers[layer.idx] = layer;
          Laya.stage.addChild(layer);
      }
      getLayer(idx) {
          return this._layers[idx];
      }
      onResize() {
          if (!Laya.stage) {
              return;
          }
          for (const idx in this._layers) {
              const layer = this._layers[idx];
              layer && layer.onResize();
          }
      }
  }
  const layerMgr = new LayerManager();
  function initLayer() {
      layerMgr.initLayer();
  }

  class EventData {
      constructor() {
          this._type = "";
          this._data = undefined;
      }
      static alloc(type, data) {
          const eData = poolMgr.alloc(EventData);
          eData._type = type;
          eData._data = data;
          return eData;
      }
      get type() {
          return this._type;
      }
      get data() {
          return this._data;
      }
      free() {
          poolMgr.free(this);
      }
      onAlloc() {
          this.onFree();
      }
      onFree() {
          this._type = "";
          this._data = undefined;
      }
  }

  class EventManager {
      constructor() {
          this._messages = {};
      }
      on(event, method, caller, args) {
          if (!this._messages[event]) {
              this._messages[event] = [];
          }
          const list = this._messages[event];
          for (const callBack of list) {
              if (callBack === null || callBack === undefined ? undefined : callBack.isEqual(caller, method)) {
                  return;
              }
          }
          const callBack = CallBack.alloc(caller, method, (args !== null && args !== undefined ? args : []), false);
          this._messages[event].push(callBack);
      }
      once(event, method, caller, args) {
          const wrapper = (...args) => {
              this.off(event, wrapper, caller);
              method.apply(caller, args);
          };
          this.on(event, wrapper, caller, args);
      }
      off(event, method, caller) {
          const list = this._messages[event];
          if (!list || !list.length) {
              return;
          }
          for (let i = 0; i < list.length; i++) {
              const callBack = list[i];
              if (callBack === null || callBack === undefined ? undefined : callBack.isEqual(caller, method)) {
                  list[i] = undefined;
                  break;
              }
          }
      }
      emit(event, data) {
          const list = this._messages[event];
          if (!list || !list.length) {
              return;
          }
          for (let i = 0; i < list.length; i++) {
              const callBack = list[i];
              if (!callBack) {
                  list.splice(i, 1);
                  i--;
                  continue;
              }
              const nt = EventData.alloc(event, data);
              callBack.exec(nt);
              nt.free();
          }
          if (list.length === 0) {
              delete this._messages[event];
          }
      }
      offAllByKey(event) {
          const list = this._messages[event];
          if (!list || !list.length) {
              return;
          }
          for (const callBack of list) {
              if (callBack) {
                  this.off(event, callBack.method, callBack.caller);
              }
          }
          delete this._messages[event];
      }
      offAll() {
          const keys = Object.keys(this._messages) || [];
          for (const key of keys) {
              this.offAllByKey(key);
              delete this._messages[key];
          }
          this._messages = {};
      }
  }
  const eventMgr = new EventManager();

  const Linear = {
      in: EaseNone,
      out: EaseNone,
      inOut: EaseNone,
  };
  const Quad = {
      in: function (t) {
          return t * t;
      },
      out: function (t) {
          return t * (2 - t);
      },
      inOut: function (t) {
          if (t < 0.5) {
              return 2 * t * t;
          }
          else {
              return 1 - 2 * (1 - t) * (1 - t);
          }
      },
  };
  const Cubic = {
      in: function (t) {
          return t * t * t;
      },
      out: function (t) {
          return 1 - Math.pow(1 - t, 3);
      },
      inOut: function (t) {
          if (t < 0.5) {
              return 4 * t * t * t;
          }
          else {
              return 1 - Math.pow(-2 * t + 2, 3) / 2;
          }
      },
  };
  const Quart = {
      in: function (t) {
          return t * t * t * t;
      },
      out: function (t) {
          return 1 - Math.pow(1 - t, 4);
      },
      inOut: function (t) {
          if (t < 0.5) {
              return 8 * t * t * t * t;
          }
          else {
              return 1 - Math.pow(-2 * t + 2, 4) / 2;
          }
      },
  };
  const Quint = {
      in: function (t) {
          return t * t * t * t * t;
      },
      out: function (t) {
          return 1 - Math.pow(1 - t, 5);
      },
      inOut: function (t) {
          if (t < 0.5) {
              return 16 * t * t * t * t * t;
          }
          else {
              return 1 - Math.pow(-2 * t + 2, 5) / 2;
          }
      },
  };
  const Strong = {
      in: function (t) {
          return t * t * t * t * t * t;
      },
      out: function (t) {
          return 1 - Math.pow(1 - t, 6);
      },
      inOut: function (t) {
          if (t < 0.5) {
              return 16 * t * t * t * t * t * t;
          }
          else {
              return 1 - Math.pow(-2 * t + 2, 6) / 2;
          }
      },
  };
  const Sine = {
      in: function (t) {
          return 1 - Math.cos((t * Math.PI) / 2);
      },
      out: function (t) {
          return Math.sin((t * Math.PI) / 2);
      },
      inOut: function (t) {
          return -(Math.cos(Math.PI * t) - 1) / 2;
      },
  };
  const BackNum = 1.70158;
  const Back = {
      in: (t) => t * t * ((BackNum + 1) * t - BackNum),
      out: function (t) {
          t -= 1;
          return t * t * ((BackNum + 1) * t + BackNum) + 1;
      },
      inOut: function (t) {
          const s = 1.70158 * 1.525;
          if (t < 0.5) {
              return (t * 2 * t * ((s + 1) * t * 2 - s)) / 2;
          }
          else {
              t = t * 2 - 2;
              return (t * t * ((s + 1) * t + s) + 2) / 2;
          }
      },
  };
  const Circ = {
      in: (t) => 1 - Math.sqrt(1 - t * t),
      out: (t) => Math.sqrt(1 - (t - 1) * (t - 1)),
      inOut: (t) => {
          if (t < 0.5) {
              return (1 - Math.sqrt(1 - 2 * t * (2 * t))) / 2;
          }
          else {
              return (Math.sqrt(1 - 2 * (1 - t) * (2 * (1 - t))) + 1) / 2;
          }
      },
  };
  const Bounce = {
      in: (t) => 1 - Math.abs(Math.cos(t * Math.PI) * (1 - t)),
      out: (t) => Math.abs(Math.cos(t * Math.PI) * t),
      inOut: (t) => {
          if (t < 0.5) {
              return (1 - Math.abs(Math.cos(t * Math.PI) * (1 - t))) / 2;
          }
          else {
              return (Math.abs(Math.cos(t * Math.PI) * t) + 1) / 2;
          }
      },
  };
  const Elastic = {
      in: (t) => -Math.exp(-t) * Math.cos(t * 2 * Math.PI),
      out: (t) => Math.exp(-t) * Math.cos(t * 2 * Math.PI),
      inOut: (t) => {
          if (t < 0.5) {
              return -0.5 * Math.exp(-2 * t) * Math.cos(t * 2 * Math.PI);
          }
          else {
              return 0.5 * Math.exp(-2 * (1 - t)) * Math.cos((1 - t) * 2 * Math.PI);
          }
      },
  };
  const Expo = {
      in: (t) => Math.pow(2, 10 * (t - 1)),
      out: (t) => 1 - Math.pow(2, -10 * t),
      inOut: (t) => {
          if (t < 0.5) {
              return 0.5 * Math.pow(2, 10 * (t - 1));
          }
          else {
              return 0.5 * (2 - Math.pow(2, -10 * (2 * t - 1)));
          }
      },
  };
  class Ease {
  }
  Ease.Quad = Quad;
  Ease.Linear = Linear;
  Ease.Cubic = Cubic;
  Ease.Quart = Quart;
  Ease.Quint = Quint;
  Ease.Strong = Strong;
  Ease.Sine = Sine;
  Ease.Back = Back;
  Ease.Circ = Circ;
  Ease.Bounce = Bounce;
  Ease.Elastic = Elastic;
  Ease.Expo = Expo;

  const SOCKET_HOST = "127.0.0.1";
  const SOCKET_PORT = 8080;
  class SocketManager {
      constructor() {
          this._socket = undefined;
          this._url = "";
      }
      connect(host, port) {
          if (this._socket) {
              console.error("Socket is already connected.");
              return;
          }
          if (host && port) {
              this._url = `ws://${host}:${port}`;
          }
          else {
              this._url = `ws://${SOCKET_HOST}:${SOCKET_PORT}`;
          }
          this._socket = new WebSocket(this._url);
          this._socket.binaryType = "arraybuffer";
          this._socket.onopen = this.onOpen;
          this._socket.onmessage = this.onMessage;
          this._socket.onerror = this.onError;
          this._socket.onclose = this.onClose;
      }
      onOpen(ev) {
          console.log("Socket connected.");
      }
      onMessage(ev) {
          console.log("Message received: ", ev.data);
      }
      onError(ev) {
          console.error("Socket error: ", ev);
      }
      onClose(ev) {
          console.log("Socket disconnected");
          if (this._socket) {
              this._socket.close();
          }
          this._socket = undefined;
          this._url = "";
      }
      send(data) {
          if (!this._socket || this._socket.readyState !== WebSocket.OPEN) {
              console.error("WebSocket is not connected.");
              return;
          }
          this._socket.send(data);
      }
      receive(event) {
      }
      decodeMsg() {
      }
      encodeMsg(data) {
      }
  }
  const socketMgr = new SocketManager();

  class ResourceManager {
      constructor() {
          this._cache = {};
          this._lastUsedTime = {};
          this._maxCacheSize = 50;
          this._loader = undefined;
          this._cleanupInterval = 10000;
          this._clearTime = 0;
      }
      init(loader) {
          this._loader = loader;
      }
      load(url, callback) {
          if (this._cache[url]) {
              this._lastUsedTime[url] = Date.now();
              callback(null, this._cache[url]);
              return;
          }
          if (!this._loader) {
              callback(new Error("ResourceManager 未初始化，缺少资源加载方法！"), null);
              return;
          }
          this._loader(url, (err, asset) => {
              if (err) {
                  callback(err, null);
                  return;
              }
              this._cache[url] = asset;
              this._lastUsedTime[url] = Date.now();
              callback(null, asset);
          });
      }
      preload(urls, onComplete) {
          let loadedCount = 0;
          for (let i = 0; i < urls.length; i++) {
              this.load(urls[i], () => {
                  loadedCount++;
                  if (loadedCount === urls.length && onComplete) {
                      onComplete();
                  }
              });
          }
      }
      release(url) {
          if (this._cache[url]) {
              delete this._cache[url];
              delete this._lastUsedTime[url];
          }
      }
      cleanup() {
          const cacheSize = Object.keys(this._cache).length;
          if (cacheSize <= this._maxCacheSize) {
              return;
          }
          const sortedKeys = Object.keys(this._lastUsedTime).sort((a, b) => this._lastUsedTime[a] - this._lastUsedTime[b]);
          const removeCount = Math.ceil(cacheSize * 0.2);
          for (let i = 0; i < removeCount; i++) {
              this.release(sortedKeys[i]);
          }
      }
      tick() {
          const curTime = Date.now();
          if (curTime - this._clearTime >= this._cleanupInterval) {
              this._clearTime = curTime;
              this.cleanup();
          }
      }
  }
  const resourceMgr = new ResourceManager();
  resourceMgr.init((url, callback) => {
      Laya.loader.load(url, Laya.Handler.create(null, (asset) => {
          callback(null, asset);
      }));
  });

  class Facade {
      constructor() {
          this._moduleMap = {};
          this._moduleList = [];
      }
      regModule(m) {
          this._moduleMap[m.name] = m;
      }
      retModule(type) {
          return this._moduleMap[type];
      }
      push(cls) {
          this._moduleList.push(cls);
      }
      instantiate() {
          const list = this._moduleList;
          for (const m of list) {
              const cls = new m();
              if (cls) {
                  cls.onReg();
                  this.regModule(cls);
              }
          }
      }
      getProxy(module, proxy) {
          const m = facade.retModule(module);
          if (!m) {
              console.error(`Facade.getProxy error，not module: ${module}`);
              return undefined;
          }
          const p = m.retProxy(proxy);
          if (!p) {
              console.error(`Facade.getProxy error，not proxy: ${proxy}`);
              return undefined;
          }
          return p;
      }
      openView(module, viewType, params) {
          const m = this.retModule(module);
          if (!m) {
              console.error(`facade.openView error, not module:${module}`);
              return;
          }
          const mdr = m.retMdr(viewType);
          if (!mdr) {
              console.error(`facade.openView error, not view:${viewType}`);
              return;
          }
          const mdrIns = new mdr();
          mdrIns.setModule(m);
          mdrIns.setViewType(viewType);
          mdrIns.setName(`${mdr.name} m:${module},v:${viewType}`);
          mdrIns.open(params);
      }
      closeView(module, viewType) {
          const m = this.retModule(module);
          if (!m) {
              console.error(`facade.closeView error, not module:${module}`);
              return;
          }
          const mdrIns = m.retMdrIns(viewType);
          if (mdrIns) {
              mdrIns.close();
          }
      }
  }
  const facade = new Facade();

  class BaseEmitter {
      constructor() {
          this._eventMap = new Map();
          this._layaMap = new Map();
      }
      emit(event, args) {
          eventMgr.emit(event, args);
      }
      mulOn(events, method, caller) {
          if (events === null || events === undefined ? undefined : events.length) {
              for (const k of events) {
                  this.on(k, method, caller);
              }
          }
      }
      on(event, method, caller, args) {
          if (this._eventMap.has(event)) {
              console.error(`BaseEmitter.on error! 重复添加事件：${event}`);
          }
          this._eventMap.set(event, [method, caller || this]);
          eventMgr.on(event, method, caller || this, args);
      }
      once(event, method, caller, args) {
          const wrapper = (...args) => {
              if (this._eventMap.has(event)) {
                  this._eventMap.delete(event);
              }
              method.apply(caller, args);
          };
          if (!this._eventMap.has(event)) {
              this._eventMap.set(event, [wrapper, caller || this]);
          }
          eventMgr.once(event, wrapper, caller || this, args);
      }
      off(event, method, caller) {
          if (this._eventMap.has(event)) {
              this._eventMap.delete(event);
          }
          eventMgr.off(event, method, caller || this);
      }
      onLaya(target, event, method, thisObject, args) {
          if (!target || !event || !method) {
              return;
          }
          if (this._layaMap.has(event)) {
              console.error(`BaseEmitter.onLaya error! 重复添加laya事件：${event}, ${target}`);
          }
          this._layaMap.set(event, [method, target, thisObject || this]);
          target.on(event, thisObject || this, method, args);
      }
      offLaya(target, event, listener, thisObject) {
          if (!target || !event || !listener) {
              return;
          }
          if (this._layaMap.has(event)) {
              this._layaMap.delete(event);
          }
          target.off(event, thisObject || this, listener);
      }
      offAll() {
          if (this._eventMap.size) {
              const entries = this._eventMap.entries();
              for (const [key, [method, thisObject]] of entries) {
                  eventMgr.off(key, method, thisObject);
              }
              this._eventMap.clear();
          }
          if (this._layaMap.size) {
              const entries = this._layaMap.entries();
              for (const [key, [method, target, thisObject]] of entries) {
                  target.off(key, thisObject, method);
              }
              this._layaMap.clear();
          }
      }
  }

  class BaseCommand extends BaseEmitter {
  }

  const MdrName = "__name__";
  const MdrKey = "_mediator_";
  function findMediator(comp) {
      if (!comp)
          return undefined;
      let mdr = comp[MdrKey];
      while (comp && !mdr) {
          comp = comp.parent;
          if (comp[MdrKey] && comp[MdrKey] instanceof BaseMediator) {
              mdr = comp[MdrKey];
          }
      }
      return mdr;
  }
  function buildNodeRecursive(node, parent) {
      var _a;
      if (!((_a = node === null || node === undefined ? undefined : node.name) === null || _a === undefined ? undefined : _a.startsWith("$"))) {
          return;
      }
      parent[node.name] = node;
      const children = node["_children"];
      for (const child of children) {
          buildNodeRecursive(child, node);
      }
  }
  class BaseMediator extends BaseEmitter {
      constructor(parent, url, isEasyClose) {
          super();
          this.ui = undefined;
          this.isOpened = false;
          this.isEasyClose = false;
          this.uiUrl = url;
          if (typeof parent === "number") {
              this.parent = layerMgr.getLayer(parent);
          }
          else {
              this.parent = parent;
          }
          this.isEasyClose = isEasyClose !== null && isEasyClose !== undefined ? isEasyClose : false;
      }
      setModule(module) {
          this._module = module;
          this._moduleName = module.name;
      }
      setViewType(view) {
          this._viewType = view;
      }
      getViewType() {
          return this._viewType;
      }
      setName(name) {
          Object.defineProperty(this, MdrName, {
              value: name,
              configurable: false,
              enumerable: false,
              writable: true,
          });
      }
      getName() {
          return this[MdrName];
      }
      open(params) {
          this.params = params;
          if (!this.ui && this.uiUrl) {
              Laya.Scene.load(this.uiUrl, Laya.Handler.create(this, (scene) => {
                  const children = scene["_children"];
                  for (const child of children) {
                      buildNodeRecursive(child, scene);
                  }
                  this.onUILoaded(scene);
              }));
          }
          else {
              this.initView(Laya.Handler.create(this, this.onUILoaded));
          }
      }
      close() {
          this.doClose();
      }
      doClose() {
          if (!this.isOpened) {
              return;
          }
          console.log(`关闭界面 m:${this._moduleName},v:${this._viewType}`);
          this.isOpened = false;
          this.offAll();
          this.onClose();
          this.destroyUI();
          this.removeMdr();
      }
      initView(handler) {
      }
      onUILoaded(view) {
          this.ui = view;
          if (!this.ui) {
              console.error(`BaseMediator.onUILoaded error: no ui!`);
          }
          this.ui.name = this[MdrName];
          Object.defineProperty(this.ui, MdrKey, {
              value: this,
              configurable: false,
              enumerable: false,
              writable: true,
          });
          this.parent.addChild(this.ui);
          this.initUI();
          this.addEvents();
          this.isOpened = true;
          console.log(`打开界面 m:${this._moduleName},v:${this._viewType}`);
          this._module.regMdrIns(this);
          this.onOpen();
      }
      destroyUI() {
          if (this.ui) {
              this.ui.removeSelf();
              this.ui.destroy(true);
              this.ui = undefined;
          }
          this.parent = undefined;
          this.uiUrl = undefined;
      }
      removeMdr() {
          this._module.removeMdrIns(this._viewType);
          this._viewType = undefined;
          this._moduleName = undefined;
          this._module = undefined;
      }
  }

  class BaseModule {
      constructor(module) {
          this._cmdMap = {};
          this._proxyInsMap = {};
          this._mdrMap = {};
          this._mdrInsMap = {};
          this.name = module;
      }
      onReg() {
          this.initCmd();
          this.initProxy();
          this.initMdr();
      }
      regCmd(event, cls) {
          eventMgr.on(event, this.exeCmd, this);
          this._cmdMap[event] = cls;
      }
      exeCmd(data) {
          var _a, _b;
          const cls = this._cmdMap[(_a = data === null || data === undefined ? undefined : data.type) !== null && _a !== undefined ? _a : ""];
          if (cls) {
              const cmd = new cls();
              cmd.exec((_b = data === null || data === undefined ? undefined : data.data) !== null && _b !== undefined ? _b : "");
          }
      }
      regProxy(type, proxy) {
          if (this._proxyInsMap[type]) {
              return;
          }
          const cls = new proxy();
          cls.init();
          this._proxyInsMap[type] = cls;
      }
      retProxy(type) {
          return this._proxyInsMap[type];
      }
      regMdr(viewType, mdr) {
          if (this._mdrMap[viewType]) {
              return;
          }
          this._mdrMap[viewType] = mdr;
      }
      retMdr(viewType) {
          return this._mdrMap[viewType];
      }
      regMdrIns(mdr) {
          if (this._mdrInsMap[mdr.getViewType()]) {
              return;
          }
          this._mdrInsMap[mdr.getViewType()] = mdr;
      }
      retMdrIns(viewType) {
          return this._mdrInsMap[viewType];
      }
      removeMdrIns(viewType) {
          const mdrIns = this.retMdrIns(viewType);
          if (mdrIns) {
              mdrIns.close();
              this._mdrInsMap[viewType] = undefined;
              delete this._mdrInsMap[viewType];
          }
      }
  }

  class BaseProxy extends BaseEmitter {
  }

  function baseLoop() {
      _loopTween();
      timerMgr.tick();
  }
  function baseInit() {
      initLayer();
  }

  exports.BaseCommand = BaseCommand;
  exports.BaseMediator = BaseMediator;
  exports.BaseModule = BaseModule;
  exports.BaseProxy = BaseProxy;
  exports.CallBack = CallBack;
  exports.Ease = Ease;
  exports.EventData = EventData;
  exports.LayerIndex = LayerIndex;
  exports.baseInit = baseInit;
  exports.baseLoop = baseLoop;
  exports.eventMgr = eventMgr;
  exports.facade = facade;
  exports.findMediator = findMediator;
  exports.layerMgr = layerMgr;
  exports.poolMgr = poolMgr;
  exports.resourceMgr = resourceMgr;
  exports.socketMgr = socketMgr;
  exports.timerMgr = timerMgr;
  exports.tweenMgr = tweenMgr;

}));

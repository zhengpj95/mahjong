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

  class Singleton {
      static ins() {
          if (!this._instance) {
              this._instance = new this();
              if (this.name && typeof window !== "undefined") {
                  window[this.name] = this._instance;
              }
          }
          return this._instance;
      }
  }

  function createObj() {
      return Object.create(null);
  }

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
  class PoolManager extends Singleton {
      constructor() {
          super(...arguments);
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

  class TimerManager extends Singleton {
      constructor() {
          super();
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
              this._timeList.splice(idx, 1);
          }
          idx = this._frameList.indexOf(vo);
          if (idx > -1) {
              this._frameList.splice(idx, 1);
          }
          poolMgr.free(vo);
      }
      tick() {
          var _a, _b, _c, _d, _e, _f, _g;
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
                      if (!vo.isRepeat && vo.repeatCount > 0) {
                          vo.repeatCount--;
                      }
                      if ((!vo.isRepeat && vo.repeatCount <= 0) || !((_c = vo.callBack) === null || _c === undefined ? undefined : _c.method)) {
                          (_d = vo.finishCallBack) === null || _d === undefined ? undefined : _d.exec(this._curFrame - vo.lastExeTime);
                          if (!this._deleteList.includes(vo)) {
                              this._deleteList.push(vo);
                          }
                      }
                  }
              }
          }
          if ((_e = this._timeList) === null || _e === undefined ? undefined : _e.length) {
              for (const vo of this._timeList) {
                  if (this._deleteList.includes(vo)) {
                      continue;
                  }
                  if (vo.exeTime <= this._curTime) {
                      vo.callBack.exec(this._curTime - vo.lastExeTime);
                      vo.lastExeTime = this._curTime;
                      vo.exeTime = this._curTime + vo.interval;
                      if (!vo.isRepeat && vo.repeatCount > 0) {
                          vo.repeatCount--;
                      }
                      if ((!vo.isRepeat && vo.repeatCount <= 0) || !((_f = vo.callBack) === null || _f === undefined ? undefined : _f.method)) {
                          (_g = vo.finishCallBack) === null || _g === undefined ? undefined : _g.exec(this._curFrame - vo.lastExeTime);
                          if (!this._deleteList.includes(vo)) {
                              this._deleteList.push(vo);
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
  const timerMgr = TimerManager.ins();

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
  class TweenManagerImpl extends Singleton {
      constructor() {
          super(...arguments);
          this._tweenList = [];
          this._tmpTweenList = [];
      }
      reg(tw) {
          tw[TWEEN_ID_FLAG] = ++TWEEN_ID;
          this._tmpTweenList.push(tw);
          return tw;
      }
      get(target, vars) {
          return this.reg(new TweenImpl().init(target, vars));
      }
      remove(target) {
          if (this._tmpTweenList.length) {
              this._tweenList.push(...this._tmpTweenList);
              this._tmpTweenList.length = 0;
          }
          for (const tw of this._tweenList) {
              if (tw.checkTarget(target)) {
                  tw.dispose();
              }
          }
      }
      update() {
          const currentTime = Date.now();
          if (this._tmpTweenList.length) {
              this._tweenList.push(...this._tmpTweenList);
              this._tmpTweenList.length = 0;
          }
          const delList = [];
          const list = this._tweenList;
          for (const tw of list) {
              if (tw.update(currentTime)) {
                  delList.push(tw);
              }
          }
          if (delList === null || delList === undefined ? undefined : delList.length) {
              for (const tw of delList) {
                  if (tw) {
                      tw.dispose();
                      const idx = this._tweenList.indexOf(tw);
                      if (idx > -1) {
                          this._tweenList.splice(idx, 1);
                      }
                  }
              }
              delList.length = 0;
          }
      }
  }
  const tweenMgr = TweenManagerImpl.ins();
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
  class LayerManager extends Singleton {
      constructor() {
          super();
          this._layers = createObj();
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
  const layerMgr = LayerManager.ins();
  function initLayer() {
      layerMgr.initLayer();
  }

  class EventVo {
      constructor() {
          this._type = "";
          this._data = undefined;
      }
      static alloc(type, data) {
          const eData = poolMgr.alloc(EventVo);
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

  class EventManager extends Singleton {
      constructor() {
          super(...arguments);
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
              const nt = EventVo.alloc(event, data);
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
  const eventMgr = EventManager.ins();

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
  class SocketManager extends Singleton {
      constructor() {
          super(...arguments);
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
  const socketMgr = SocketManager.ins();

  class ResourceManager extends Singleton {
      constructor() {
          super(...arguments);
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
          for (const item of urls) {
              this.load(item, () => {
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
  const resourceMgr = ResourceManager.ins();
  resourceMgr.init((url, callback) => {
      Laya.loader.load(url).then((r) => {
          callback(null, r);
      });
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
  function buildNodeRecursive(node, parent, rstObj) {
      var _a;
      if (!((_a = rstObj === null || rstObj === undefined ? undefined : rstObj.child) === null || _a === undefined ? undefined : _a[node.name])) {
          return;
      }
      parent[node.name] = node;
      const children = node["_children"];
      for (const child of children) {
          buildNodeRecursive(child, node, rstObj.child[node.name]);
      }
  }
  function buildItemRenderRecursive(itemRender, rstObj) {
      if (!(itemRender === null || itemRender === undefined ? undefined : itemRender.length) || !rstObj)
          return;
      rstObj.child = {};
      for (const item of itemRender) {
          if (item.name.startsWith("$") || item._$var) {
              rstObj.child[item.name] = {};
              rstObj.child[item.name].child = {};
              if (item._$child) {
                  buildItemRenderRecursive(item._$child, rstObj.child[item.name]);
              }
          }
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
              Laya.loader
                  .load(this.uiUrl, Laya.Loader.HIERARCHY)
                  .then((r) => {
                  var _a;
                  const rstObj = {};
                  if ((_a = r.data) === null || _a === undefined ? undefined : _a._$child) {
                      buildItemRenderRecursive(r.data._$child, rstObj);
                  }
                  const s = r.create();
                  const children = s["_children"];
                  for (const child of children) {
                      buildNodeRecursive(child, s, rstObj);
                  }
                  this.onUILoaded(s);
              });
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
          var _a;
          const cls = this._cmdMap[(_a = data === null || data === undefined ? undefined : data.type) !== null && _a !== undefined ? _a : ""];
          if (cls) {
              const cmd = new cls();
              cmd.exec(data);
          }
      }
      regProxy(type, proxy) {
          if (this._proxyInsMap[type]) {
              return;
          }
          const cls = new proxy();
          cls.init();
          cls.initRed();
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
      initRed() {
          const events = this.updateRedEvent();
          if (events === null || events === undefined ? undefined : events.length) {
              this.mulOn(events, this.updateRed, this);
          }
      }
  }

  class RedPointManager extends Singleton {
      constructor() {
          super(...arguments);
          this._redPointMap = createObj();
          this._sep = ".";
      }
      setRp(value, paths) {
          if (!paths || !paths.length) {
              console.error(`RedPointMgr.setRp: 设置红点时至少需要一个参数`);
              return;
          }
          const keys = [];
          for (const param of paths) {
              keys.push(this.getObjectName(param));
          }
          this.write(value, this._redPointMap, 0, keys);
      }
      getRp(paths) {
          if (!paths || !paths.length) {
              console.error(`RedPointMgr.getRp: 获取红点时至少需要一个参数`);
              return false;
          }
          const keys = [];
          for (const param of paths) {
              keys.push(this.getObjectName(param));
          }
          return this.read(this._redPointMap, 0, keys);
      }
      write(value, obj, index, keyList) {
          const key = keyList[index];
          if (index < keyList.length - 1) {
              if (obj[key] === null || obj[key] === undefined) {
                  obj[key] = createObj();
              }
              else if (typeof obj[key] !== "object") {
                  console.error(`[${keyList.slice(0, index + 1)}] 本层已设置为值，无法再设置下一层 ${keyList}`);
                  return;
              }
              this.write(value, obj[key], index + 1, keyList);
          }
          else {
              if (typeof obj[key] !== "object") {
                  const oldValue = this.getObjectValue(obj[key]);
                  obj[key] = value;
                  if (oldValue !== value) {
                      timerMgr.setTimeOut(100, CallBack.alloc(null, () => {
                          eventMgr.emit("common_update_red_point", keyList.join(this._sep));
                      }));
                  }
              }
              else {
                  console.error(`[${keyList}] 下层有值，不可设置`);
                  return;
              }
          }
      }
      read(obj, index, keyList) {
          const key = keyList[index];
          if (index < keyList.length) {
              if (index < keyList.length - 1 && obj[key]) {
                  return this.read(obj[key], index + 1, keyList);
              }
              else {
                  if (obj) {
                      return this.getObjectValue(obj[key]);
                  }
                  else {
                      return false;
                  }
              }
          }
          return false;
      }
      getObjectValue(obj) {
          if (typeof obj === "boolean") {
              return obj;
          }
          else if (typeof obj === "object") {
              let result = false;
              for (const key in obj) {
                  result = this.getObjectValue(obj[key]);
                  if (result) {
                      break;
                  }
              }
              return result;
          }
          return false;
      }
      getObjectName(obj) {
          let result = "";
          if (typeof obj === "number") {
              result = obj + "";
          }
          else if (typeof obj === "string") {
              result = obj;
          }
          else if (typeof obj === "function") {
              result = obj.name;
          }
          else if (typeof obj === "object") {
              const prototype = obj.prototype
                  ? obj.prototype
                  : Object.getPrototypeOf(obj);
              if (prototype && prototype.name) {
                  result = prototype.name;
              }
              else {
                  const constructorStr = prototype.constructor.toString().trim();
                  const idx = constructorStr.indexOf("(");
                  result = constructorStr.substring(9, idx);
              }
          }
          else {
              console.log(`需要获取的对象类型错误 ${obj}`);
          }
          return result;
      }
      getPath(paths) {
          const rst = [];
          if (paths && paths.length) {
              for (const param of paths) {
                  rst.push(this.getObjectName(param));
              }
          }
          return rst.join(this._sep);
      }
      checkPath(rootStr, paths) {
          if (!rootStr) {
              return false;
          }
          const path = this.getPath(paths);
          return rootStr.indexOf(path) > -1;
      }
  }
  const redPointMgr = RedPointManager.ins();
  const __RedPointPath__ = "__redPointPath__";
  function registerRed(view, paths, cb) {
      if (!(view === null || view === undefined ? undefined : view.displayedInStage)) {
          unregisterRed(view);
          return;
      }
      const redPoint = getRedPointImg(view);
      if (redPoint) {
          redPoint.visible = redPointMgr.getRp(paths);
      }
      view[__RedPointPath__] = paths;
      const mdr = findMediator(view);
      if (mdr) {
          mdr.off("common_update_red_point", onListenRedPoint, mdr);
          mdr.on("common_update_red_point", onListenRedPoint, mdr, [
              view,
              cb,
          ]);
      }
  }
  function unregisterRed(view) {
      if (!view)
          return;
      const mdr = findMediator(view);
      mdr === null || mdr === undefined ? undefined : mdr.off("common_update_red_point", onListenRedPoint, mdr);
  }
  function onListenRedPoint(view, cb, ev) {
      var _a;
      const paths = view[__RedPointPath__];
      const root = (_a = ev === null || ev === undefined ? undefined : ev.data) !== null && _a !== undefined ? _a : "";
      if (redPointMgr.checkPath(root, paths)) {
          const redPoint = getRedPointImg(view);
          const isRed = redPointMgr.getRp(paths);
          if (redPoint) {
              redPoint.visible = isRed;
          }
          cb === null || cb === undefined ? undefined : cb.exec(isRed);
      }
  }
  function getRedPointImg(view) {
      const RedPoint = "_RedPoint_";
      let imgRed = ((view.getChildByName("redPoint") ||
          view.getChildByName("$redPoint") ||
          view[RedPoint]));
      if (!imgRed) {
          imgRed = new Laya.Image();
          imgRed.top = -2;
          imgRed.right = -2;
          imgRed.skin = `atlas/common/img_common_redpoint1.png`;
          view[RedPoint] = imgRed;
          view.addChild(imgRed);
      }
      return imgRed;
  }

  const LoadPriority = {
      FIRST: 0,
      UI: 1,
      UI_SCENE: 2,
      SCENE: 3,
      DEFAULT: 4,
  };
  function resetDisplay(dis) {
      if (!dis || dis.destroyed) {
          return;
      }
      dis._bits = 0;
      dis.x = dis.y = 0;
      dis.scaleX = dis.scaleY = dis.alpha = 1;
      dis.rotation = 0;
      dis.width = dis.height = NaN;
      dis.pivot(0, 0);
      dis.visible = true;
      dis.filters = null;
  }
  class BitmapBase extends Laya.Sprite {
      constructor() {
          super();
          this._oldStr = "";
          this.keepOnRem = false;
          this.center = false;
          this.loadPri = LoadPriority.UI;
      }
      _onAdded() {
          super._onAdded();
          if (this.keepOnRem) {
              return;
          }
          if (this._oldStr) {
              if (!this._source) {
                  this.source = this._oldStr;
              }
              this._oldStr = "";
          }
      }
      _onRemoved() {
          super._onRemoved();
          if (this.keepOnRem) {
              return;
          }
          if (typeof this._source === "string") {
              this._oldStr = this._source;
              this.source = undefined;
          }
      }
      set source(value) {
          if (!value) {
              value = undefined;
          }
          if (value === this._source) {
              if (this.texture) {
                  this.resize();
                  this.event(Laya.Event.COMPLETE);
                  this.onLoaded();
              }
              return;
          }
          if (typeof value === "string") {
              this.removeCur();
              this._source = value;
              Laya.loader
                  .load(value, Laya.Handler.create(this, this.onComplete, [value]), undefined, undefined, this.loadPri)
                  .then((r) => {
                  console.log("BitmapBase source: ", r);
              });
              return;
          }
          this.removeCur();
          this._source = value;
          this.texture = value;
          this.resize();
      }
      get source() {
          return this._source;
      }
      setAnchor(x = 0, y = 0) {
          const pivotX = x === 0 ? 0 : this.width * x;
          const pivotY = y === 0 ? 0 : this.height * y;
          this.pivot(pivotX, pivotY);
      }
      removeCur() {
          this.texture = null;
          this._source = undefined;
      }
      resize() {
          const text = this.texture;
          if (text) {
              this.width = text.sourceWidth || text.width;
              this.height = text.sourceHeight || text.height;
          }
          if (this.center) {
              this.pivot(this.width / 2, this.height / 2);
          }
      }
      onComplete(url) {
          if (this._source !== url)
              return;
          this.texture = Laya.loader.getRes(url);
          this.resize();
          this.event(Laya.Event.COMPLETE);
          this.onLoaded();
      }
      onLoaded() {
      }
      onAlloc() {
          this.loadPri = LoadPriority.UI;
      }
      onFree() {
          this.center = false;
          this.removeSelf();
          resetDisplay(this);
          this.removeCur();
          this._oldStr = "";
      }
      free() {
          poolMgr.free(this);
      }
  }

  class MergedBitmap {
      constructor() {
          this._url = "";
      }
      get frames() {
          return this._frames;
      }
      get texture() {
          return this._texture;
      }
      get loadComplete() {
          return !!this.frames && !!this.texture;
      }
      static onLoad(url, callback) {
          const bitmap = poolMgr.alloc(MergedBitmap);
          bitmap._url = url;
          bitmap._callback = callback;
          Laya.loader
              .load([
              {
                  url: url + ".png",
                  type: Laya.Loader.IMAGE,
                  priority: 1,
              },
              {
                  url: url + ".json",
                  type: Laya.Loader.JSON,
                  priority: 1,
              },
          ], Laya.Handler.create(this, this.onLoadComplete, [bitmap]))
              .then((r) => {
          });
      }
      static onLoadComplete(bitmap) {
          const texture = Laya.loader.getRes(bitmap._url + ".png");
          const json = (Laya.loader.getRes(bitmap._url + ".json"));
          if (!texture || !json) {
              throw new Error("MergedBitmap onLoadComplete error " + bitmap._url);
          }
          bitmap._texture = texture;
          bitmap._atlas = json.data;
          bitmap._frames = json.data.frames;
          if (bitmap._callback) {
              bitmap._callback.exec(bitmap);
          }
      }
      onLoad(url, callback) {
          this._url = url;
          this._callback = callback;
          Laya.loader
              .load([
              {
                  url: url + ".png",
                  type: Laya.Loader.IMAGE,
                  priority: 1,
              },
              {
                  url: url + ".json",
                  type: Laya.Loader.JSON,
                  priority: 1,
              },
          ])
              .then((r) => {
              this.onLoadPng(r[0]);
              this.onLoadJson(r[1].data);
          });
      }
      onLoadPng(data) {
          this._texture = data;
          this.onLoadComplete();
      }
      onLoadJson(data) {
          this._atlas = data;
          this._frames = data ? data.frames : undefined;
          this.onLoadComplete();
      }
      onLoadComplete() {
          if (this._callback && this.loadComplete) {
              this._callback.exec(this);
          }
      }
      getTextureList() {
          var _a;
          if (!this.loadComplete)
              return [];
          if (this._textureList)
              return this._textureList;
          this._textureList = [];
          for (const f of (_a = this._frames) !== null && _a !== undefined ? _a : []) {
              const txt = Laya.Texture.create(this._texture, f.frame.x, f.frame.y, f.frame.w, f.frame.h, f.spriteSourceSize.x, f.spriteSourceSize.y, f.sourceSize.w, f.sourceSize.h);
              this._textureList.push(txt);
          }
          return this._textureList;
      }
      onAlloc() {
          this.onRelease();
      }
      onRelease() {
          this._url = undefined;
          this._atlas = undefined;
          this._frames = undefined;
          if (this._callback) {
              this._callback.free();
          }
          this._callback = undefined;
          this._texture = undefined;
          this._textureList = undefined;
      }
  }

  const INIT_FPS$1 = 16;
  class BmpMovieClip extends BitmapBase {
      constructor() {
          super();
          this._total = 0;
          this._current = 0;
          this._playCnt = 1;
          this._interval = 1000 / INIT_FPS$1;
          this._remove = false;
          this._removeParent = false;
          this.center = true;
      }
      play(url, container, cnt = 1, callBack, remove, removeParent) {
          this._container = container;
          this._playCnt = cnt;
          this._callBack = callBack;
          this._remove = remove !== null && remove !== undefined ? remove : false;
          this._removeParent = removeParent !== null && removeParent !== undefined ? removeParent : false;
          MergedBitmap.onLoad(url, CallBack.alloc(this, this.onLoadedMergedBitmap));
      }
      onLoadedMergedBitmap(bitmap) {
          var _a, _b;
          if (!bitmap) {
              throw new Error(`BmpMovieClip load alta fail`);
          }
          this._mergedBitmap = bitmap;
          this._total = bitmap.getTextureList().length;
          this._current = 0;
          if (!((_a = this._container) === null || _a === undefined ? undefined : _a.contains(this))) {
              (_b = this._container) === null || _b === undefined ? undefined : _b.addChild(this);
          }
          Laya.timer.loop(this._interval, this, this.onUpdate);
      }
      onUpdate() {
          this._current++;
          if (this._current <= this._total) {
              this.source = this._mergedBitmap.getTextureList()[this._current - 1];
              return;
          }
          if (this._playCnt < 0) {
              this._current = 0;
              this.source = this._mergedBitmap.getTextureList()[this._current];
              return;
          }
          this._playCnt--;
          if (this._playCnt) {
              this._current = 0;
              this.source = this._mergedBitmap.getTextureList()[this._current];
          }
          else {
              Laya.timer.clearAll(this);
              this.playEnd();
          }
      }
      playEnd() {
          if (this._callBack) {
              this._callBack.exec();
          }
          if (this._remove) {
              this.removeSelf();
          }
          if (this._removeParent && this._container) {
              this._container.removeSelf();
          }
      }
      onAlloc() {
          super.onAlloc();
          this.onFree();
          this._interval = 1000 / INIT_FPS$1;
          this.center = true;
      }
      onFree() {
          super.onFree();
          if (this._mergedBitmap) {
              poolMgr.free(this._mergedBitmap);
          }
          this._mergedBitmap = undefined;
          if (this._callBack) {
              this._callBack.free();
          }
          this._callBack = undefined;
          this._total = 0;
          this._current = 0;
          this._playCnt = 0;
          this._remove = false;
      }
  }

  const INIT_FPS = 10;
  class RpgMovieClip extends BitmapBase {
      constructor() {
          super();
          this._total = 0;
          this._current = 0;
          this._playCnt = 1;
          this._interval = 1000 / INIT_FPS;
          this._remove = false;
          this._textureMap = {};
          this._currentAction = "";
          this._nextAction = "";
          this.center = true;
      }
      setAction(action) {
          if (this._currentAction !== action) {
              this._nextAction = action;
          }
      }
      setCnt(cnt) {
          this._playCnt = cnt;
      }
      play(url, container, cnt = 1, loadCallBack, finishCallback, remove) {
          this._container = container;
          this._playCnt = cnt;
          this._loadCallBack = loadCallBack;
          this._finishCallBack = finishCallback;
          this._remove = remove !== null && remove !== undefined ? remove : false;
          MergedBitmap.onLoad(url, CallBack.alloc(this, this.onLoadedMergedBitmap));
      }
      onLoadedMergedBitmap(bitmap) {
          var _a, _b;
          if (!bitmap || !bitmap.loadComplete) {
              throw new Error(`BmpMovieClip load alta fail`);
          }
          this._mergedBitmap = bitmap;
          const frames = bitmap.frames || [];
          const texture = bitmap.texture;
          for (const f of frames) {
              const name = f.filename.split("/")[0];
              if (!this._textureMap[name]) {
                  this._textureMap[name] = [];
              }
              const txt = Laya.Texture.create(texture, f.frame.x, f.frame.y, f.frame.w, f.frame.h, f.spriteSourceSize.x, f.spriteSourceSize.y, f.sourceSize.w, f.sourceSize.h);
              this._textureMap[name].push(txt);
          }
          if (!((_a = this._container) === null || _a === undefined ? undefined : _a.contains(this))) {
              (_b = this._container) === null || _b === undefined ? undefined : _b.addChild(this);
          }
          Laya.timer.loop(this._interval, this, this.onUpdate);
          if (this._loadCallBack) {
              this._loadCallBack.exec();
          }
      }
      getTextureList(action) {
          return this._textureMap[action || this._currentAction] || [];
      }
      onUpdate() {
          if (this._currentAction !== this._nextAction) {
              this._total = this.getTextureList(this._nextAction).length;
              this._current = 0;
              this._currentAction = this._nextAction;
          }
          this._current++;
          if (this._current <= this._total) {
              this.source = this.getTextureList()[this._current - 1];
              return;
          }
          if (this._playCnt < 0) {
              this._current = 0;
              this.source = this.getTextureList()[this._current];
              return;
          }
          this._playCnt--;
          if (this._playCnt) {
              this._current = 0;
              this.source = this.getTextureList()[this._current];
          }
          else {
              Laya.timer.clearAll(this);
              this.playEnd();
          }
      }
      playEnd() {
          if (this._finishCallBack) {
              this._finishCallBack.exec();
          }
          if (this._remove) {
              this.removeSelf();
          }
      }
      onAlloc() {
          super.onAlloc();
          this.onFree();
          this._interval = 1000 / INIT_FPS;
          this.center = true;
      }
      onFree() {
          super.onFree();
          if (this._mergedBitmap) {
              poolMgr.free(this._mergedBitmap);
          }
          this._mergedBitmap = undefined;
          if (this._loadCallBack) {
              this._loadCallBack.free();
          }
          this._loadCallBack = undefined;
          if (this._finishCallBack) {
              this._finishCallBack.free();
          }
          this._finishCallBack = undefined;
          this._total = 0;
          this._current = 0;
          this._playCnt = 0;
          this._remove = false;
          this._textureMap = {};
          this._currentAction = "";
          this._nextAction = "";
      }
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
  exports.BitmapBase = BitmapBase;
  exports.BmpMovieClip = BmpMovieClip;
  exports.CallBack = CallBack;
  exports.Ease = Ease;
  exports.EventVo = EventVo;
  exports.LayerIndex = LayerIndex;
  exports.LoadPriority = LoadPriority;
  exports.MergedBitmap = MergedBitmap;
  exports.RpgMovieClip = RpgMovieClip;
  exports.Singleton = Singleton;
  exports.baseInit = baseInit;
  exports.baseLoop = baseLoop;
  exports.createObj = createObj;
  exports.eventMgr = eventMgr;
  exports.facade = facade;
  exports.findMediator = findMediator;
  exports.layerMgr = layerMgr;
  exports.poolMgr = poolMgr;
  exports.redPointMgr = redPointMgr;
  exports.registerRed = registerRed;
  exports.resetDisplay = resetDisplay;
  exports.resourceMgr = resourceMgr;
  exports.socketMgr = socketMgr;
  exports.timerMgr = timerMgr;
  exports.tweenMgr = tweenMgr;
  exports.unregisterRed = unregisterRed;

}));

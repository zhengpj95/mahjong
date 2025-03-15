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
  var EaseNone = function (p) { return p; };

  var Linear = {
      in: EaseNone,
      out: EaseNone,
      inOut: EaseNone,
  };
  var Quad = {
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
  var Cubic = {
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
  var Quart = {
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
  var Quint = {
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
  var Strong = {
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
  var Sine = {
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
  var BackNum = 1.70158;
  var Back = {
      in: function (t) { return t * t * ((BackNum + 1) * t - BackNum); },
      out: function (t) {
          t -= 1;
          return t * t * ((BackNum + 1) * t + BackNum) + 1;
      },
      inOut: function (t) {
          var s = 1.70158 * 1.525;
          if (t < 0.5) {
              return (t * 2 * t * ((s + 1) * t * 2 - s)) / 2;
          }
          else {
              t = t * 2 - 2;
              return (t * t * ((s + 1) * t + s) + 2) / 2;
          }
      },
  };
  var Circ = {
      in: function (t) { return 1 - Math.sqrt(1 - t * t); },
      out: function (t) { return Math.sqrt(1 - (t - 1) * (t - 1)); },
      inOut: function (t) {
          if (t < 0.5) {
              return (1 - Math.sqrt(1 - 2 * t * (2 * t))) / 2;
          }
          else {
              return (Math.sqrt(1 - 2 * (1 - t) * (2 * (1 - t))) + 1) / 2;
          }
      },
  };
  var Bounce = {
      in: function (t) { return 1 - Math.abs(Math.cos(t * Math.PI) * (1 - t)); },
      out: function (t) { return Math.abs(Math.cos(t * Math.PI) * t); },
      inOut: function (t) {
          if (t < 0.5) {
              return (1 - Math.abs(Math.cos(t * Math.PI) * (1 - t))) / 2;
          }
          else {
              return (Math.abs(Math.cos(t * Math.PI) * t) + 1) / 2;
          }
      },
  };
  var Elastic = {
      in: function (t) { return -Math.exp(-t) * Math.cos(t * 2 * Math.PI); },
      out: function (t) { return Math.exp(-t) * Math.cos(t * 2 * Math.PI); },
      inOut: function (t) {
          if (t < 0.5) {
              return -0.5 * Math.exp(-2 * t) * Math.cos(t * 2 * Math.PI);
          }
          else {
              return 0.5 * Math.exp(-2 * (1 - t)) * Math.cos((1 - t) * 2 * Math.PI);
          }
      },
  };
  var Expo = {
      in: function (t) { return Math.pow(2, 10 * (t - 1)); },
      out: function (t) { return 1 - Math.pow(2, -10 * t); },
      inOut: function (t) {
          if (t < 0.5) {
              return 0.5 * Math.pow(2, 10 * (t - 1));
          }
          else {
              return 0.5 * (2 - Math.pow(2, -10 * (2 * t - 1)));
          }
      },
  };
  var Ease = (function () {
      function Ease() {
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
      return Ease;
  }());

  var TweenImpl = (function () {
      function TweenImpl() {
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
      TweenImpl.prototype.init = function (target, vars) {
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
      };
      TweenImpl.prototype.to = function (properties, duration, ease, onComplete) {
          if (ease === undefined) { ease = EaseNone; }
          this.properties = properties;
          this.duration = duration;
          this.ease = ease || EaseNone;
          this.onComplete = onComplete;
          this.start();
      };
      TweenImpl.prototype.from = function (properties, duration, ease, onComplete) {
          if (ease === undefined) { ease = EaseNone; }
          this.properties = properties;
          this.duration = duration;
          this.ease = ease || EaseNone;
          this.onComplete = onComplete;
          this.start(true);
      };
      TweenImpl.prototype.start = function (isFrom) {
          if (isFrom === undefined) { isFrom = false; }
          this.startTime = Date.now();
          if (isFrom) {
              for (var prop in this.properties) {
                  this.startProperties[prop] = this.properties[prop];
                  this.properties[prop] = this.target[prop];
              }
          }
          else {
              for (var prop in this.properties) {
                  this.startProperties[prop] = this.target[prop];
              }
          }
      };
      TweenImpl.prototype.update = function (currentTime) {
          if (!this.target)
              return true;
          if (this.startTime === null)
              return false;
          var elapsed = currentTime - this.startTime;
          var t = (elapsed * this.timeScale) / this.duration;
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
                  for (var prop in this.properties) {
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
              for (var prop in this.properties) {
                  var startValue = this.startProperties[prop];
                  var endValue = this.properties[prop];
                  this.target[prop] = startValue + (endValue - startValue) * t;
              }
              return false;
          }
      };
      TweenImpl.prototype.checkTarget = function (target) {
          return this.target && this.target === target;
      };
      TweenImpl.prototype.dispose = function () {
          if (this.onComplete) {
              this.onComplete.free();
              this.onComplete = undefined;
          }
          this.target = undefined;
          this.properties = {};
          this.startTime = null;
      };
      return TweenImpl;
  }());

  var TWEEN_ID = 0;
  var TWEEN_ID_FLAG = "$TWEEN_ID";
  var TweenManagerImpl = (function () {
      function TweenManagerImpl() {
          this._tweens = [];
          this._tmpTweens = [];
      }
      TweenManagerImpl.prototype.reg = function (tw) {
          tw[TWEEN_ID_FLAG] = ++TWEEN_ID;
          this._tmpTweens.push(tw);
          return tw;
      };
      TweenManagerImpl.prototype.get = function (target, vars) {
          return this.reg(new TweenImpl().init(target, vars));
      };
      TweenManagerImpl.prototype.remove = function (target) {
          var _a;
          if (this._tmpTweens.length) {
              (_a = this._tweens).push.apply(_a, this._tmpTweens);
              this._tmpTweens.length = 0;
          }
          for (var _i = 0, _b = this._tweens; _i < _b.length; _i++) {
              var tw = _b[_i];
              if (tw.checkTarget(target)) {
                  tw.dispose();
              }
          }
      };
      TweenManagerImpl.prototype.update = function () {
          var _a;
          var currentTime = Date.now();
          if (this._tmpTweens.length) {
              (_a = this._tweens).push.apply(_a, this._tmpTweens);
              this._tmpTweens.length = 0;
          }
          var delList = [];
          var list = this._tweens;
          for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
              var tw = list_1[_i];
              if (tw.update(currentTime)) {
                  delList.push(tw);
              }
          }
          if (delList === null || delList === undefined ? undefined : delList.length) {
              for (var _b = 0, delList_1 = delList; _b < delList_1.length; _b++) {
                  var tw = delList_1[_b];
                  if (tw) {
                      tw.dispose();
                      var idx = this._tweens.indexOf(tw);
                      if (idx > -1) {
                          this._tweens.splice(idx, 1);
                      }
                  }
              }
              delList.length = 0;
          }
      };
      return TweenManagerImpl;
  }());
  var tweenMgr = new TweenManagerImpl();
  function _loopTween() {
      tweenMgr.update();
  }

  var CallBack = (function () {
      function CallBack() {
          this._id = 0;
          this._caller = undefined;
          this._method = undefined;
          this._args = [];
          this._once = false;
      }
      Object.defineProperty(CallBack.prototype, "method", {
          get: function () {
              return this._method;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(CallBack.prototype, "caller", {
          get: function () {
              return this._caller;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(CallBack.prototype, "once", {
          get: function () {
              return this._once;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(CallBack.prototype, "id", {
          get: function () {
              return this._id;
          },
          enumerable: false,
          configurable: true
      });
      CallBack.alloc = function (context, func, args, once) {
          if (typeof func !== "function") {
              throw new Error("CallBack func must be Function!");
          }
          if (typeof args === "boolean") {
              once = args;
              args = undefined;
          }
          var instance = this._pool.length > 0
              ? this._pool.pop()
              : new CallBack();
          instance._id = ++CallBack._gid;
          instance._caller = context || undefined;
          instance._method = func;
          instance._args = args;
          instance._once = !!once;
          return instance;
      };
      CallBack.prototype.exec = function () {
          var data = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              data[_i] = arguments[_i];
          }
          if (!this._method) {
              return undefined;
          }
          var id = this._id;
          var args;
          if (!data.length) {
              args = this._args;
          }
          else if (this._args) {
              args = this._args.concat(data);
          }
          else {
              args = data;
          }
          var result = this._method.apply(this._caller, args);
          this._id === id && this._once && this.free();
          return result;
      };
      CallBack.prototype.free = function () {
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
      };
      CallBack.prototype.isEqual = function (caller, method) {
          if (!method) {
              return false;
          }
          return this._caller === caller && this._method === method;
      };
      CallBack._pool = [];
      CallBack._gid = 1;
      return CallBack;
  }());

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


  function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  }

  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

  function getQualifiedClassName(value) {
      var type = typeof value;
      if (!value || (type !== "object" && !value.prototype)) {
          return type + "";
      }
      var prototype = value.prototype
          ? value.prototype
          : Object.getPrototypeOf(value);
      if (prototype.hasOwnProperty("__class__") && prototype["__class__"]) {
          return prototype["__class__"];
      }
      else if (type === "function" && value.name) {
          return value.name;
      }
      else if (prototype.constructor && prototype.constructor.name) {
          return prototype.constructor.name;
      }
      var constructorString = prototype.constructor.toString().trim();
      var index = constructorString.indexOf("(");
      var className = constructorString.substring(9, index);
      Object.defineProperty(prototype, "__class__", {
          value: className,
          enumerable: false,
          writable: true,
      });
      return className;
  }
  var PoolObjectName = "__PoolObjectName__";
  var PoolManager = (function () {
      function PoolManager() {
          this._poolMap = {};
      }
      PoolManager.prototype.alloc = function (cls) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          var className = getQualifiedClassName(cls);
          if (!this._poolMap[className]) {
              this._poolMap[className] = [];
          }
          var list = this._poolMap[className];
          if (list.length) {
              var vo = list.pop();
              if (vo["onAlloc"] && typeof vo["onAlloc"] === "function") {
                  vo["onAlloc"]();
              }
              return vo;
          }
          var clazz = new (cls.bind.apply(cls, __spreadArray([undefined], args, false)))();
          if (clazz["onAlloc"] && typeof clazz["onAlloc"] === "function") {
              clazz["onAlloc"]();
          }
          clazz["".concat(PoolObjectName)] = className;
          return clazz;
      };
      PoolManager.prototype.free = function (obj) {
          if (!obj) {
              return false;
          }
          var refKey = obj["".concat(PoolObjectName)];
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
      };
      PoolManager.prototype.clear = function () {
          this._poolMap = {};
      };
      PoolManager.prototype.getContent = function () {
          return this._poolMap;
      };
      PoolManager.prototype.setCount = function (count) {
          if (count === undefined) { count = 5; }
          for (var key in this._poolMap) {
              var list = this._poolMap[key];
              if (list.length > count) {
                  list.length = count;
              }
          }
      };
      return PoolManager;
  }());
  var poolMgr = new PoolManager();

  var TimerVo = (function () {
      function TimerVo() {
          this.useFrame = false;
          this.interval = 0;
          this.isRepeat = false;
          this.repeatCount = 0;
          this.exeTime = 0;
          this.lastExeTime = 0;
          this.callBack = undefined;
          this.finishCallBack = undefined;
      }
      TimerVo.prototype.onAlloc = function () {
          this.onFree();
      };
      TimerVo.prototype.onFree = function () {
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
      };
      TimerVo.prototype.isEqual = function (cb) {
          if (!this.callBack) {
              return false;
          }
          return (this.callBack.method === cb.method && this.callBack.caller === cb.caller);
      };
      TimerVo.prototype.isEqualCaller = function (caller) {
          if (!caller || !this.callBack) {
              return false;
          }
          return caller === this.callBack.caller;
      };
      return TimerVo;
  }());

  var TimerManager = (function () {
      function TimerManager() {
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
      TimerManager.prototype.removeVo = function (vo) {
          if (!vo) {
              return;
          }
          var idx = this._timeList.indexOf(vo);
          if (idx > -1) {
              this._timeList.splice(idx, 0);
          }
          idx = this._frameList.indexOf(vo);
          if (idx > -1) {
              this._frameList.splice(idx, 0);
          }
          poolMgr.free(vo);
      };
      TimerManager.prototype.tick = function () {
          var _a, _b, _c, _d, _e;
          this._curTime = Date.now();
          this._curFrame++;
          while ((_a = this._deleteList) === null || _a === undefined ? undefined : _a.length) {
              this.removeVo(this._deleteList.pop());
          }
          if ((_b = this._frameList) === null || _b === undefined ? undefined : _b.length) {
              for (var _i = 0, _f = this._frameList; _i < _f.length; _i++) {
                  var vo = _f[_i];
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
              for (var _g = 0, _h = this._timeList; _g < _h.length; _g++) {
                  var vo = _h[_g];
                  if (this._deleteList.includes(vo)) {
                      continue;
                  }
                  if (vo.exeTime <= this._curTime) {
                      vo.callBack.exec(this._curTime - vo.lastExeTime);
                      vo.lastExeTime = this._curTime;
                      vo.exeTime += vo.interval;
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
      };
      TimerManager.prototype.create = function (useFrame, delay, repeat, cb, finishCb) {
          if (delay < 0 || repeat < 0 || !cb) {
              return;
          }
          this.remove(cb);
          var vo = poolMgr.alloc(TimerVo);
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
      };
      TimerManager.prototype.setTimeOut = function (delay, cb) {
          this.doTimer(delay, 1, cb);
      };
      TimerManager.prototype.setFrameOut = function (delay, cb) {
          this.doFrame(delay, 1, cb);
      };
      TimerManager.prototype.doTimer = function (delay, repeat, cb, finishCb) {
          this.create(false, delay, repeat, cb, finishCb);
      };
      TimerManager.prototype.doTimerDelay = function (startTime, delay, repeat, cb, finishCb) {
          var _this = this;
          this.setTimeOut(startTime, CallBack.alloc(this, function () {
              _this.doTimer(delay, repeat, cb, finishCb);
          }));
      };
      TimerManager.prototype.doFrame = function (delay, repeat, cb, finishCb) {
          this.create(true, delay, repeat, cb, finishCb);
      };
      TimerManager.prototype.doFrameDelay = function (startTime, delay, repeat, cb, finishCb) {
          var _this = this;
          this.setFrameOut(startTime, CallBack.alloc(this, function () {
              _this.doFrame(delay, repeat, cb, finishCb);
          }));
      };
      TimerManager.prototype.remove = function (cb) {
          var list = this._timeList.concat(this._frameList).slice();
          for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
              var vo = list_1[_i];
              if (vo === null || vo === undefined ? undefined : vo.isEqual(cb)) {
                  this._deleteList.push(vo);
                  break;
              }
          }
      };
      TimerManager.prototype.removeAll = function (caller) {
          var list = this._timeList.concat(this._frameList).slice();
          for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
              var vo = list_2[_i];
              if (vo === null || vo === undefined ? undefined : vo.isEqualCaller(caller)) {
                  this._deleteList.push(vo);
                  break;
              }
          }
      };
      TimerManager.prototype.isExist = function (cb) {
          var list = this._timeList.concat(this._frameList).slice();
          return !!list.find(function (vo) { var _a; return cb && cb.id === ((_a = vo.callBack) === null || _a === undefined ? undefined : _a.id); });
      };
      return TimerManager;
  }());
  var timerMgr = new TimerManager();

  var GEvent = (function () {
      function GEvent() {
          this._type = "";
          this._data = undefined;
      }
      GEvent.alloc = function (type, data) {
          var nt = poolMgr.alloc(GEvent);
          nt._type = type;
          nt._data = data;
          return nt;
      };
      Object.defineProperty(GEvent.prototype, "type", {
          get: function () {
              return this._type;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(GEvent.prototype, "data", {
          get: function () {
              return this._data;
          },
          enumerable: false,
          configurable: true
      });
      GEvent.prototype.onAlloc = function () {
          this.onFree();
      };
      GEvent.prototype.onFree = function () {
          this._type = "";
          this._data = undefined;
      };
      return GEvent;
  }());

  var EventManager = (function () {
      function EventManager() {
          this._event = {};
      }
      EventManager.prototype.on = function (key, method, caller) {
          if (!this._event[key]) {
              this._event[key] = [];
          }
          var list = this._event[key];
          for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
              var callBack_1 = list_1[_i];
              if (callBack_1 === null || callBack_1 === undefined ? undefined : callBack_1.isEqual(caller, method)) {
                  return;
              }
          }
          var callBack = CallBack.alloc(caller, method);
          this._event[key].push(callBack);
      };
      EventManager.prototype.off = function (key, method, caller) {
          var list = this._event[key];
          if (!list || !list.length) {
              return;
          }
          for (var i = 0; i < list.length; i++) {
              var callBack = list[i];
              if (callBack === null || callBack === undefined ? undefined : callBack.isEqual(caller, method)) {
                  list[i] = undefined;
                  break;
              }
          }
      };
      EventManager.prototype.emit = function (key, data) {
          var list = this._event[key];
          if (!list || !list.length) {
              return;
          }
          for (var i = 0; i < list.length; i++) {
              var callBack = list[i];
              if (!callBack) {
                  list.splice(i, 1);
                  i--;
                  continue;
              }
              var nt = GEvent.alloc(key, data);
              callBack.exec(nt);
          }
      };
      EventManager.prototype.offAllByKey = function (key) {
          var list = this._event[key];
          if (!list || !list.length) {
              return;
          }
          for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
              var callBack = list_2[_i];
              if (callBack) {
                  this.off(key, callBack.method, callBack.caller);
              }
          }
          delete this._event[key];
      };
      EventManager.prototype.offAll = function () {
          var keys = Object.keys(this._event) || [];
          for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
              var key = keys_1[_i];
              this.offAllByKey(key);
              delete this._event[key];
          }
          this._event = {};
      };
      return EventManager;
  }());
  var eventMgr = new EventManager();

  var SOCKET_HOST = "127.0.0.1";
  var SOCKET_PORT = 8080;
  var SocketManager = (function () {
      function SocketManager() {
          this._socket = undefined;
          this._url = "";
      }
      SocketManager.prototype.connect = function (host, port) {
          if (this._socket) {
              console.error("Socket is already connected.");
              return;
          }
          if (host && port) {
              this._url = "ws://".concat(host, ":").concat(port);
          }
          else {
              this._url = "ws://".concat(SOCKET_HOST, ":").concat(SOCKET_PORT);
          }
          this._socket = new WebSocket(this._url);
          this._socket.binaryType = "arraybuffer";
          this._socket.onopen = this.onOpen;
          this._socket.onmessage = this.onMessage;
          this._socket.onerror = this.onError;
          this._socket.onclose = this.onClose;
      };
      SocketManager.prototype.onOpen = function (ev) {
          console.log("Socket connected.");
      };
      SocketManager.prototype.onMessage = function (ev) {
          console.log("Message received: ", ev.data);
      };
      SocketManager.prototype.onError = function (ev) {
          console.error("Socket error: ", ev);
      };
      SocketManager.prototype.onClose = function (ev) {
          console.log("Socket disconnected");
          if (this._socket) {
              this._socket.close();
          }
          this._socket = undefined;
          this._url = "";
      };
      SocketManager.prototype.send = function (data) {
          if (!this._socket || this._socket.readyState !== WebSocket.OPEN) {
              console.error("WebSocket is not connected.");
              return;
          }
          this._socket.send(data);
      };
      SocketManager.prototype.receive = function (event) {
      };
      SocketManager.prototype.decodeMsg = function () {
      };
      SocketManager.prototype.encodeMsg = function (data) {
      };
      return SocketManager;
  }());
  var socketMgr = new SocketManager();

  var ResourceManager = (function () {
      function ResourceManager() {
          this._cache = {};
          this._lastUsedTime = {};
          this._maxCacheSize = 50;
          this._loader = undefined;
          this._cleanupInterval = 10000;
          this._clearTime = 0;
      }
      ResourceManager.prototype.init = function (loader) {
          this._loader = loader;
      };
      ResourceManager.prototype.load = function (url, callback) {
          var _this = this;
          if (this._cache[url]) {
              this._lastUsedTime[url] = Date.now();
              callback(null, this._cache[url]);
              return;
          }
          if (!this._loader) {
              callback(new Error("ResourceManager 未初始化，缺少资源加载方法！"), null);
              return;
          }
          this._loader(url, function (err, asset) {
              if (err) {
                  callback(err, null);
                  return;
              }
              _this._cache[url] = asset;
              _this._lastUsedTime[url] = Date.now();
              callback(null, asset);
          });
      };
      ResourceManager.prototype.preload = function (urls, onComplete) {
          var loadedCount = 0;
          for (var i = 0; i < urls.length; i++) {
              this.load(urls[i], function () {
                  loadedCount++;
                  if (loadedCount === urls.length && onComplete) {
                      onComplete();
                  }
              });
          }
      };
      ResourceManager.prototype.release = function (url) {
          if (this._cache[url]) {
              delete this._cache[url];
              delete this._lastUsedTime[url];
          }
      };
      ResourceManager.prototype.cleanup = function () {
          var _this = this;
          var cacheSize = Object.keys(this._cache).length;
          if (cacheSize <= this._maxCacheSize) {
              return;
          }
          var sortedKeys = Object.keys(this._lastUsedTime).sort(function (a, b) { return _this._lastUsedTime[a] - _this._lastUsedTime[b]; });
          var removeCount = Math.ceil(cacheSize * 0.2);
          for (var i = 0; i < removeCount; i++) {
              this.release(sortedKeys[i]);
          }
      };
      ResourceManager.prototype.tick = function () {
          var curTime = Date.now();
          if (curTime - this._clearTime >= this._cleanupInterval) {
              this._clearTime = curTime;
              this.cleanup();
          }
      };
      return ResourceManager;
  }());
  var resourceMgr = new ResourceManager();
  resourceMgr.init(function (url, callback) {
      Laya.loader.load(url, Laya.Handler.create(null, function (asset) {
          callback(null, asset);
      }));
  });

  function baseLoop() {
      _loopTween();
      timerMgr.tick();
  }

  exports.CallBack = CallBack;
  exports.Ease = Ease;
  exports.GEvent = GEvent;
  exports._loopTween = _loopTween;
  exports.baseLoop = baseLoop;
  exports.eventMgr = eventMgr;
  exports.poolMgr = poolMgr;
  exports.resourceMgr = resourceMgr;
  exports.socketMgr = socketMgr;
  exports.timerMgr = timerMgr;
  exports.tweenMgr = tweenMgr;

}));

!function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define([ "exports" ], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).base = {});
}(this, (function (t) {
  "use strict";
  var e = function (t) {
    return t;
  }, i = { in: e, out: e, inOut: e }, o = {
    in: function (t) {
      return t * t;
    }, out: function (t) {
      return t * (2 - t);
    }, inOut: function (t) {
      return t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
    }
  }, n = {
    in: function (t) {
      return t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 3);
    }, inOut: function (t) {
      return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  }, r = {
    in: function (t) {
      return t * t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 4);
    }, inOut: function (t) {
      return t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
  }, s = {
    in: function (t) {
      return t * t * t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 5);
    }, inOut: function (t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
    }
  }, a = {
    in: function (t) {
      return t * t * t * t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 6);
    }, inOut: function (t) {
      return t < .5 ? 16 * t * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 6) / 2;
    }
  }, h = {
    in: function (t) {
      return 1 - Math.cos(t * Math.PI / 2);
    }, out: function (t) {
      return Math.sin(t * Math.PI / 2);
    }, inOut: function (t) {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    }
  }, u = 1.70158, c = {
    in: function (t) {
      return t * t * (2.70158 * t - u);
    }, out: function (t) {
      return (t -= 1) * t * (2.70158 * t + u) + 1;
    }, inOut: function (t) {
      var e = 2.5949095;
      return t < .5 ? 2 * t * t * ((e + 1) * t * 2 - e) / 2 : ((t = 2 * t - 2) * t * ((e + 1) * t + e) + 2) / 2;
    }
  }, l = {
    in: function (t) {
      return 1 - Math.sqrt(1 - t * t);
    }, out: function (t) {
      return Math.sqrt(1 - (t - 1) * (t - 1));
    }, inOut: function (t) {
      return t < .5 ? (1 - Math.sqrt(1 - 2 * t * (2 * t))) / 2 : (Math.sqrt(1 - 2 * (1 - t) * (2 * (1 - t))) + 1) / 2;
    }
  }, p = {
    in: function (t) {
      return 1 - Math.abs(Math.cos(t * Math.PI) * (1 - t));
    }, out: function (t) {
      return Math.abs(Math.cos(t * Math.PI) * t);
    }, inOut: function (t) {
      return t < .5 ? (1 - Math.abs(Math.cos(t * Math.PI) * (1 - t))) / 2 : (Math.abs(Math.cos(t * Math.PI) * t) + 1) / 2;
    }
  }, f = {
    in: function (t) {
      return -Math.exp(-t) * Math.cos(2 * t * Math.PI);
    }, out: function (t) {
      return Math.exp(-t) * Math.cos(2 * t * Math.PI);
    }, inOut: function (t) {
      return t < .5 ? -.5 * Math.exp(-2 * t) * Math.cos(2 * t * Math.PI) : .5 * Math.exp(-2 * (1 - t)) * Math.cos(2 * (1 - t) * Math.PI);
    }
  }, _ = {
    in: function (t) {
      return Math.pow(2, 10 * (t - 1));
    }, out: function (t) {
      return 1 - Math.pow(2, -10 * t);
    }, inOut: function (t) {
      return t < .5 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (2 * t - 1)));
    }
  }, d = function () {
    function t() {
    }

    return t.Quad = o, t.Linear = i, t.Cubic = n, t.Quart = r, t.Quint = s, t.Strong = a, t.Sine = h, t.Back = c, t.Circ = l, t.Bounce = p, t.Elastic = f, t.Expo = _, t;
  }(), v = function () {
    function t() {
      this.target = void 0, this.duration = 0, this.properties = {}, this.startTime = null, this.startProperties = {}, this.loop = !1, this.yoyo = !1, this.isReversing = !1, this.repeat = 0, this.repeatCount = 0, this.ease = e, this.timeScale = 1;
    }

    return t.prototype.init = function (t, i) {
      var o, n, r, s;
      return this.target = t, this.loop = null !== (o = null == i ? void 0 : i.loop) && void 0 !== o && o, this.yoyo = null !== (n = null == i ? void 0 : i.yoyo) && void 0 !== n && n, this.repeat = null !== (r = null == i ? void 0 : i.repeat) && void 0 !== r ? r : 0, this.timeScale = null !== (s = null == i ? void 0 : i.scale) && void 0 !== s ? s : 1, this.ease = e, this.duration = 0, this.properties = {}, this.onComplete = void 0, this;
    }, t.prototype.to = function (t, i, o, n) {
      void 0 === o && (o = e), this.properties = t, this.duration = i, this.ease = o || e, this.onComplete = n, this.start();
    }, t.prototype.from = function (t, i, o, n) {
      void 0 === o && (o = e), this.properties = t, this.duration = i, this.ease = o || e, this.onComplete = n, this.start(!0);
    }, t.prototype.start = function (t) {
      if (void 0 === t && (t = !1), this.startTime = Date.now(), t) for (var e in this.properties) this.startProperties[e] = this.properties[e], this.properties[e] = this.target[e]; else for (var e in this.properties) this.startProperties[e] = this.target[e];
    }, t.prototype.update = function (t) {
      if (null === this.startTime) return !1;
      var e = (t - this.startTime) * this.timeScale / this.duration;
      if (e >= 1) {
        if (this.yoyo && !this.isReversing) return this.isReversing = !0, this.startTime = t, !1;
        if (this.loop || this.repeat && this.repeatCount < this.repeat) return this.isReversing = !1, this.startTime = t, this.repeatCount++, !1;
        for (var i in this.properties) this.target[i] = this.isReversing ? this.startProperties[i] : this.properties[i];
        return this.onComplete && this.onComplete.exec(), !0;
      }
      for (var i in this.isReversing && (e = 1 - e), e = this.ease(e), this.properties) {
        var o = this.startProperties[i], n = this.properties[i];
        this.target[i] = o + (n - o) * e;
      }
      return !1;
    }, t.prototype.checkTarget = function (t) {
      return this.target && this.target === t;
    }, t;
  }(), m = 0, y = new (function () {
    function t() {
      this._tweens = [], this._tmpTweens = [];
    }

    return t.prototype.reg = function (t) {
      return t.$TWEEN_ID = ++m, this._tmpTweens.push(t), t;
    }, t.prototype.get = function (t, e) {
      return this.reg((new v).init(t, e));
    }, t.prototype.remove = function (t) {
      var e;
      this._tmpTweens.length && ((e = this._tweens).push.apply(e, this._tmpTweens), this._tmpTweens.length = 0), this._tweens = this._tweens.filter((function (e) {
        return !e.checkTarget(t);
      }));
    }, t.prototype.update = function () {
      var t, e = Date.now();
      this._tmpTweens.length && ((t = this._tweens).push.apply(t, this._tmpTweens), this._tmpTweens.length = 0), this._tweens = this._tweens.filter((function (t) {
        return !t.update(e);
      }));
    }, t;
  }());

  function g() {
    y.update();
  }

  var M = function () {
    function t() {
      this._id = 0, this._caller = void 0, this._method = void 0, this._args = [], this._once = !1;
    }

    return Object.defineProperty(t.prototype, "method", {
      get: function () {
        return this._method;
      }, enumerable: !1, configurable: !0
    }), Object.defineProperty(t.prototype, "caller", {
      get: function () {
        return this._caller;
      }, enumerable: !1, configurable: !0
    }), Object.defineProperty(t.prototype, "once", {
      get: function () {
        return this._once;
      }, enumerable: !1, configurable: !0
    }), Object.defineProperty(t.prototype, "id", {
      get: function () {
        return this._id;
      }, enumerable: !1, configurable: !0
    }), t.alloc = function (e, i, o, n) {
      if ("function" != typeof i) throw new Error("CallBack func must be Function!");
      "boolean" == typeof o && (n = o, o = void 0);
      var r = this._pool.length > 0 ? this._pool.pop() : new t;
      return r._id = ++t._gid, r._caller = e || void 0, r._method = i, r._args = o, r._once = !!n, r;
    }, t.prototype.exec = function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      if (this._method) {
        var i, o = this._id;
        i = t.length ? this._args ? this._args.concat(t) : t : this._args;
        var n = this._method.apply(this._caller, i);
        return this._id === o && this._once && this.free(), n;
      }
    }, t.prototype.free = function () {
      this._caller = void 0, this._method = void 0, this._args && (this._args.length = 0), this._once = !1, this._id = 0, t._pool.push(this);
    }, t.prototype.isEqual = function (t, e) {
      return !!e && (this._caller === t && this._method === e);
    }, t._pool = [], t._gid = 1, t;
  }();
  "function" == typeof SuppressedError && SuppressedError;
  var T = "__PoolObjectName__", w = function () {
    function t() {
      this._poolMap = {};
    }

    return t.prototype.alloc = function (t) {
      for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
      var o = function (t) {
        var e = typeof t;
        if (!t || "object" !== e && !t.prototype) return e + "";
        var i = t.prototype ? t.prototype : Object.getPrototypeOf(t);
        if (i.hasOwnProperty("__class__") && i.__class__) return i.__class__;
        if ("function" === e && t.name) return t.name;
        if (i.constructor && i.constructor.name) return i.constructor.name;
        var o = i.constructor.toString().trim(), n = o.indexOf("("), r = o.substring(9, n);
        return Object.defineProperty(i, "__class__", { value: r, enumerable: !1, writable: !0 }), r;
      }(t);
      this._poolMap[o] || (this._poolMap[o] = []);
      var n = this._poolMap[o];
      if (n.length) {
        var r = n.pop();
        return r.onAlloc && "function" == typeof r.onAlloc && r.onAlloc(), r;
      }
      var s = new (t.bind.apply(t, function (t, e, i) {
        if (i || 2 === arguments.length) for (var o, n = 0, r = e.length; n < r; n++) !o && n in e || (o || (o = Array.prototype.slice.call(e, 0, n)), o[n] = e[n]);
        return t.concat(o || Array.prototype.slice.call(e));
      }([ void 0 ], e, !1)));
      return s.onAlloc && "function" == typeof s.onAlloc && s.onAlloc(), s["".concat(T)] = o, s;
    }, t.prototype.free = function (t) {
      if (!t) return !1;
      var e = t["".concat(T)];
      return !(!e || !this._poolMap[e] || this._poolMap[e].indexOf(t) > -1) && (t.onFree && "function" == typeof t.onFree && t.onFree(), this._poolMap[e].push(t), !0);
    }, t.prototype.clear = function () {
      this._poolMap = {};
    }, t.prototype.getContent = function () {
      return this._poolMap;
    }, t.prototype.setCount = function (t) {
      for (var e in void 0 === t && (t = 5), this._poolMap) {
        var i = this._poolMap[e];
        i.length > t && (i.length = t);
      }
    }, t;
  }(), k = new w, b = function () {
    function t() {
      this.useFrame = !1, this.interval = 0, this.isRepeat = !1, this.repeatCount = 0, this.exeTime = 0, this.lastExeTime = 0, this.callBack = void 0, this.finishCallBack = void 0;
    }

    return t.prototype.onAlloc = function () {
      this.onFree();
    }, t.prototype.onFree = function () {
      var t, e;
      this.interval = 0, this.isRepeat = !1, this.repeatCount = 0, this.exeTime = 0, null === (t = this.callBack) || void 0 === t || t.free(), this.callBack = void 0, null === (e = this.finishCallBack) || void 0 === e || e.free(), this.finishCallBack = void 0, this.useFrame = !1, this.lastExeTime = 0;
    }, t.prototype.isEqual = function (t) {
      return !!this.callBack && (this.callBack.method === t.method && this.callBack.caller === t.caller);
    }, t.prototype.isEqualCaller = function (t) {
      return !(!t || !this.callBack) && t === this.callBack.caller;
    }, t;
  }(), x = new (function () {
    function t() {
      this._curTime = 0, this._curFrame = 0, this._timeList = [], this._frameList = [], this._deleteList = [], this._curTime = Date.now(), this._curFrame = 0, this._timeList = [], this._frameList = [], this._deleteList = [];
    }

    return t.prototype.removeVo = function (t) {
      if (t) {
        var e = this._timeList.indexOf(t);
        e > -1 && this._timeList.splice(e, 0), (e = this._frameList.indexOf(t)) > -1 && this._frameList.splice(e, 0), k.free(t);
      }
    }, t.prototype.tick = function () {
      var t, e, i, o, n;
      for (this._curTime = Date.now(), this._curFrame++; null === (t = this._deleteList) || void 0 === t ? void 0 : t.length;) this.removeVo(this._deleteList.pop());
      if (null === (e = this._frameList) || void 0 === e ? void 0 : e.length) for (var r = 0, s = this._frameList; r < s.length; r++) {
        var a = s[r];
        this._deleteList.includes(a) || a.exeTime <= this._curFrame && (a.callBack.exec(this._curFrame - a.lastExeTime), a.lastExeTime = this._curFrame, a.exeTime += a.interval, a.isRepeat || (a.repeatCount > 0 ? a.repeatCount-- : (null === (i = a.finishCallBack) || void 0 === i || i.exec(this._curFrame - a.lastExeTime), this._deleteList.includes(a) || this._deleteList.push(a))));
      }
      if (null === (o = this._timeList) || void 0 === o ? void 0 : o.length) for (var h = 0, u = this._timeList; h < u.length; h++) {
        a = u[h];
        this._deleteList.includes(a) || a.exeTime <= this._curTime && (a.callBack.exec(this._curTime - a.lastExeTime), a.lastExeTime = this._curTime, a.exeTime += a.interval, a.isRepeat || (a.repeatCount > 0 ? a.repeatCount-- : (null === (n = a.finishCallBack) || void 0 === n || n.exec(this._curFrame - a.lastExeTime), this._deleteList.includes(a) || this._deleteList.push(a))));
      }
      return !0;
    }, t.prototype.create = function (t, e, i, o, n) {
      if (!(e < 0 || i < 0) && o) {
        this.remove(o);
        var r = k.alloc(b);
        r.interval = e, r.isRepeat = 0 === i, r.repeatCount = i, r.exeTime = e + (t ? this._curFrame : this._curTime), r.callBack = o, r.finishCallBack = n, r.useFrame = t, r.lastExeTime = 0, t ? this._frameList.push(r) : this._timeList.push(r);
      }
    }, t.prototype.setTimeOut = function (t, e) {
      this.doTimer(t, 1, e);
    }, t.prototype.setFrameOut = function (t, e) {
      this.doFrame(t, 1, e);
    }, t.prototype.doTimer = function (t, e, i, o) {
      this.create(!1, t, e, i, o);
    }, t.prototype.doTimerDelay = function (t, e, i, o, n) {
      var r = this;
      this.setTimeOut(t, M.alloc(this, (function () {
        r.doTimer(e, i, o, n);
      })));
    }, t.prototype.doFrame = function (t, e, i, o) {
      this.create(!0, t, e, i, o);
    }, t.prototype.doFrameDelay = function (t, e, i, o, n) {
      var r = this;
      this.setFrameOut(t, M.alloc(this, (function () {
        r.doFrame(e, i, o, n);
      })));
    }, t.prototype.remove = function (t) {
      for (var e = 0, i = this._timeList.concat(this._frameList).slice(); e < i.length; e++) {
        var o = i[e];
        if (null == o ? void 0 : o.isEqual(t)) {
          this._deleteList.push(o);
          break;
        }
      }
    }, t.prototype.removeAll = function (t) {
      for (var e = 0, i = this._timeList.concat(this._frameList).slice(); e < i.length; e++) {
        var o = i[e];
        if (null == o ? void 0 : o.isEqualCaller(t)) {
          this._deleteList.push(o);
          break;
        }
      }
    }, t.prototype.isExist = function (t) {
      return !!this._timeList.concat(this._frameList).slice().find((function (e) {
        var i;
        return t && t.id === (null === (i = e.callBack) || void 0 === i ? void 0 : i.id);
      }));
    }, t;
  }()), O = function () {
    function t() {
      this._type = "", this._data = void 0;
    }

    return t.alloc = function (e, i) {
      var o = k.alloc(t);
      return o._type = e, o._data = i, o;
    }, Object.defineProperty(t.prototype, "type", {
      get: function () {
        return this._type;
      }, enumerable: !1, configurable: !0
    }), Object.defineProperty(t.prototype, "data", {
      get: function () {
        return this._data;
      }, enumerable: !1, configurable: !0
    }), t.prototype.onAlloc = function () {
      this.onFree();
    }, t.prototype.onFree = function () {
      this._type = "", this._data = void 0;
    }, t;
  }(), L = new (function () {
    function t() {
      this._event = {};
    }

    return t.prototype.on = function (t, e, i) {
      this._event[t] || (this._event[t] = []);
      for (var o = 0, n = this._event[t]; o < n.length; o++) {
        var r = n[o];
        if (null == r ? void 0 : r.isEqual(i, e)) return;
      }
      var s = M.alloc(i, e);
      this._event[t].push(s);
    }, t.prototype.off = function (t, e, i) {
      var o = this._event[t];
      if (o && o.length) for (var n = 0; n < o.length; n++) {
        var r = o[n];
        if (null == r ? void 0 : r.isEqual(i, e)) {
          o[n] = void 0;
          break;
        }
      }
    }, t.prototype.emit = function (t, e) {
      var i = this._event[t];
      if (i && i.length) for (var o = 0; o < i.length; o++) {
        var n = i[o];
        if (n) {
          var r = O.alloc(t, e);
          n.exec(r);
        } else i.splice(o, 1), o--;
      }
    }, t.prototype.offAllByKey = function (t) {
      var e = this._event[t];
      if (e && e.length) {
        for (var i = 0, o = e; i < o.length; i++) {
          var n = o[i];
          n && this.off(t, n.method, n.caller);
        }
        delete this._event[t];
      }
    }, t.prototype.offAll = function () {
      for (var t = 0, e = Object.keys(this._event) || []; t < e.length; t++) {
        var i = e[t];
        this.offAllByKey(i), delete this._event[i];
      }
      this._event = {};
    }, t;
  }()), C = new (function () {
    function t() {
      this._socket = void 0, this._url = "";
    }

    return t.prototype.connect = function (t, e) {
      this._socket || (this._url = t && e ? "ws://".concat(t, ":").concat(e) : "ws://".concat("127.0.0.1", ":").concat(8080), this._socket = new WebSocket(this._url), this._socket.binaryType = "arraybuffer", this._socket.onopen = this.onOpen, this._socket.onmessage = this.onMessage, this._socket.onerror = this.onError, this._socket.onclose = this.onClose);
    }, t.prototype.onOpen = function (t) {
    }, t.prototype.onMessage = function (t) {
    }, t.prototype.onError = function (t) {
    }, t.prototype.onClose = function (t) {
      this._socket && this._socket.close(), this._socket = void 0, this._url = "";
    }, t.prototype.send = function (t) {
      this._socket && this._socket.readyState === WebSocket.OPEN && this._socket.send(t);
    }, t.prototype.receive = function (t) {
    }, t.prototype.decodeMsg = function () {
    }, t.prototype.encodeMsg = function (t) {
    }, t;
  }()), E = new (function () {
    function t() {
      this._cache = {}, this._lastUsedTime = {}, this._maxCacheSize = 50, this._loader = void 0, this._cleanupInterval = 1e4, this._clearTime = 0;
    }

    return t.prototype.init = function (t) {
      this._loader = t;
    }, t.prototype.load = function (t, e) {
      var i = this;
      if (this._cache[t]) return this._lastUsedTime[t] = Date.now(), void e(null, this._cache[t]);
      this._loader ? this._loader(t, (function (o, n) {
        o ? e(o, null) : (i._cache[t] = n, i._lastUsedTime[t] = Date.now(), e(null, n));
      })) : e(new Error("ResourceManager 未初始化，缺少资源加载方法！"), null);
    }, t.prototype.preload = function (t, e) {
      for (var i = 0, o = 0; o < t.length; o++) this.load(t[o], (function () {
        ++i === t.length && e && e();
      }));
    }, t.prototype.release = function (t) {
      this._cache[t] && (delete this._cache[t], delete this._lastUsedTime[t]);
    }, t.prototype.cleanup = function () {
      var t = this, e = Object.keys(this._cache).length;
      if (!(e <= this._maxCacheSize)) for (var i = Object.keys(this._lastUsedTime).sort((function (e, i) {
        return t._lastUsedTime[e] - t._lastUsedTime[i];
      })), o = Math.ceil(.2 * e), n = 0; n < o; n++) this.release(i[n]);
    }, t.prototype.tick = function () {
      var t = Date.now();
      t - this._clearTime >= this._cleanupInterval && (this._clearTime = t, this.cleanup());
    }, t;
  }());
  E.init((function (t, e) {
    Laya.loader.load(t, Laya.Handler.create(null, (function (t) {
      e(null, t);
    })));
  })), t.CallBack = M, t.Ease = d, t.GEvent = O, t._loopTween = g, t.baseLoop = function () {
    g(), x.tick();
  }, t.eventMgr = L, t.poolMgr = k, t.resourceMgr = E, t.socketMgr = C, t.timerMgr = x, t.tweenMgr = y;
}));

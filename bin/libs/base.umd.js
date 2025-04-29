!function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define([ "exports" ], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).base = {});
}(this, (function (t) {
  "use strict";
  if (typeof globalThis !== "undefined") {
    globalThis.base = t;
  } else if (typeof window !== "undefined") {
    window.base = t;
  } else if (typeof global !== "undefined") {
    global.base = t;
  }
  var e = function () {
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
      this.id && (this._caller = void 0, this._method = void 0, this._args && (this._args.length = 0), this._once = !1, this._id = 0, t._pool.push(this));
    }, t.prototype.isEqual = function (t, e) {
      return !!e && (this._caller === t && this._method === e);
    }, t._pool = [], t._gid = 1, t;
  }(), i = function (t, e) {
    return i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
    }, i(t, e);
  };

  function o(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");

    function o() {
      this.constructor = t;
    }

    i(t, e), t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o);
  }

  "function" == typeof SuppressedError && SuppressedError;
  var n = "__PoolObjectName__", r = function () {
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
      var r = this._poolMap[o];
      if (r.length) {
        var s = r.pop();
        return s.onAlloc && "function" == typeof s.onAlloc && s.onAlloc(), s;
      }
      var a = new (t.bind.apply(t, function (t, e, i) {
        if (i || 2 === arguments.length) for (var o, n = 0, r = e.length; n < r; n++) !o && n in e || (o || (o = Array.prototype.slice.call(e, 0, n)), o[n] = e[n]);
        return t.concat(o || Array.prototype.slice.call(e));
      }([ void 0 ], e, !1)));
      return a.onAlloc && "function" == typeof a.onAlloc && a.onAlloc(), a["".concat(n)] = o, a;
    }, t.prototype.free = function (t) {
      if (!t) return !1;
      var e = t["".concat(n)];
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
  }(), s = new r, a = function () {
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
  }(), u = new (function () {
    function t() {
      this._curTime = 0, this._curFrame = 0, this._timeList = [], this._frameList = [], this._deleteList = [], this._curTime = Date.now(), this._curFrame = 0, this._timeList = [], this._frameList = [], this._deleteList = [];
    }

    return t.prototype.removeVo = function (t) {
      if (t) {
        var e = this._timeList.indexOf(t);
        e > -1 && this._timeList.splice(e, 0), (e = this._frameList.indexOf(t)) > -1 && this._frameList.splice(e, 0), s.free(t);
      }
    }, t.prototype.tick = function () {
      var t, e, i, o, n;
      for (this._curTime = Date.now(), this._curFrame++; null === (t = this._deleteList) || void 0 === t ? void 0 : t.length;) this.removeVo(this._deleteList.pop());
      if (null === (e = this._frameList) || void 0 === e ? void 0 : e.length) for (var r = 0, s = this._frameList; r < s.length; r++) {
        var a = s[r];
        this._deleteList.includes(a) || a.exeTime <= this._curFrame && (a.callBack.exec(this._curFrame - a.lastExeTime), a.lastExeTime = this._curFrame, a.exeTime += a.interval, a.isRepeat || (a.repeatCount > 0 ? a.repeatCount-- : (null === (i = a.finishCallBack) || void 0 === i || i.exec(this._curFrame - a.lastExeTime), this._deleteList.includes(a) || this._deleteList.push(a))));
      }
      if (null === (o = this._timeList) || void 0 === o ? void 0 : o.length) for (var u = 0, h = this._timeList; u < h.length; u++) {
        a = h[u];
        this._deleteList.includes(a) || a.exeTime <= this._curTime && (a.callBack.exec(this._curTime - a.lastExeTime), a.lastExeTime = this._curTime, a.exeTime += a.interval, a.isRepeat || (a.repeatCount > 0 ? a.repeatCount-- : (null === (n = a.finishCallBack) || void 0 === n || n.exec(this._curFrame - a.lastExeTime), this._deleteList.includes(a) || this._deleteList.push(a))));
      }
      return !0;
    }, t.prototype.create = function (t, e, i, o, n) {
      if (!(e < 0 || i < 0) && o) {
        this.remove(o);
        var r = s.alloc(a);
        r.interval = e, r.isRepeat = 0 === i, r.repeatCount = i, r.exeTime = e + (t ? this._curFrame : this._curTime), r.callBack = o, r.finishCallBack = n, r.useFrame = t, r.lastExeTime = 0, t ? this._frameList.push(r) : this._timeList.push(r);
      }
    }, t.prototype.setTimeOut = function (t, e) {
      this.doTimer(t, 1, e);
    }, t.prototype.setFrameOut = function (t, e) {
      this.doFrame(t, 1, e);
    }, t.prototype.doTimer = function (t, e, i, o) {
      this.create(!1, t, e, i, o);
    }, t.prototype.doTimerDelay = function (t, i, o, n, r) {
      var s = this;
      this.setTimeOut(t, e.alloc(this, (function () {
        s.doTimer(i, o, n, r);
      })));
    }, t.prototype.doFrame = function (t, e, i, o) {
      this.create(!0, t, e, i, o);
    }, t.prototype.doFrameDelay = function (t, i, o, n, r) {
      var s = this;
      this.setFrameOut(t, e.alloc(this, (function () {
        s.doFrame(i, o, n, r);
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
  }()), h = function (t) {
    return t;
  }, c = function () {
    function t() {
      this.target = void 0, this.duration = 0, this.properties = {}, this.startTime = null, this.startProperties = {}, this.loop = !1, this.yoyo = !1, this.isReversing = !1, this.repeat = 0, this.repeatCount = 0, this.ease = h, this.timeScale = 1;
    }

    return t.prototype.init = function (t, e) {
      var i, o, n, r;
      return this.target = t, this.loop = null !== (i = null == e ? void 0 : e.loop) && void 0 !== i && i, this.yoyo = null !== (o = null == e ? void 0 : e.yoyo) && void 0 !== o && o, this.repeat = null !== (n = null == e ? void 0 : e.repeat) && void 0 !== n ? n : 0, this.timeScale = null !== (r = null == e ? void 0 : e.scale) && void 0 !== r ? r : 1, this.ease = h, this.duration = 0, this.properties = {}, this.onComplete = void 0, this;
    }, t.prototype.to = function (t, e, i, o) {
      void 0 === i && (i = h), this.properties = t, this.duration = e, this.ease = i || h, this.onComplete = o, this.start();
    }, t.prototype.from = function (t, e, i, o) {
      void 0 === i && (i = h), this.properties = t, this.duration = e, this.ease = i || h, this.onComplete = o, this.start(!0);
    }, t.prototype.start = function (t) {
      if (void 0 === t && (t = !1), this.startTime = Date.now(), t) for (var e in this.properties) this.startProperties[e] = this.properties[e], this.properties[e] = this.target[e]; else for (var e in this.properties) this.startProperties[e] = this.target[e];
    }, t.prototype.update = function (t) {
      if (!this.target) return !0;
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
    }, t.prototype.dispose = function () {
      this.onComplete && (this.onComplete.free(), this.onComplete = void 0), this.target = void 0, this.properties = {}, this.startTime = null;
    }, t;
  }(), p = 0, l = new (function () {
    function t() {
      this._tweens = [], this._tmpTweens = [];
    }

    return t.prototype.reg = function (t) {
      return t.$TWEEN_ID = ++p, this._tmpTweens.push(t), t;
    }, t.prototype.get = function (t, e) {
      return this.reg((new c).init(t, e));
    }, t.prototype.remove = function (t) {
      var e;
      this._tmpTweens.length && ((e = this._tweens).push.apply(e, this._tmpTweens), this._tmpTweens.length = 0);
      for (var i = 0, o = this._tweens; i < o.length; i++) {
        var n = o[i];
        n.checkTarget(t) && n.dispose();
      }
    }, t.prototype.update = function () {
      var t, e = Date.now();
      this._tmpTweens.length && ((t = this._tweens).push.apply(t, this._tmpTweens), this._tmpTweens.length = 0);
      for (var i = [], o = 0, n = this._tweens; o < n.length; o++) {
        (a = n[o]).update(e) && i.push(a);
      }
      if (null == i ? void 0 : i.length) {
        for (var r = 0, s = i; r < s.length; r++) {
          var a;
          if (a = s[r]) {
            a.dispose();
            var u = this._tweens.indexOf(a);
            u > -1 && this._tweens.splice(u, 1);
          }
        }
        i.length = 0;
      }
    }, t;
  }());
  t.facade = void 0;
  var f = function () {
    function e() {
      this._moduleMap = {}, this._moduleList = [];
    }

    return e.prototype.regModule = function (t) {
      this._moduleMap[t.name] = t;
    }, e.prototype.retModule = function (t) {
      return this._moduleMap[t];
    }, e.prototype.push = function (t) {
      this._moduleList.push(t);
    }, e.prototype.instantiate = function () {
      for (var t = 0, e = this._moduleList; t < e.length; t++) {
        var i = new (0, e[t]);
        i && (i.onReg(), this.regModule(i));
      }
    }, e.prototype.getProxy = function (e, i) {
      return function (e, i) {
        var o = t.facade.retModule(e);
        if (o) {
          var n = o.retProxy(i);
          if (n) return n;
        }
      }(e, i);
    }, e;
  }(), d = function () {
    function t() {
      this._type = "", this._data = void 0;
    }

    return t.alloc = function (e, i) {
      var o = s.alloc(t);
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
  }(), _ = new (function () {
    function t() {
      this._event = {};
    }

    return t.prototype.on = function (t, i, o) {
      this._event[t] || (this._event[t] = []);
      for (var n = 0, r = this._event[t]; n < r.length; n++) {
        var s = r[n];
        if (null == s ? void 0 : s.isEqual(o, i)) return;
      }
      var a = e.alloc(o, i);
      this._event[t].push(a);
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
          var r = d.alloc(t, e);
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
  }()), m = { in: h, out: h, inOut: h }, y = {
    in: function (t) {
      return t * t;
    }, out: function (t) {
      return t * (2 - t);
    }, inOut: function (t) {
      return t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
    }
  }, v = {
    in: function (t) {
      return t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 3);
    }, inOut: function (t) {
      return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  }, g = {
    in: function (t) {
      return t * t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 4);
    }, inOut: function (t) {
      return t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
  }, M = {
    in: function (t) {
      return t * t * t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 5);
    }, inOut: function (t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
    }
  }, w = {
    in: function (t) {
      return t * t * t * t * t * t;
    }, out: function (t) {
      return 1 - Math.pow(1 - t, 6);
    }, inOut: function (t) {
      return t < .5 ? 16 * t * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 6) / 2;
    }
  }, T = {
    in: function (t) {
      return 1 - Math.cos(t * Math.PI / 2);
    }, out: function (t) {
      return Math.sin(t * Math.PI / 2);
    }, inOut: function (t) {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    }
  }, b = 1.70158, x = {
    in: function (t) {
      return t * t * (2.70158 * t - b);
    }, out: function (t) {
      return (t -= 1) * t * (2.70158 * t + b) + 1;
    }, inOut: function (t) {
      var e = 2.5949095;
      return t < .5 ? 2 * t * t * ((e + 1) * t * 2 - e) / 2 : ((t = 2 * t - 2) * t * ((e + 1) * t + e) + 2) / 2;
    }
  }, O = {
    in: function (t) {
      return 1 - Math.sqrt(1 - t * t);
    }, out: function (t) {
      return Math.sqrt(1 - (t - 1) * (t - 1));
    }, inOut: function (t) {
      return t < .5 ? (1 - Math.sqrt(1 - 2 * t * (2 * t))) / 2 : (Math.sqrt(1 - 2 * (1 - t) * (2 * (1 - t))) + 1) / 2;
    }
  }, k = {
    in: function (t) {
      return 1 - Math.abs(Math.cos(t * Math.PI) * (1 - t));
    }, out: function (t) {
      return Math.abs(Math.cos(t * Math.PI) * t);
    }, inOut: function (t) {
      return t < .5 ? (1 - Math.abs(Math.cos(t * Math.PI) * (1 - t))) / 2 : (Math.abs(Math.cos(t * Math.PI) * t) + 1) / 2;
    }
  }, L = {
    in: function (t) {
      return -Math.exp(-t) * Math.cos(2 * t * Math.PI);
    }, out: function (t) {
      return Math.exp(-t) * Math.cos(2 * t * Math.PI);
    }, inOut: function (t) {
      return t < .5 ? -.5 * Math.exp(-2 * t) * Math.cos(2 * t * Math.PI) : .5 * Math.exp(-2 * (1 - t)) * Math.cos(2 * (1 - t) * Math.PI);
    }
  }, C = {
    in: function (t) {
      return Math.pow(2, 10 * (t - 1));
    }, out: function (t) {
      return 1 - Math.pow(2, -10 * t);
    }, inOut: function (t) {
      return t < .5 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (2 * t - 1)));
    }
  }, P = function () {
    function t() {
    }

    return t.Quad = y, t.Linear = m, t.Cubic = v, t.Quart = g, t.Quint = M, t.Strong = w, t.Sine = T, t.Back = x, t.Circ = O, t.Bounce = k, t.Elastic = L, t.Expo = C, t;
  }(), I = new (function () {
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
  }));
  var B = function () {
    function t() {
    }

    return t.prototype.emit = function (t, e) {
      _.emit(t, e);
    }, t.prototype.on = function (t, e, i) {
      _.on(t, e, i);
    }, t.prototype.off = function (t, e, i) {
      _.off(t, e, i);
    }, t.prototype.offAll = function (t, e) {
    }, t;
  }(), F = function (t) {
    function e() {
      return null !== t && t.apply(this, arguments) || this;
    }

    return o(e, t), e;
  }(B), j = "__name__", U = "_mediator_";
  var A = function (t) {
    function e(e, i) {
      var o = t.call(this) || this;
      return o.ui = void 0, o.isOpened = !1, o.uiUrl = e, "number" == typeof i || (o.parent = i), o;
    }

    return o(e, t), e.prototype.setModule = function (t) {
      this._module = t, this._moduleName = t.name;
    }, e.prototype.setViewType = function (t) {
      this._viewType = t;
    }, e.prototype.getViewType = function () {
      return this._viewType;
    }, e.prototype.setName = function (t) {
      Object.defineProperty(this, j, { value: t, configurable: !1, enumerable: !1, writable: !0 });
    }, e.prototype.getName = function () {
      return this[j];
    }, e.prototype.open = function (t) {
      var e = this;
      this.params = t, !this.ui && this.uiUrl ? Laya.Scene.load(this.uiUrl, Laya.Handler.create(this, (function (t) {
        e.onUILoaded(t);
      }))) : this.initView(Laya.Handler.create(this, this.onUILoaded));
    }, e.prototype.close = function () {
      this.isOpened && (this.isOpened = !1, this.removeEvents(), this.onClose(), this.destroyUI());
    }, e.prototype.initView = function (t) {
    }, e.prototype.onUILoaded = function (t) {
      this.ui = t, this.ui.name = this[j], Object.defineProperty(this.ui, U, {
        value: this,
        configurable: !1,
        enumerable: !1,
        writable: !0
      }), this.parent.addChild(this.ui), this.initUI(), this.addEvents(), this.isOpened = !0, this.onOpen();
    }, e.prototype.destroyUI = function () {
      this.ui && (this.ui.removeSelf(), this.ui.destroy(!0), this.ui = void 0), this.parent = void 0, this.uiUrl = void 0;
    }, e;
  }(B), S = function () {
    function t(t) {
      this._cmdMap = {}, this._proxyInsMap = {}, this._mdrMap = {}, this._mdrInsMap = {}, this.name = t;
    }

    return t.prototype.onReg = function () {
      this.initCmd(), this.initProxy(), this.initMdr();
    }, t.prototype.regCmd = function (t, e) {
      _.on(t, this.exeCmd, this), this._cmdMap[t] = e;
    }, t.prototype.exeCmd = function (t, e) {
      var i = this._cmdMap[t];
      i && (new i).exec(e);
    }, t.prototype.regProxy = function (t, e) {
      if (!this._proxyInsMap[t]) {
        var i = new e;
        i.init(), this._proxyInsMap[t] = i;
      }
    }, t.prototype.retProxy = function (t) {
      return this._proxyInsMap[t];
    }, t.prototype.regMdr = function (t, e) {
      this._mdrMap[t] || (this._mdrMap[t] = e);
    }, t.prototype.retMdr = function (t) {
      return this._mdrMap[t];
    }, t.prototype.regMdrIns = function (t) {
      this._mdrInsMap[t.getViewType()] || (this._mdrInsMap[t.getViewType()] = t);
    }, t.prototype.retMdrIns = function (t) {
      return this._mdrInsMap[t];
    }, t.prototype.removeMdrIns = function (t) {
      var e = this.retMdrIns(t);
      e && (e.close(), this._mdrInsMap[t] = void 0, delete this._mdrInsMap[t]);
    }, t;
  }(), R = function (t) {
    function e() {
      return null !== t && t.apply(this, arguments) || this;
    }

    return o(e, t), e;
  }(B);
  t.BaseCommand = F, t.BaseMediator = A, t.BaseModule = S, t.BaseProxy = R, t.CallBack = e, t.Ease = P, t.GEvent = d, t.baseInit = function () {
    t.facade = new f;
    console.log(11111, t, t.facade);
  }, t.baseLoop = function () {
    l.update(), u.tick();
  }, t.eventMgr = _, t.findMediator = function (t) {
    if (t) {
      for (var e = t[U]; t && !e;) (t = t.parent)[U] && t[U] instanceof A && (e = t[U]);
      return e;
    }
  }, t.poolMgr = s, t.resourceMgr = E, t.socketMgr = I, t.timerMgr = u, t.tweenMgr = l;
}));

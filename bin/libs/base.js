var base, __reflect = this && this.__reflect || function (e, t, o) {
  e.__class__ = t, o ? o.push(t) : o = [t], e.__types__ = e.__types__ ? o.concat(e.__types__) : o;
}, __extends = this && this.__extends || function () {
  var n = function (e, t) {
    return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (e, t) {
      e.__proto__ = t;
    } || function (e, t) {
      for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
    })(e, t);
  };
  return function (e, t) {
    function o() {
      this.constructor = e;
    }

    n(e, t), e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o);
  };
}();
(base || (base = {})).createObj = function () {
  return Object.create(null);
}, function (e) {
  var t = Date.now();
  e.now = function () {
    return Date.now() - t;
  };
}(base = base || {}), function (o) {
  o.ON_CONNECT_CREATE = "on_connect_create", o.ON_CONNECT_LOST = "on_connect_lost", o.ON_CONNECT_ERROR = "on_connect_error", o.IdMsg = o.createObj(), o.__reg = function (e, t) {
    t.MsgId = e, o.IdMsg[e] = t;
  };
}(base = base || {}), Array.isArray || (Array.isArray = function (e) {
  return "[object Array]" === Object.prototype.toString.call(e);
}), function (e) {
  var t, o = (t = egret.HashObject, __extends(n, t), n);

  function n() {
    return null !== t && t.apply(this, arguments) || this;
  }

  e.ObjBase = o, __reflect(o.prototype, "base.ObjBase");
}(base = base || {}), function (o) {
  var e, t = (e = o.ObjBase, __extends(n, e), n.prototype.sendNt = function (e, t) {
    o.facade.sendNt(e, t);
  }, n);

  function n() {
    return null !== e && e.apply(this, arguments) || this;
  }

  o.Notifier = t, __reflect(t.prototype, "base.Notifier");
}(base = base || {}), function (n) {
  var t, e = (t = n.ObjBase, __extends(o, t), o.prototype.init = function () {
    "function" != typeof n.traceProto && (n.traceProto = function (e, t) {
    }), "function" != typeof n.onMsg && (n.onMsg = function (e) {
      n.facade.sendNt(n.getProtoName(e), e);
    });
  }, o.prototype.connectTo = function (e, t) {
    var o = this;
    o._connection && (o._connection.dispose(), o._connection = void 0), o._connection = new n.Connection, o._connection.onMsgReceive = n.Handler.alloc(o, o.onMsgReceive), o._connection.onCreated = n.Handler.alloc(o, o.onCreate), o._connection.onLost = n.Handler.alloc(o, o.onLost), o._connection.onError = n.Handler.alloc(o, o.onError), o._connection.connect(e + ":" + t);
  }, o.prototype.isConnected = function () {
    return !!this._connection && !!this._connection.isConnected && n.now() - this._recvTick < 36e4;
  }, o.prototype.close = function () {
    void 0 !== this._connection && this._connection.disconnect();
  }, o.prototype.onCreate = function () {
    n.facade.sendNt(n.ON_CONNECT_CREATE);
  }, o.prototype.onLost = function () {
    n.onMsg(n.ON_CONNECT_LOST);
  }, o.prototype.onError = function () {
    n.onMsg(n.ON_CONNECT_ERROR);
  }, o.prototype.onMsgReceive = function (e) {
    this._recvTick = n.now(), this.procProto(e);
  }, o.prototype.procProto = function (e) {
    n.onMsg(e);
  }, o.prototype.onNt = function (e, t, o) {
    n.facade.onNt(n.getProtoName(e), t, o);
  }, o.prototype.offNt = function (e, t, o) {
    n.facade.offNt(n.getProtoName(e), t, o);
  }, o.prototype.sendProto = function (e) {
    this._connection.send(e);
  }, o);

  function o() {
    var e = t.call(this) || this;
    return e._recvTick = 0, e.init(), e;
  }

  n.GameService = e, __reflect(e.prototype, "base.GameService");
}(base = base || {}), function (s) {
  var a = (e.prototype.alloc = function () {
    var e = this;
    e._aNum++, e.time = s.now();
    var t = e._list.length ? e._list.pop() : new e._cls;
    return "function" == typeof t.onAlloc && t.onAlloc(), t;
  }, e.prototype.release = function (e) {
    e && this._wait.indexOf(e) < 0 && ("function" == typeof e.onRelease && e.onRelease(), this._wait[this._wait.length] = e);
  }, e.prototype.resize = function (e) {
    for (var t, o = this, n = o._list; o._wait.length;) t = o._wait.pop(), n.indexOf(t) < 0 && (n[n.length] = t);
    if (e - o._rTime >= s.Consts.Pool_Resize_T) {
      var r = o._aNum > s.Consts.Pool_Size ? o._aNum : s.Consts.Pool_Size;
      for (o._aNum = 0, o._rTime = e; n.length > r;) "function" == typeof (t = n.pop()).dispose && t.dispose();
    }
  }, e.prototype.dispose = function () {
    for (var e, t = 0, o = this._list; t < o.length; t++) "function" == typeof (e = o[t]).dispose && e.dispose();
    for (var n = this._list.length = 0, r = this._wait; n < r.length; n++) "function" == typeof (e = r[n]).dispose && e.dispose();
    this._wait.length = 0;
  }, e);

  function e(e) {
    this._list = [], this._wait = [], this._cls = e, this.time = this._rTime = s.now(), this._aNum = 0;
  }

  __reflect(a.prototype, "PoolImpl");
  var t = (o.getPool = function (e, t) {
    void 0 === t && (t = !1);
    var o = e.prototype ? e.prototype : Object.getPrototypeOf(e), n = s.getClassName(e), r = o.__poolId__;
    if (r && r.indexOf(n) < 0 && (r = null), !r) {
      if (!t) return null;
      r = s.getClassName(e) + this.PoolId++, Object.defineProperty(o, "__poolId__", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: r
      });
    }
    var i = this.Pools[r];
    if (!i) {
      if (!t) return null;
      i = new a(e), this.Pools[r] = i;
    }
    return i;
  }, o.alloc = function (e) {
    return "function" != typeof e ? null : this.getPool(e, !0).alloc();
  }, o.release = function (e) {
    var t;
    e && "object" == typeof e && ((t = this.getPool(e.constructor, !1)) ? t.release(e) : "function" == typeof e.dispose && e.dispose());
  }, o.releaseList = function (e) {
    if (e && Array.isArray(e) && e.length) {
      for (var t = 0, o = e; t < o.length; t++) {
        var n = o[t];
        this.release(n);
      }
      e.length = 0;
    }
  }, o.checkUnused = function () {
    var e = s.now();
    for (var t in this.Pools) {
      var o = this.Pools[t];
      o && (e - o.time > s.Consts.Pool_Unused_T ? (this.Pools[t] = null, o.dispose()) : o.resize(e));
    }
  }, o.Pools = s.createObj(), o.PoolId = 1e3, o);

  function o() {
  }

  s.Pool = t, __reflect(t.prototype, "base.Pool");
}(base = base || {}), function (n) {
  var t, o = (t = n.ObjBase, __extends(e, t), Object.defineProperty(e.prototype, "prev", {
    get: function () {
      return this._prev;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(e.prototype, "next", {
    get: function () {
      return this._next;
    }, enumerable: !0, configurable: !0
  }), e.prototype.addToTail = function (e) {
    var t = this;
    return t._prev = e, t._next = e._next, (e._next = t)._next && (t._next._prev = t), t;
  }, e.prototype.remove = function () {
    var e = this;
    return e._prev ? (e._prev._next = e._next, e._next && (e._next._prev = e._prev)) : e._next && (e._next._prev = null), e._prev = e._next = null, e;
  }, e.prototype.setData = function (e) {
    return this.data = e, this;
  }, e.prototype.onAlloc = function () {
  }, e.prototype.onRelease = function () {
    this.remove(), this.data = null;
  }, e.prototype.dispose = function () {
    this.onRelease();
  }, e);

  function e() {
    var e = null !== t && t.apply(this, arguments) || this;
    return e._prev = null, e._next = null, e;
  }

  n.LinkedNode = o, __reflect(o.prototype, "base.LinkedNode", ["base.PoolObject", "base.DisposeObject"]);
  var r, i = (r = n.ObjBase, __extends(s, r), Object.defineProperty(s.prototype, "begin", {
    get: function () {
      return this.head.next;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(s.prototype, "end", {
    get: function () {
      return this.tail;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(s.prototype, "empty", {
    get: function () {
      return this.head.next === this.tail;
    }, enumerable: !0, configurable: !0
  }), s.prototype.push = function (e) {
    return n.Pool.alloc(o).setData(e).addToTail(this.tail.prev);
  }, s.prototype.unshift = function (e) {
    return n.Pool.alloc(o).setData(e).addToTail(this.head);
  }, s.prototype.remove = function (e) {
    var t = this.find(e);
    return !!t && (n.Pool.release(t), !0);
  }, s.prototype.find = function (e) {
    if (!e) return null;
    for (var t = this.begin, o = this.end; t !== o;) {
      if (t.data === e) return t;
      t = t.next;
    }
    return null;
  }, s.prototype.find2 = function (e) {
    if (!e) return null;
    for (var t = this.begin, o = this.end; t !== o;) {
      if (e(t.data)) return t;
      t = t.next;
    }
    return null;
  }, s.prototype.clone = function () {
    for (var e = n.Pool.alloc(s), t = this.begin, o = this.end; t !== o;) e.push(t.data), t = t.next;
    return e;
  }, s.prototype.onAlloc = function () {
  }, s.prototype.onRelease = function () {
    for (var e, t = this.begin, o = this.end; t !== o;) t = (e = t).next, n.Pool.release(e);
  }, s.prototype.dispose = function () {
    this.onRelease(), n.Pool.release(this.head), n.Pool.release(this.tail);
  }, s);

  function s() {
    var e = r.call(this) || this;
    return e.head = n.Pool.alloc(o), e.tail = n.Pool.alloc(o).addToTail(e.head), e;
  }

  n.LinkedList = i, __reflect(i.prototype, "base.LinkedList", ["base.PoolObject", "base.DisposeObject"]);
}(base = base || {}), function (u) {
  var o, e = (o = u.ObjBase, __extends(p, o), p.prototype.init = function (e) {
    var t = this;
    t.__name = e, t.__mdrCls = u.createObj(), t.__mdrIns = u.createObj(), t.__models = u.createObj(), t.__controllers = u.createObj(), t.__remList = u.createObj(), u.facade.regMod(t);
  }, p.prototype.getName = function () {
    return this.__name;
  }, p.prototype.onRegister = function () {
    this.initCmd(), this.initModel(), this.initView();
  }, p.prototype.initCmd = function () {
  }, p.prototype.initModel = function () {
  }, p.prototype.initView = function () {
  }, p.prototype.regCmd = function (e, t) {
    u.facade.onNt(e, this.executeCommand, this), this.__controllers[e] = t;
  }, p.prototype.unregCmd = function (e) {
    delete this.__controllers[e];
  }, p.prototype.regProxy = function (e, t) {
    var o = new t;
    (this.__models[e] = o).initialize();
  }, p.prototype.retProxy = function (e) {
    return this.__models[e];
  }, p.prototype.regMdr = function (e, t) {
    this.__mdrCls[e] = t;
  }, p.prototype.executeCommand = function (e) {
    var t, o = this.__controllers[e.type];
    null != o && ((t = new o).$setOwner(this), t.exec(e));
  }, p.prototype.showView = function (e, t, o) {
    var n, r = this;
    r.__mdrCls[e] && (delete this.__remList[e], (n = r.__mdrIns[e]) || ((n = r.__mdrIns[e] = new r.__mdrCls[e](o)).$setOwner(r), n.$setType(e)), n.show(t));
  }, p.prototype.hideView = function (e) {
    var t;
    !this.__mdrCls[e] || (t = this.__mdrIns[e]) && t.hide();
  }, p.prototype.remMdr = function (e, t) {
    this.__remList[e] = t ? 0 : u.TimeMgr.time.time, this._a || u.TimeMgr.addUpdateItem(this);
  }, p.prototype.onConnectLost = function () {
    for (var e in this.__models) {
      var t = this.__models[e];
      t && t.onStartReconnect();
    }
  }, p.prototype.update = function (e) {
    var t = this, o = p.tmpD;
    o.length = 0;
    var n, r = e.time, i = 0;
    for (var s in t.__remList) r - t.__remList[s] > u.Consts.Mdr_Dispose_T && (o.push(s), n = t.__mdrIns[s], t.__mdrIns[s] = void 0, delete t.__mdrIns[s], n && n.dispose()), i++;
    i === o.length && (u.TimeMgr.removeUpdateItem(t), t._a = !1);
    for (var a = 0, c = o.length; a < c; a++) delete t.__remList[o[a]];
    o.length = 0;
  }, p.tmpD = [], p);

  function p(e) {
    var t = o.call(this) || this;
    return t._a = !1, t.init(e), t;
  }

  u.Mod = e, __reflect(e.prototype, "base.Mod", ["base.UpdateItem"]);
}(base = base || {}), (base = base || {}).Consts = {
  Pool_Size: 30,
  Pool_Unused_T: 5e4,
  Pool_Resize_T: 3e3,
  Mdr_Dispose_T: 3e3
}, function (e) {
  var t, o = (t = e.Notifier, __extends(n, t), Object.defineProperty(n.prototype, "service", {
    get: function () {
      return n.Service;
    }, enumerable: !0, configurable: !0
  }), n.prototype.initialize = function () {
  }, n.prototype.onStartReconnect = function () {
  }, n.prototype.onProto = function (e, t, o) {
    n.Service.onNt(e, t, o);
  }, n.prototype.offProto = function (e, t, o) {
    n.Service.offNt(e, t, o);
  }, n.prototype.sendProto = function (e) {
    n.Service.sendProto(e);
  }, n.Service = new e.GameService, n);

  function n() {
    return null !== t && t.apply(this, arguments) || this;
  }

  e.Proxy = o, __reflect(o.prototype, "base.Proxy", ["base.IProxy"]);
}(base = base || {}), function (i) {
  var t, e = (t = i.ObjBase, __extends(o, t), o.prototype.init = function () {
    var e = this;
    e.socket = new i.Socket, e.socket.onOpen = i.Handler.alloc(e, e.onSocketOpen), e.socket.onClose = i.Handler.alloc(e, e.onSocketClose), e.socket.onError = i.Handler.alloc(e, e.onSocketError), e.socket.onMessage = i.Handler.alloc(e, e.onMessage);
  }, o.prototype.connect = function (e) {
    i.traceProto("connect to:", e), this.socket.connect(e);
  }, Object.defineProperty(o.prototype, "isConnected", {
    get: function () {
      return this.socket.connected;
    }, enumerable: !0, configurable: !0
  }), o.prototype.disconnect = function () {
    if (this.socket) try {
      this.socket.close();
    } catch (e) {
    }
  }, o.prototype.send = function (e) {
    var t;
    null != e && (!this.isConnected || (t = o.encodeMsg(e)) && this.socket.send(t.buffer));
  }, o.prototype.onMessage = function (e) {
    var t = o.decodeMsg(e);
    t && null != this.onMsgReceive && this.onMsgReceive.exec([t]);
  }, o.encodeMsg = function (e) {
    if ("object" != typeof e) return null;
    var t = e.constructor.MsgId;
    if (isNaN(t)) return null;
    if (0 < t) {
      var o = e.constructor.encode(e).finish(), n = new Uint8Array(o.length + 2);
      return new DataView(n.buffer).setUint16(0, t), n.set(o, 2), i.traceProto("发送协议：", e), n;
    }
    return i.traceProto("发送无效的协议：", e), null;
  }, o.decodeMsg = function (e) {
    var t = new DataView(e).getUint16(0), o = new Uint8Array(e, 2), n = i.IdMsg[t];
    if (n && n.decode) try {
      var r = n.decode(o);
      return i.traceProto("接收协议：", r), r;
    } catch (e) {
      return console.error("解析协议出错：id=" + t + ",name=" + i.getClassName(n)), null;
    }
    return i.traceProto("接收到未知协议：id", t), null;
  }, o.prototype.onSocketOpen = function () {
    i.traceProto("on socket open"), this.onCreated && this.onCreated.exec();
  }, o.prototype.onSocketClose = function () {
    i.traceProto("on socket close"), this.onLost && this.onLost.exec();
  }, o.prototype.onSocketError = function () {
    i.traceProto("on socket error"), this.onError && this.onError.exec();
  }, o.prototype.dispose = function () {
    var e = this;
    e.socket && (i.Pool.release(e.onMsgReceive), e.onMsgReceive = void 0, i.Pool.release(e.onCreated), e.onCreated = void 0, i.Pool.release(e.onLost), e.onLost = void 0, i.Pool.release(e.onError), e.onError = void 0, e.disconnect(), e.socket.dispose(), e.socket = void 0);
  }, o);

  function o() {
    var e = t.call(this) || this;
    return e.init(), e;
  }

  i.Connection = e, __reflect(e.prototype, "base.Connection");
}(base = base || {}), function (e) {
  if (e && (!e.TextEncoder || !e.TextDecoder)) {
    var t = (n.prototype.encode = function (e) {
      for (var t = 0, o = e.length, n = 0, r = Math.max(32, o + (o >> 1) + 7), i = new Uint8Array(r >> 3 << 3); t < o;) {
        var s, a, c = e.charCodeAt(t++);
        if (!(55296 <= c && c <= 56319 && (t < o && 56320 == (64512 & (s = e.charCodeAt(t))) && (++t, c = ((1023 & c) << 10) + (1023 & s) + 65536), 55296 <= c && c <= 56319))) if (n + 4 > i.length && (r += 8, r = (r *= 1 + t / e.length * 2) >> 3 << 3, (a = new Uint8Array(r)).set(i), i = a), 0 != (4294967168 & c)) {
          if (0 == (4294965248 & c)) i[n++] = c >> 6 & 31 | 192; else if (0 == (4294901760 & c)) i[n++] = c >> 12 & 15 | 224, i[n++] = c >> 6 & 63 | 128; else {
            if (0 != (4292870144 & c)) continue;
            i[n++] = c >> 18 & 7 | 240, i[n++] = c >> 12 & 63 | 128, i[n++] = c >> 6 & 63 | 128;
          }
          i[n++] = 63 & c | 128;
        } else i[n++] = c;
      }
      return i.slice(0, n);
    }, n), o = (r.prototype.decode = function (e, t) {
      if (void 0 === t && (t = { stream: !1 }), t.stream) throw new Error("Failed to decode: the 'stream' option is unsupported.");
      for (var o = new Uint8Array(e), n = 0, r = o.length, i = []; n < r;) {
        var s, a, c, u = o[n++];
        if (0 === u) break;
        0 == (128 & u) ? i.push(String.fromCharCode(u)) : 192 == (224 & u) ? (s = 63 & o[n++], i.push(String.fromCharCode((31 & u) << 6 | s))) : 224 == (240 & u) ? (s = 63 & o[n++], a = 63 & o[n++], i.push(String.fromCharCode((31 & u) << 12 | s << 6 | a))) : 240 == (248 & u) && (65535 < (c = (7 & u) << 18 | (s = 63 & o[n++]) << 12 | (a = 63 & o[n++]) << 6 | 63 & o[n++]) && (c -= 65536, i.push(String.fromCharCode(c >>> 10 & 1023 | 55296)), c = 56320 | 1023 & c), i.push(String.fromCharCode(c)));
      }
      return i.join("");
    }, r);
    return e.TextEncoder = t, e.TextDecoder = o;
  }

  function n(e) {
    if (void 0 === e && (e = "utf-8"), (this.encoding = "utf-8") !== e) throw new RangeError("Failed to construct 'TextEncoder': The encoding label provided ('" + e + "') is invalid.");
  }

  function r(e, t) {
    if (void 0 === e && (e = "utf-8"), void 0 === t && (t = { fatal: !1 }), this.encoding = "utf-8", this.fatal = !1, this.ignoreBOM = !1, "utf-8" !== e) throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('" + e + "') is invalid.");
    if (t.fatal) throw new Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");
  }
}("undefined" != typeof window ? window : "undefined" != typeof global ? global : null), function (e) {
  var t, o = (t = e.Notifier, __extends(n, t), n.prototype.exec = function (e) {
  }, n.prototype.retProxy = function (e) {
    return this.owner.retProxy(e);
  }, n.prototype.$setOwner = function (e) {
    this.owner = e;
  }, n);

  function n() {
    return null !== t && t.apply(this, arguments) || this;
  }

  e.Cmd = o, __reflect(o.prototype, "base.Cmd");
}(base = base || {}), function (t) {
  var e = (Object.defineProperty(o.prototype, "connected", {
    get: function () {
      return this._connected;
    }, enumerable: !0, configurable: !0
  }), o.prototype.connect = function (e) {
    var t = this;
    if (!t._connected && !t._connecting) {
      t._url = e, t._connecting = !0;
      try {
        t._createT = Date.now();
        var o = t.socket = new WebSocket(e);
        o.binaryType = "arraybuffer", t._bindEvent(o);
      } catch (e) {
        t.onWSCtorError(e);
      }
    }
  }, o.prototype.close = function () {
    this._connected && (this.releaseWS(), this.onClose && this.onClose.exec());
  }, o.prototype.send = function (e) {
    this._connected && this.socket.send(e);
  }, o.prototype._bindEvent = function (e) {
    var t = this;
    e.onopen = function (e) {
      return t.onWSOpen(e);
    }, e.onclose = function (e) {
      return t.onWSClose(e);
    }, e.onerror = function (e) {
      return t.onWSError(e);
    }, e.onmessage = function (e) {
      return t.onWSMessage(e);
    };
  }, o.prototype.onWSCtorError = function (e) {
    console.error(e), this.releaseWS(), e && e.message && -1 < e.message.indexOf("url not in domain list") && ggo.onUrlNotInDomainList ? ggo.onUrlNotInDomainList() : this.onError && this.onError.exec();
  }, o.prototype.onWSOpen = function (e) {
    var t = this;
    console.info("open connection cost:", Date.now() - t._createT), t._connected = !0, t._connecting = !1, t.onOpen && t.onOpen.exec();
  }, o.prototype.onWSClose = function (e) {
    1e3 !== e.code && 1006 !== e.code && console.error("WebSocket close:", "code:" + e.code, "reason:" + e.reason), this.releaseWS(), this.onClose && this.onClose.exec();
  }, o.prototype.onWSError = function (e) {
    var t = this;
    t.socket.readyState !== WebSocket.CLOSED && t.socket.readyState !== WebSocket.CLOSING && console.error("WebSocket", t._url, "error:", e), t.releaseWS(), t.onError && t.onError.exec();
  }, o.prototype.onWSMessage = function (e) {
    var t = e.data, o = t;
    "string" == typeof t && (o = (new TextEncoder).encode(t).buffer), this.onMessage && this.onMessage.exec(o);
  }, o.prototype.releaseWS = function () {
    this._connected = !1, this._connecting = !1;
    var e = this.socket;
    if (this.socket = null, e && (e.onopen = e.onclose = e.onerror = e.onmessage = null, e.readyState !== WebSocket.CLOSED && e.readyState !== WebSocket.CLOSING)) try {
      e.close();
    } catch (e) {
    }
  }, o.prototype.dispose = function () {
    var e = this;
    e.releaseWS(), e.onMessage = t.Pool.release(e.onMessage), e.onOpen = t.Pool.release(e.onOpen), e.onClose = t.Pool.release(e.onClose), e.onError = t.Pool.release(e.onError);
  }, o);

  function o() {
    this._connected = !1, this._connecting = !1;
  }

  t.Socket = e, __reflect(e.prototype, "base.Socket");
}(base = base || {}), function (a) {
  var e = (t.prototype.regMod = function (e) {
    (this._moduleMap[e.getName()] = e).onRegister();
  }, t.prototype.retMod = function (e) {
    var t = this._moduleMap[e];
    return t || console.error("retMod " + e + " undefined exists:" + Object.keys(this._moduleMap).join(",")), t;
  }, t.prototype.showView = function (e, t, o, n) {
    var r = this._moduleMap[e];
    r && r.showView(t, o, n);
  }, t.prototype.hideView = function (e, t) {
    var o = this._moduleMap[e];
    o && o.hideView(t);
  }, t.prototype.sendNt = function (e, t) {
    var o = this._observerMap[e];
    if (null != o) {
      o = o.clone();
      for (var n, r = a.GameNT.alloc(e, t), i = o.begin, s = o.end; i != s;) n = i.data, i = i.next, n.exec(r);
      a.Pool.release(o), a.Pool.release(r);
    }
  }, t.prototype.onNt = function (e, t, o) {
    var n = this._observerMap[e];
    if (null == n) n = this._observerMap[e] = a.Pool.alloc(a.LinkedList); else if (n.find2(function (e) {
      return a.Handler.equalMethod(e, t, o);
    })) return;
    n.push(a.Handler.alloc(o, t));
  }, t.prototype.offNt = function (e, t, o) {
    var n, r, i = this._observerMap[e];
    null == i || (n = i.find2(function (e) {
      return a.Handler.equalMethod(e, t, o);
    })) && (r = n.data, a.Pool.release(r), a.Pool.release(n));
  }, t.prototype.onConnectLost = function () {
    for (var e in this._moduleMap) this._moduleMap[e].onConnectLost();
  }, t);

  function t() {
    this._moduleMap = a.createObj(), this._observerMap = a.createObj();
  }

  a.Facade = e, __reflect(e.prototype, "base.Facade"), a.facade = new e;
}(base = base || {}), function (n) {
  var e, t = (e = n.ObjBase, __extends(r, e), r.alloc = function (e, t) {
    var o = n.Pool.alloc(r);
    return o._type = e, o._body = t, o;
  }, Object.defineProperty(r.prototype, "type", {
    get: function () {
      return this._type;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(r.prototype, "body", {
    get: function () {
      return this._body;
    }, enumerable: !0, configurable: !0
  }), r.prototype.onAlloc = function () {
  }, r.prototype.onRelease = function () {
    this._type = null, this._body = null;
  }, r.prototype.dispose = function () {
    this.onRelease();
  }, r);

  function r() {
    return null !== e && e.apply(this, arguments) || this;
  }

  n.GameNT = t, __reflect(t.prototype, "base.GameNT", ["base.PoolObject", "base.DisposeObject"]);
}(base = base || {}), (base || (base = {})).getClassName = function (e) {
  var t = typeof e;
  if (!e) return t;
  if ("object" != t && !e.prototype) return t;
  var o = e.prototype ? e.prototype : Object.getPrototypeOf(e), n = o.__class__;
  return n || (n = o.constructor.name, Object.defineProperty(o, "__class__", {
    configurable: !1,
    enumerable: !1,
    writable: !1,
    value: n
  })), n;
}, function (t) {
  t.getProtoName = function (e) {
    return "string" == typeof e ? e : t.getClassName(e);
  };
}(base = base || {}), function (o) {
  var e = (Object.defineProperty(t.prototype, "time", {
    get: function () {
      return this._time;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(t.prototype, "serverTime", {
    get: function () {
      if (0 == this._serverTimeInit) return 0;
      var e = o.now() - this._localTimeInit;
      return 1e3 * this._serverStartTime + 10 * this._serverTimeInit + e;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(t.prototype, "serverTimeSecond", {
    get: function () {
      if (0 == this._serverTimeInit) return 0;
      var e = Math.floor((o.now() - this._localTimeInit) / 1e3);
      return this._serverStartTime + Math.floor(this._serverTimeInit / 100) + e;
    }, enumerable: !0, configurable: !0
  }), t.prototype.__update = function () {
    this._time = o.now();
  }, t.prototype.__setServerTime = function (e, t) {
    void 0 === t && (t = 0), 0 != t && (this._serverStartTime = t), this._localTimeInit = o.now(), this._serverTimeInit = e;
  }, t);

  function t() {
    this._serverStartTime = 0, this._serverTimeInit = 0, this._localTimeInit = 0, this._time = o.now();
  }

  o.Time = e, __reflect(e.prototype, "base.Time");
}(base = base || {}), function (a) {
  var t = egret.ticker, c = "__updateData__", e = (o.init = function () {
    o._instance || (o._instance = new o);
  }, Object.defineProperty(o, "isActivate", {
    get: function () {
      return this._instance._isActivate;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(o, "time", {
    get: function () {
      return this._instance._time;
    }, enumerable: !0, configurable: !0
  }), o.addUpdateItem = function (e, t) {
    var o, n;
    void 0 === t && (t = 0), null == this._instance._itemList.find(e) && (o = new r(this._instance._time.time), 0 | +t || (n = egret.lifecycle.stage.frameRate, t = Math.floor(1e3 / n)), o.interval = t, e[c] = o, this._instance._itemList.push(e));
  }, o.removeUpdateItem = function (e) {
    null != this._instance._itemList.find(e) && (e[c] = void 0, this._instance._itemList.remove(e));
  }, o.hasUpdateItem = function (e) {
    return null != this._instance._itemList.find(e);
  }, o.setServerTime = function (e, t) {
    void 0 === t && (t = 0), this._instance._time.__setServerTime(e, t);
  }, o.getCount = function (e) {
    return null == this._instance._itemList.find(e) ? 0 : e[c]._updateCnt;
  }, o.getElapseTime = function (e) {
    return null == this._instance._itemList.find(e) ? 0 : e[c]._elapseTime;
  }, o.setWorker = function (e) {
    var t = o._instance;
    e && (t._worker = e, t._worker.onmessage = t.onTimeout);
  }, o.prototype.onTimeout = function () {
    var e = o._instance;
    a.now() - e._lastUpdate < 30 || e.onUpdate();
  }, o.prototype.onUpdate = function () {
    var e = this, t = a.now();
    if (!(t - e._lastUpdate < 16)) {
      e._lastUpdate = t, e._time.__update();
      for (var o, n = e._itemList.clone(), r = n.begin, i = n.end; r != i;) {
        o = r.data, r = r.next;
        var s = o[c];
        if (s && (s.clac(e._time.time), 0 < s._updateCnt)) try {
          o.update(e._time);
        } catch (e) {
          console.error("update at " + a.getClassName(o), e);
        }
      }
      a.Pool.release(n), a.Tween.onTick(e._time), a.Pool.checkUnused();
    }
  }, o.prototype.onPause = function () {
    var e = o._instance;
    e._isActivate = !1, e._worker && e._worker.postMessage("start"), o.needPause && t.pause();
  }, o.prototype.onResume = function () {
    var e = o._instance;
    e._worker && e._worker.postMessage("stop"), e._isActivate = !0, t.resume();
  }, o.needPause = !0, o);

  function o() {
    var t = this;
    this._isActivate = !0, this._lastUpdate = 0, this._time = new a.Time, this._itemList = a.Pool.alloc(a.LinkedList), egret.lifecycle.addLifecycleListener(function (e) {
      e.onUpdate = function () {
        t.onUpdate();
      };
    }), egret.lifecycle.onPause = this.onPause, egret.lifecycle.onResume = this.onResume;
  }

  a.TimeMgr = e, __reflect(e.prototype, "base.TimeMgr");
  var r = (n.prototype.clac = function (e) {
    var t = this, o = 0;
    t._elapseTime = e - t._updateTime, 0 < (o = 0 == t.interval ? 1 : Math.floor(t._elapseTime / t.interval)) && (t._updateTime = e), t._updateCnt = o;
  }, n);

  function n(e) {
    this._updateCnt = 0, this._updateTime = e;
  }

  __reflect(r.prototype, "UpdateData");
}(base = base || {}), function (n) {
  var e, r = (e = n.ObjBase, __extends(t, e), t.prototype.dispose = function () {
    this.onRelease();
  }, t.prototype.onAlloc = function () {
  }, t.prototype.onRelease = function () {
    n.Pool.release(this.handler), this.handler = null;
  }, t);

  function t() {
    return null !== e && e.apply(this, arguments) || this;
  }

  __reflect(r.prototype, "DelayItem", ["base.PoolObject", "base.DisposeObject"]);
  var o = (i.add = function (e, t) {
    var o = n.Pool.alloc(r);
    return o.idx = ++this.index, o.end = n.TimeMgr.time.time + t, o.handler = e, this.items[o.idx] = o, this.cnt++, this.check(), o.idx;
  }, i.rem = function (e) {
    var t = this.items[e];
    t && (this.cnt--, this.items[e] = null, delete this.items[e], n.Pool.release(t), this.check());
  }, i.check = function () {
    var e = this;
    if (0 < e.cnt) {
      if (e.added) return;
      return e.added = !0, void n.TimeMgr.addUpdateItem(e);
    }
    e.added && (e.added = !1, n.TimeMgr.removeUpdateItem(e));
  }, i.update = function (e) {
    var t = this._tmpDel, o = 0;
    for (var n in this.items) {
      var r = this.items[n];
      !r || e.time < r.end || (r.handler.exec(), t[o++] = r.idx);
    }
    for (var i = 0, s = t.length; i < s; i++) {
      var a = t[i];
      a && this.rem(a), t[i] = 0;
    }
  }, i.index = 10, i.items = n.createObj(), i.added = !1, i.cnt = 0, i._tmpDel = new Array(100), i);

  function i() {
  }

  __reflect(o.prototype, "Timeout"), n.delayCall = function (e, t) {
    return o.add(e, 0 | +t);
  }, n.clearDelay = function (e) {
    0 !== e && o.rem(e);
  };
}(base = base || {}), function (p) {
  var e = (l.get = function (e, t) {
    return void 0 === t && (t = null), e ? (new l)._init(e, t) : (console.error(new Error("Tween.get target:" + e)), null);
  }, l.remove = function (t) {
    function e(e) {
      return e && e._target === t;
    }

    for (var o = this._tweens.find2(e); o;) {
      var n = o.data;
      n.dispose(), this._tweens.remove(n), o = this._tweens.find2(e);
    }
  }, l.onTick = function (e) {
    var t = e.time - this._lastTick;
    this._lastTick = e.time;
    for (var o = this._tweens.clone(), n = o.begin, r = o.end, i = this._tmpDel, s = 0; n != r;) {
      var a = n.data, n = n.next;
      a.advanceTime(t), a._isComplete && (i[s++] = a);
    }
    for (var c = 0, u = i.length; c < u; c++) (a = i[c]) && (a.dispose(), this._tweens.remove(a)), i[c] = null;
    p.Pool.release(o);
  }, l._reg = function (e) {
    this._tweens.push(e);
  }, l._checkDuration = function (e) {
    return (e = 0 | +e) < 0 && (e = 0), e;
  }, l._parseVars = function (e) {
    var t = p.createObj();
    for (var o in e) {
      var n = e[o];
      "number" == typeof n && (t[o] = n);
    }
    return t;
  }, l.copyFrom = function (e, t) {
    var o = p.createObj();
    for (var n in e) o[n] = t[n];
    return o;
  }, l.prototype._init = function (e, t) {
    void 0 === t && (t = null);
    var o = this;
    return o._target = e, o._loop = t && t.loop, o._curIdx = 0, o._curTime = 0, o._isComplete = !1, l._reg(o), o;
  }, l.prototype.to = function (e, t, o, n) {
    if (void 0 === o && (o = null), void 0 === n && (n = p.Linear.easeNone), !e) return this;
    n = n || p.Linear.easeNone, t = l._checkDuration(t);
    var r = this.getTotalTime(), i = l._parseVars(e);
    return this._steps.push({ st: r, et: r + t, to: i, e: n, h: o }), this;
  }, l.prototype.from = function (e, t, o, n) {
    if (void 0 === o && (o = null), void 0 === n && (n = p.Linear.easeNone), !e) return this;
    n = n || p.Linear.easeNone, t = l._checkDuration(t);
    var r = this.getTotalTime(), i = l._parseVars(e);
    return this._steps.push({ st: r, et: r + t, from: i, e: n, h: o }), this;
  }, l.prototype.delay = function (e) {
    e = l._checkDuration(e);
    var t = this.getTotalTime();
    return this._steps.push({ st: t, et: t + e }), this;
  }, l.prototype.exec = function (e) {
    var t = this.getTotalTime();
    return this._steps.push({ st: t, et: t, h: e }), this;
  }, l.prototype.getTotalTime = function () {
    var e = this._steps;
    return e.length ? e[e.length - 1].et : 0;
  }, l.prototype.applyCur = function (e) {
    void 0 === e && (e = !1);
    var t = this, o = t._steps[t._curIdx];
    if (o) {
      if (e) {
        if (!o.to && !o.from) return void (o.h && o.h.exec());
        o.from || (o.from = l.copyFrom(o.to, t._target)), o.to || (o.to = l.copyFrom(o.from, t._target));
      }
      if (o.from) {
        var n = t._curTime > o.et ? o.et : t._curTime, r = o.et - o.st, i = n - o.st;
        for (var s in o.to) {
          var a = o.from[s], c = o.to[s], u = o.e(i, a, c - a, r);
          t._target[s] = u;
        }
        o.h && o.h.exec();
      }
    }
  }, l.prototype.advanceTime = function (e) {
    var t = this;
    if (!(e <= 0 || t._isComplete)) {
      var o = t._steps.length - 1;
      if (!(o < 0)) {
        var n = t.getTotalTime();
        if (t._loop && t._curTime >= n && (t._curTime = 0, t._curIdx = 0), t._target && t._target.hasOwnProperty("$stage") && !t._target.$stage && (t._errCnt++, 120 < t._errCnt && (t.printError(), t._errCnt = -6e4)), t.applyCur(0 === t._curTime), t._curTime < n) {
          t._curTime += e, t.applyCur();
          for (var r = t._steps[t._curIdx]; r && t._curTime >= r.et;) {
            if (t._curIdx === o) {
              if (!t._loop) {
                t._isComplete = !0, t._curTime = n;
                break;
              }
              t._curTime -= n, t._curIdx = 0;
            } else t._curIdx++, t.applyCur(!0);
            r = t._steps[t._curIdx];
          }
          t._curIdx === o && t._curTime === n && (t._isComplete = !0);
        }
      }
    }
  }, l.prototype.printError = function () {
    for (var e = this._target; e.parent && !e.__mdr__;) e = e.parent;
    console.error("Tween target stage is null!!!", "view:" + p.getClassName(e), "target:" + p.getClassName(this._target));
  }, l.prototype.dispose = function () {
    for (var e = this._errCnt = 0, t = this._steps; e < t.length; e++) {
      var o = t[e];
      p.Pool.release(o.h), o.h = null;
    }
    this._steps.length = 0, this._target = null;
  }, l._tweens = p.Pool.alloc(p.LinkedList), l._lastTick = 0, l._tmpDel = new Array(100), l);

  function l() {
    this._target = null, this._loop = !1, this._steps = [], this._curIdx = 0, this._curTime = 0, this._isComplete = !1, this._errCnt = 0;
  }

  p.Tween = e, __reflect(e.prototype, "base.Tween");
}(base = base || {}), function (e) {
  var t = (o.easeIn = function (e, t, o, n, r) {
    return void 0 === r && (r = 1.70158), o * (e /= n) * e * ((r + 1) * e - r) + t;
  }, o.easeOut = function (e, t, o, n, r) {
    return void 0 === r && (r = 1.70158), o * ((e = e / n - 1) * e * ((r + 1) * e + r) + 1) + t;
  }, o.easeInOut = function (e, t, o, n, r) {
    return void 0 === r && (r = 1.70158), (e /= .5 * n) < 1 ? .5 * o * (e * e * ((1 + (r *= 1.525)) * e - r)) + t : o / 2 * ((e -= 2) * e * ((1 + (r *= 1.525)) * e + r) + 2) + t;
  }, o.easeOutExtra = function (e, t, o, n, r) {
    return void 0 === r && (r = 8), o * ((e = e / n - 1) * e * ((r + 1) * e + r) + 1) + t;
  }, o);

  function o() {
  }

  e.Back = t, __reflect(t.prototype, "base.Back");
  var n = (r.easeOut = function (e, t, o, n) {
    return (e /= n) < 1 / 2.75 ? o * (7.5625 * e * e) + t : e < 2 / 2.75 ? o * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + t : e < 2.5 / 2.75 ? o * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + t : o * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + t;
  }, r.easeIn = function (e, t, o, n) {
    return o - r.easeOut(n - e, 0, o, n) + t;
  }, r.easeInOut = function (e, t, o, n) {
    return e < .5 * n ? .5 * r.easeIn(2 * e, 0, o, n) + t : .5 * r.easeOut(2 * e - n, 0, o, n) + .5 * o + t;
  }, r);

  function r() {
  }

  e.Bounce = n, __reflect(n.prototype, "base.Bounce");
  var i = (s.easeIn = function (e, t, o, n) {
    return -o * (Math.sqrt(1 - (e /= n) * e) - 1) + t;
  }, s.easeOut = function (e, t, o, n) {
    return o * Math.sqrt(1 - (e = e / n - 1) * e) + t;
  }, s.easeInOut = function (e, t, o, n) {
    return (e /= .5 * n) < 1 ? .5 * -o * (Math.sqrt(1 - e * e) - 1) + t : .5 * o * (Math.sqrt(1 - (e -= 2) * e) + 1) + t;
  }, s);

  function s() {
  }

  e.Circ = i, __reflect(i.prototype, "base.Circ");
  var a = (c.easeIn = function (e, t, o, n) {
    return o * (e /= n) * e * e + t;
  }, c.easeOut = function (e, t, o, n) {
    return o * ((e = e / n - 1) * e * e + 1) + t;
  }, c.easeInOut = function (e, t, o, n) {
    return (e /= .5 * n) < 1 ? .5 * o * e * e * e + t : .5 * o * ((e -= 2) * e * e + 2) + t;
  }, c.power = 2, c);

  function c() {
  }

  e.Cubic = a, __reflect(a.prototype, "base.Cubic");
  var u = (p.easeIn = function (e, t, o, n, r, i) {
    var s;
    return void 0 === r && (r = 0), void 0 === i && (i = 0), 0 == e ? t : 1 == (e /= n) ? t + o : (i = i || .3 * n, s = !r || 0 < o && r < o || o < 0 && r < -o ? (r = o, i / 4) : i / p._2PI * Math.asin(o / r), -(r * Math.pow(2, 10 * --e) * Math.sin((e * n - s) * p._2PI / i)) + t);
  }, p.easeOut = function (e, t, o, n, r, i) {
    var s;
    return void 0 === r && (r = 0), void 0 === i && (i = 0), 0 == e ? t : 1 == (e /= n) ? t + o : (i = i || .3 * n, s = !r || 0 < o && r < o || o < 0 && r < -o ? (r = o, i / 4) : i / p._2PI * Math.asin(o / r), r * Math.pow(2, -10 * e) * Math.sin((e * n - s) * p._2PI / i) + o + t);
  }, p.easeInOut = function (e, t, o, n, r, i) {
    var s;
    return void 0 === r && (r = 0), void 0 === i && (i = 0), 0 == e ? t : 2 == (e /= .5 * n) ? t + o : (i = i || n * (.3 * 1.5), s = !r || 0 < o && r < o || o < 0 && r < -o ? (r = o, i / 4) : i / p._2PI * Math.asin(o / r), e < 1 ? r * Math.pow(2, 10 * --e) * Math.sin((e * n - s) * p._2PI / i) * -.5 + t : r * Math.pow(2, -10 * --e) * Math.sin((e * n - s) * p._2PI / i) * .5 + o + t);
  }, p._2PI = 2 * Math.PI, p);

  function p() {
  }

  e.Elastic = u, __reflect(u.prototype, "base.Elastic");
  var l = (_.easeIn = function (e, t, o, n) {
    return 0 == e ? t : o * Math.pow(2, 10 * (e / n - 1)) + t - .001 * o;
  }, _.easeOut = function (e, t, o, n) {
    return e == n ? t + o : o * (1 - Math.pow(2, -10 * e / n)) + t;
  }, _.easeInOut = function (e, t, o, n) {
    return 0 == e ? t : e == n ? t + o : (e /= .5 * n) < 1 ? .5 * o * Math.pow(2, 10 * (e - 1)) + t : .5 * o * (2 - Math.pow(2, -10 * --e)) + t;
  }, _);

  function _() {
  }

  e.Expo = l, __reflect(l.prototype, "base.Expo");
  var f = (d.easeIn = function (e, t, o, n) {
    return -o * Math.cos(e / n * d._HALF_PI) + o + t;
  }, d.easeOut = function (e, t, o, n) {
    return o * Math.sin(e / n * d._HALF_PI) + t;
  }, d.easeInOut = function (e, t, o, n) {
    return .5 * -o * (Math.cos(Math.PI * e / n) - 1) + t;
  }, d._HALF_PI = .5 * Math.PI, d);

  function d() {
  }

  e.IntegerSine = f, __reflect(f.prototype, "base.IntegerSine");
  var h = (y.easeNone = function (e, t, o, n) {
    return o * e / n + t;
  }, y.easeIn = function (e, t, o, n) {
    return o * e / n + t;
  }, y.easeOut = function (e, t, o, n) {
    return o * e / n + t;
  }, y.easeInOut = function (e, t, o, n) {
    return o * e / n + t;
  }, y.power = 0, y);

  function y() {
  }

  e.Linear = h, __reflect(h.prototype, "base.Linear");
  var v = (m.easeIn = function (e, t, o, n) {
    return o * (e /= n) * e + t;
  }, m.easeOut = function (e, t, o, n) {
    return -o * (e /= n) * (e - 2) + t;
  }, m.easeInOut = function (e, t, o, n) {
    return (e /= .5 * n) < 1 ? .5 * o * e * e + t : .5 * -o * (--e * (e - 2) - 1) + t;
  }, m.power = 1, m);

  function m() {
  }

  e.Quad = v, __reflect(v.prototype, "base.Quad");
  var b = (g.easeIn = function (e, t, o, n) {
    return o * (e /= n) * e * e * e + t;
  }, g.easeOut = function (e, t, o, n) {
    return -o * ((e = e / n - 1) * e * e * e - 1) + t;
  }, g.easeInOut = function (e, t, o, n) {
    return (e /= .5 * n) < 1 ? .5 * o * e * e * e * e + t : .5 * -o * ((e -= 2) * e * e * e - 2) + t;
  }, g.power = 3, g);

  function g() {
  }

  e.Quart = b, __reflect(b.prototype, "base.Quart");
  var w = (O.easeIn = function (e, t, o, n) {
    return o * (e /= n) * e * e * e * e + t;
  }, O.easeOut = function (e, t, o, n) {
    return o * ((e = e / n - 1) * e * e * e * e + 1) + t;
  }, O.easeInOut = function (e, t, o, n) {
    return (e /= .5 * n) < 1 ? .5 * o * e * e * e * e * e + t : .5 * o * ((e -= 2) * e * e * e * e + 2) + t;
  }, O.power = 4, O);

  function O() {
  }

  e.Quint = w, __reflect(w.prototype, "base.Quint");
  var P = (T.easeIn = function (e, t, o, n) {
    return -o * Math.cos(e / n * T._HALF_PI) + o + t;
  }, T.easeOut = function (e, t, o, n) {
    return o * Math.sin(e / n * T._HALF_PI) + t;
  }, T.easeInOut = function (e, t, o, n) {
    return .5 * -o * (Math.cos(Math.PI * e / n) - 1) + t;
  }, T._HALF_PI = .5 * Math.PI, T);

  function T() {
  }

  e.Sine = P, __reflect(P.prototype, "base.Sine");
  var C = (x.easeIn = function (e, t, o, n) {
    return o * (e /= n) * e * e * e * e + t;
  }, x.easeOut = function (e, t, o, n) {
    return o * ((e = e / n - 1) * e * e * e * e + 1) + t;
  }, x.easeInOut = function (e, t, o, n) {
    return (e /= .5 * n) < 1 ? .5 * o * e * e * e * e * e + t : .5 * o * ((e -= 2) * e * e * e * e + 2) + t;
  }, x.power = 4, x);

  function x() {
  }

  e.Strong = C, __reflect(C.prototype, "base.Strong");
}(base = base || {}), function (s) {
  var e, t = (e = s.ObjBase, __extends(r, e), r.alloc = function (e, t, o, n) {
    return void 0 === o && (o = null), void 0 === n && (n = !1), s.Pool.alloc(r).set(r._guid++, e, t, o || [], !!n);
  }, r.equalMethod = function (e, t, o) {
    return !(!e || !t) && e._method === t && e._context === o;
  }, r.equal = function (e, t) {
    return !(!e || !t) && e._method === t._method && e._context === t._context;
  }, Object.defineProperty(r.prototype, "context", {
    get: function () {
      return this._context;
    }, enumerable: !0, configurable: !0
  }), Object.defineProperty(r.prototype, "method", {
    get: function () {
      return this._method;
    }, enumerable: !0, configurable: !0
  }), r.prototype.set = function (e, t, o, n, r) {
    var i = this;
    return i._id = e, i._context = t, i._method = o, i._args = n, i._once = r, i;
  }, r.prototype.exec = function (e) {
    var t = this;
    if (!t._method) return null;
    var o = t._id, n = null == e ? t._args : (t._args || e.unshift) && t._args ? t._args.concat(e) : e,
      r = t.doExec(t._context, t._method, n);
    return t._id === o && t._once && s.Pool.release(t), r;
  }, r.prototype.doExec = function (t, o, e) {
    var n = null;
    try {
      n = o.apply(t, e);
    } catch (e) {
      var r = [];
      if (t) {
        for (var i in t) if (t[i] === o) {
          r[r.length] = i + " at " + s.getClassName(t);
          break;
        }
        r.length || (r[r.length] = s.getClassName(t));
      }
      e && (r[r.length] = e), console.error.apply(console, r);
    }
    return n;
  }, r.prototype.dispose = function () {
    this.onRelease();
  }, r.prototype.onAlloc = function () {
  }, r.prototype.onRelease = function () {
    this._context = null, this._method = null, this._args = void 0, this._once = !1;
  }, r._guid = 1, r);

  function r() {
    return null !== e && e.apply(this, arguments) || this;
  }

  s.Handler = t, __reflect(t.prototype, "base.Handler", ["base.PoolObject", "base.DisposeObject"]);
}(base = base || {}), function (r) {
  var o, e = (o = r.Notifier, __extends(t, o), Object.defineProperty(t.prototype, "name", {
    get: function () {
      return this.__mdrName;
    }, enumerable: !0, configurable: !0
  }), t.prototype.$setOwner = function (e) {
    this._owner = e;
  }, t.prototype.$setType = function (e) {
    this.__viewType = e;
  }, t.prototype.mark = function (e, t) {
    this.__viewKey = { key: e, type: t };
  }, t.prototype.newView = function () {
    var e = this;
    e.__viewKey && e.__viewKey && (e[e.__viewKey.key] = new e.__viewKey.type);
  }, t.prototype.getView = function () {
    if (this.__viewKey) return this[this.__viewKey.key];
  }, t.prototype.onNt = function (e, t, o) {
    var n = this.__ntHandler[e];
    r.Handler.equalMethod(n, t, o) || (this.__ntHandler[e] = r.Handler.alloc(o, t), r.facade.onNt(e, this.notifyObservers, this));
  }, t.prototype.offNt = function (e) {
    var t = this.__ntHandler[e];
    delete this.__ntHandler[e], r.Pool.release(t), r.facade.offNt(e, this.notifyObservers, this);
  }, t.prototype.onEgret = function (e, t, o, n) {
    var r;
    e && t && o && (r = {
      target: e,
      type: t,
      listener: o,
      thisObject: n = n || this
    }, this.__egretHandler.push(r), e.addEventListener(t, o, n));
  }, t.prototype.offEgret = function (e, t, o, n) {
    if (e && t && o) {
      n = n || this, e.removeEventListener(t, o, n);
      for (var r = this.__egretHandler, i = 0, s = r.length; i < s; i++) {
        var a = r[i];
        a && a.target === e && a.type === t && a.listener === o && (r.splice(i, 1), i--, s--);
      }
    }
  }, t.prototype.notifyObservers = function (e) {
    var t = this.__ntHandler[e.type];
    t && t.exec(e);
  }, t.prototype.show = function (e) {
    this.__show = !0, this._showArgs = e, this.doShow();
  }, t.prototype.doShow = function () {
    var t = this;
    if (t.__show) {
      t.__viewInit || (t.__viewInit = !0, t.newView(), Object.defineProperty(t.getView(), "__mdr__", {
        value: t,
        enumerable: !1,
        writable: !0
      }), t.onAssetLoaded(), t.onInit()), t.__parent.addChild(t.getView()), t.addListeners();
      try {
        t.onShow();
      } catch (e) {
        t.onErr("onShow", e);
      }
    }
  }, t.prototype.hide = function (e) {
    void 0 === e && (e = !1), this.doHide(e);
  }, t.prototype.doHide = function (e) {
    var t = this;
    if (t.__show) {
      for (var o in t.__show = !1, t.__ntHandler) t.offNt(o);
      for (var n = this.__egretHandler; n.length;) {
        var r = n.pop();
        r && r.target.removeEventListener(r.type, r.listener, r.thisObject);
      }
      var i = t.getView();
      i && i.parent && i.parent.removeChild(i);
      try {
        this.onHide();
      } catch (e) {
        this.onErr("onHide", e);
      } finally {
        this._showArgs = null, this._owner.remMdr(this.__viewType, e);
      }
    }
  }, t.prototype.dispose = function () {
  }, t.prototype.onErr = function (e, t) {
    console.error(e + " at " + this.__mdrName, t);
  }, t.prototype.onAssetLoaded = function () {
  }, t.prototype.onInit = function () {
  }, t.prototype.addListeners = function () {
  }, t.prototype.onShow = function () {
  }, t.prototype.onHide = function () {
  }, t.prototype.showView = function (e, t) {
    this._owner.showView(e, t);
  }, t.prototype.retProxy = function (e) {
    return this._owner.retProxy(e);
  }, t);

  function t(e) {
    var t = o.call(this) || this;
    return t.isEasyHide = !1, t.__show = !1, t.__parent = e, t.__mdrName = r.getClassName(t), t.__ntHandler = r.createObj(), t.__egretHandler = [], t;
  }

  r.Mdr = e, __reflect(e.prototype, "base.Mdr", ["base.DisposeObject"]);
}(base = base || {});
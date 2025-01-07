/**
 * @date 2025/1/4
 */

function getQualifiedClassName(value: any) {
  const type = typeof value;
  if (!value || (type !== "object" && !value.prototype)) {
    return type;
  }

  const prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
  if (prototype.hasOwnProperty("__class__") && prototype["__class__"]) {
    return prototype["__class__"];
  } else if (type === "function" && value.name) {
    return value.name;
  } else if (prototype.constructor && prototype.constructor.name) {
    return prototype.constructor.name;
  }

  const constructorString = prototype.constructor.toString().trim();
  const index = constructorString.indexOf("(");
  const className = constructorString.substring(9, index);
  Object.defineProperty(prototype, "__class__", {
    value: className,
    enumerable: false,
    writable: true
  });
  return className;
}

const PoolObjectName = "PoolObjectName";

class PoolMgr {
  private _poolMap: any = {};

  /**
   * @param cls
   * @param args
   */
  public alloc<T>(cls: new (...params: any[]) => T, ...args: any[]): T {
    let className = getQualifiedClassName(cls);
    if (!this._poolMap[className]) {
      this._poolMap[className] = [];
    }

    let list: any[] = this._poolMap[className];
    if (list.length) {
      let vo = list.pop();
      if (vo["onAlloc"] && typeof (vo["onAlloc"]) == "function") {
        vo["onAlloc"]();
      }
      return vo;
    }

    let clazz: any = new cls(...args);
    // 若是此对象实现了 IPoolObject 接口，则需要调用对应的 onAlloc 方法
    if (clazz["onAlloc"] && typeof (clazz["onAlloc"]) == "function") {
      clazz["onAlloc"]();
    }
    clazz[`${PoolObjectName}`] = className;
    return clazz;
  }

  /**
   * 放入一个对象
   * @param obj
   */
  public free(obj: any): boolean {
    if (!obj) {
      return false;
    }
    let refKey: string = obj[`${PoolObjectName}`];
    // 保证只有对象池中取出来的对象才可以放进来（已经清除的无法放入）
    if (!refKey || !this._poolMap[refKey] || this._poolMap[refKey].indexOf(obj) > -1) {
      return false;
    }
    // 若是此对象实现了 IPoolObject 接口，则需要调用对应的 onRelease 方法
    if (obj["onFree"] && typeof (obj["onFree"]) == "function") {
      obj["onFree"]();
    }
    this._poolMap[refKey].push(obj);
    return true;
  }

  public clear(): void {
    this._poolMap = {};
  }

  public getContent(): any {
    return this._poolMap;
  }

  public setCount(count = 5): void {
    for (let key in this._poolMap) {
      let list: any[] = this._poolMap[key];
      if (list.length > count) {
        list.length = count;
      }
    }
  }
}

const poolMgr = new PoolMgr();
export default poolMgr;
if (window) {
  window["poolMgr"] = poolMgr;
}

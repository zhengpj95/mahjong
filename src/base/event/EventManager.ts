import EventDispatcher = Laya.EventDispatcher;
import { DebugUtils } from "@base/utils/DebugUtils";

/**
 * @author zpj
 * @date 2025/1/22
 */
export class EventManager extends EventDispatcher {
  public on(type: string, caller: any, listener: Function, args?: any[]): Laya.EventDispatcher {
    return super.on(type, caller, listener, args);
  }

  public off(type: string, caller: any, listener: Function, onceOnly?: boolean): Laya.EventDispatcher {
    return super.off(type, caller, listener, onceOnly);
  }

  public event(type: string, data?: any): boolean {
    return super.event(type, data);
  }
}

export const eventMgr = new EventManager();
DebugUtils.debug("eventMgr", eventMgr);
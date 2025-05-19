import protobuf from "protobufjs";
import Long from "long";
import { initModules } from "./modules/index";
import { ModuleType } from "@def/module-type";
import { MahjongViewType } from "@def/mahjong";
import { GameCfg } from "@base/cfg/GameCfg";
import facade = base.facade;


/**
 * @author zpj
 * @date 2025/5/16
 */
export async function main() {
  console.log("Hello LayaAir! Game start!");

  protobuf.util.Long = Long;
  protobuf.configure();

  initLoop();
  base.baseInit();
  GameCfg.init();
  initModules();

  facade.openView(ModuleType.MAHJONG, MahjongViewType.HOME);
}

let _lastLoop = 0;
let _rawLoop: () => boolean;
let stage: {
  _loop: () => boolean;
};

const enum UpdateFrame {
  FAST = 16,
  SLOW = 33,
  SLEEP = 1000,
}

function _loop(): boolean {
  const now = Date.now();
  const elapsed = now - _lastLoop;
  if (elapsed < UpdateFrame.SLOW) {
    return false;
  }
  _lastLoop = now;
  try {
    if (_rawLoop) {
      _rawLoop.call(Laya.stage);
    }
  } catch (e) {
    console.log(e);
  }
  base.baseLoop();
  return true;
}

function initLoop(): void {
  stage = <any>Laya.stage;
  _rawLoop = stage._loop;
  stage._loop = _loop;
}

// setInterval(_bgLoop, 1);
//
// function _bgLoop(): void {
//   const now = Date.now();
//   const elapsed = now - _lastLoop;
//   if (elapsed < UpdateFrame.SLOW * 1.5) {
//     return;
//   }
//   _loop();
// }
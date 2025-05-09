import GameConfig from "./GameConfig";
import { GameCfg } from "@base/cfg/GameCfg";
import { initModules } from "./modules/index";
import { initEnhancedConsole } from "@base/logger";
import { ModuleType } from "@def/module-type";
import { MahjongViewType } from "@def/mahjong";
import facade = base.facade;

class Main {
  constructor() {
    //根据IDE设置初始化引擎
    if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    Laya["Physics"] && Laya["Physics"].enable();
    Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    Laya.stage.scaleMode = GameConfig.scaleMode;
    Laya.stage.screenMode = GameConfig.screenMode;
    Laya.stage.alignV = GameConfig.alignV;
    Laya.stage.alignH = GameConfig.alignH;
    //兼容微信不支持加载scene后缀场景
    Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    if (GameConfig.stat) Laya.Stat.show();
    Laya.alertGlobalError(true);
    initEnhancedConsole();

    //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);

    initLoop();
    base.baseInit();
    initModules();
    GameCfg.init();
  }

  onVersionLoaded(): void {
    //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
  }

  onConfigLoaded(): void {
    //加载IDE指定的场景
    facade.openView(ModuleType.MAHJONG, MahjongViewType.HOME);
    // GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
  }
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

setInterval(_bgLoop, 1);

function _bgLoop(): void {
  const now = Date.now();
  const elapsed = now - _lastLoop;
  if (elapsed < UpdateFrame.SLOW * 1.5) {
    return;
  }
  _loop();
}

//激活启动类
new Main();

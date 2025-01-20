import GameConfig from "./GameConfig";
import { layerMgr } from "@base/LayerManager";

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

    //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);

    layerMgr.init();
    initLoop();
  }

  onVersionLoaded(): void {
    //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
  }

  onConfigLoaded(): void {
    //加载IDE指定的场景
    GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
  }
}

let _rowLoop: () => boolean;
let _initBase = false;

function _loop(): void {
  try {
    if (_rowLoop) {
      _rowLoop.call(Laya.stage);
    }
  } catch (e) {
    console.log(e);
  }
  if (!_initBase) {
    // 兼容egret的stage为空的情况，并处理帧率
    const egretStage = new egret.Stage();
    egretStage.frameRate = 60;
    egret.lifecycle.stage = egretStage;

    base.TimeMgr.init();
    _initBase = true;
  }
  egret.ticker.update(true);
}

function initLoop(): void {
  let stage = Laya.stage;
  _rowLoop = stage["_loop"];
  stage["_loop"] = _loop;
}

//激活启动类
new Main();

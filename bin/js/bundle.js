(function () {
  'use strict';

  var Script = Laya.Script;
  var CallBack = base.CallBack;
  const CLICK_SCALE_DOWN = 1.1;
  const CLICK_SCALE_UP = 0.90;
  const CLICK_SCALE_TIME = 100;
  class ClickScale extends Script {
      constructor() {
          super(...arguments);
          this.noScale = false;
          this._originX = 0;
          this._originY = 0;
          this._originScaleX = 1;
          this._originScaleY = 1;
          this._isTween = false;
      }
      onAwake() {
          super.onAwake();
          this._comp = this.owner;
          this._width = this._comp.width;
          this._height = this._comp.height;
          this._originX = this._comp.x;
          this._originY = this._comp.y;
          this._originScaleX = this._comp.scaleX;
          this._originScaleY = this._comp.scaleY;
          this._isTween = false;
      }
      onEnable() {
          super.onEnable();
          this.setAnchor();
          this._comp.on(Laya.Event.MOUSE_DOWN, this, this.onClickMouseDown);
          this._comp.on(Laya.Event.MOUSE_UP, this, this.onClickMouseUp);
          this._comp.on(Laya.Event.MOUSE_OUT, this, this.onClickMouseUp);
      }
      destroy() {
          super.destroy();
      }
      setAnchor() {
          if (this.noScale)
              return;
          this._comp.anchorX = this._comp.anchorY = 0.5;
          this._comp.x = this._originX + this._width * 0.5;
          this._comp.y = this._originY + this._height * 0.5;
      }
      onClickMouseDown() {
          if (this.noScale)
              return;
          this._isTween = false;
          base.tweenMgr.remove(this._comp);
          base.tweenMgr.get(this._comp).to({ scaleX: CLICK_SCALE_DOWN, scaleY: CLICK_SCALE_DOWN }, CLICK_SCALE_TIME);
      }
      onClickMouseUp() {
          if (this.noScale
              || this._isTween
              || (this._comp.scaleX === this._originScaleX &&
                  this._comp.scaleY === this._originScaleY)) {
              return;
          }
          this._isTween = true;
          base.tweenMgr.remove(this._comp);
          base.tweenMgr.get(this._comp).to({
              scaleX: CLICK_SCALE_UP,
              scaleY: CLICK_SCALE_UP
          }, CLICK_SCALE_TIME, undefined, CallBack.alloc(this, this.onMouseUpEnd));
      }
      onMouseUpEnd() {
          base.tweenMgr.remove(this._comp);
          base.tweenMgr.get(this._comp).to({
              scaleX: this._originScaleX,
              scaleY: this._originScaleY
          }, CLICK_SCALE_TIME);
      }
  }

  var Script$1 = Laya.Script;
  var Image = Laya.Image;
  function createImgMask() {
      const img = new Image();
      img.skin = `modules/common/img_blank.png`;
      img.width = img.height = 0;
      img.sizeGrid = "4,5,7,6";
      return img;
  }
  class BarProgress extends Script$1 {
      onAwake() {
          super.onAwake();
          const owner = this.owner;
          this._imgBar = owner.getChildByName("imgBar");
          this._lab = owner.getChildByName("lab");
          if (!this._imgMask) {
              this._imgMask = createImgMask();
              this._imgMask.height = this._imgBar.height;
              this._imgBar.mask = this._imgMask;
          }
          Object.defineProperty(this.owner, "value", {
              configurable: true,
              enumerable: true,
              get: () => {
                  return this.value;
              },
              set: (v) => {
                  this.value = v;
              }
          });
      }
      onEnable() {
          super.onEnable();
      }
      onDestroy() {
          super.onDestroy();
      }
      getImgWidth() {
          if (!this._imgBar || !this._imgBar.width) {
              const func = this._imgBar["_sizeChanged"];
              if (func) {
                  func();
              }
          }
          return this._imgBar ? this._imgBar.width : 0;
      }
      set value(val) {
          if (this._imgMask && this._imgBar) {
              const width = val * this.getImgWidth() >> 0;
              this._imgMask.width = width;
              this._imgBar.visible = width >= 1;
          }
      }
      get value() {
          if (this._imgMask && this._imgBar) {
              return this._imgMask.width / this._imgBar.width;
          }
          return 0;
      }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("script/ClickScale.ts", ClickScale);
          reg("script/BarProgress.ts", BarProgress);
      }
  }
  GameConfig.width = 640;
  GameConfig.height = 1136;
  GameConfig.scaleMode = "showall";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "middle";
  GameConfig.alignH = "center";
  GameConfig.startScene = "modules/mahjong/MahjongHome.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  var Sprite = Laya.Sprite;
  var Scene = Laya.Scene;
  var LayerIndex;
  (function (LayerIndex) {
      LayerIndex[LayerIndex["ROOT"] = 1] = "ROOT";
      LayerIndex[LayerIndex["MODAL"] = 2] = "MODAL";
      LayerIndex[LayerIndex["TIPS"] = 3] = "TIPS";
  })(LayerIndex || (LayerIndex = {}));
  function setLayerIndex(scene, idx = LayerIndex.ROOT) {
      if (scene) {
          scene["_layerIndex_"] = idx;
      }
  }
  class LayerManager {
      init() {
          Scene.root;
          this.modal;
          this.tips;
      }
      get modal() {
          if (!this._modal) {
              this._modal = new Sprite();
              Scene["_modal_"] = Laya.stage.addChildAt(this._modal, 1);
              const modal = Scene["_modal_"];
              modal.name = "modal";
              modal.mouseThrough = true;
              Laya.stage.on("resize", null, () => {
                  modal.size(Laya.stage.width, Laya.stage.height);
                  modal.event(Laya.Event.RESIZE);
              });
              modal.size(Laya.stage.width, Laya.stage.height);
              modal.event(Laya.Event.RESIZE);
          }
          return this._modal;
      }
      get tips() {
          if (!this._tips) {
              this._tips = new Sprite();
              Scene["_tips_"] = Laya.stage.addChildAt(this._tips, 2);
              const tips = Scene["_tips_"];
              tips.name = "tips";
              tips.mouseThrough = true;
              Laya.stage.on("resize", null, () => {
                  tips.size(Laya.stage.width, Laya.stage.height);
                  tips.event(Laya.Event.RESIZE);
              });
              tips.size(Laya.stage.width, Laya.stage.height);
              tips.event(Laya.Event.RESIZE);
          }
          return this._tips;
      }
  }
  let sprite;
  function createPopupMask() {
      if (!sprite) {
          sprite = new Sprite();
          sprite.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000CC");
      }
      sprite.name = "popup_mask";
      return sprite;
  }
  function addPopupMask() {
      const mask = createPopupMask();
      mask.removeSelf();
      layerMgr.modal.addChildAt(mask, 0);
  }
  function removePopupMask() {
      const mask = createPopupMask();
      mask.removeSelf();
  }
  let layerMgr;
  function initLayerMgr() {
      layerMgr = new LayerManager();
      layerMgr.init();
  }

  class DebugUtils {
      static debug(key, cls) {
          if (!key || !cls) {
              return;
          }
          if (window) {
              window[key] = cls;
          }
      }
      static debugClass(cls) {
          if (!cls) {
              return;
          }
          const name = cls.constructor && cls.constructor.name;
          if (window && name) {
              window[name] = cls;
          }
      }
      static debugLog(str) {
          if (this.showDebug) {
              console.log(`DebugLog: `, str);
          }
      }
  }
  DebugUtils.showDebug = false;
  DebugUtils.debug("DebugUtils", DebugUtils);

  var Handler = Laya.Handler;
  class GameCfg {
      static init() {
          Laya.loader.load(this.jsonCfgListPath, Handler.create(this, this.onLoaded), null, Laya.Loader.JSON, 0);
      }
      static onLoaded(data) {
          if (data && data.length) {
              for (const jsonName of data) {
                  Laya.loader.load(this.jsonPath + jsonName, Handler.create(this, this.onLoadedJson, [jsonName]), null, Laya.Loader.JSON, 0);
              }
          }
      }
      static onLoadedJson(jsonName, data) {
          jsonName = jsonName.replace(".json", "");
          this.cfgMap[jsonName] = data;
          const list = [];
          for (const key in data) {
              list.push(data[key]);
          }
          this.cfgListMap[jsonName] = list;
      }
      static getCfgListByName(cfgName) {
          return this.cfgListMap[cfgName] || [];
      }
      static getCfgByNameId(cfgName, id) {
          const obj = this.cfgMap[cfgName];
          return obj ? obj[id] : undefined;
      }
  }
  GameCfg.jsonPath = "json/";
  GameCfg.jsonCfgListPath = "json/cfglist.json";
  GameCfg.cfgMap = {};
  GameCfg.cfgListMap = {};
  DebugUtils.debug("GameCfg", GameCfg);

  var BaseMediator = base.BaseMediator;
  class RuleMdr extends BaseMediator {
      constructor() {
          super("modules/common/Rule.scene", layerMgr.modal);
          addPopupMask();
      }
      addEvents() {
      }
      initUI() {
      }
      onClose() {
          console.log(`11111 RuleMdr onClose`);
          removePopupMask();
      }
      onOpen() {
          const labDesc = this.ui.getChildByName("boxInfo").getChildByName("labDesc");
          labDesc.text = this.params;
          this._btnClose = this.ui.getChildByName("boxInfo").getChildByName("btnClose");
          this._btnClose.once(Laya.Event.CLICK, this, this.close);
      }
      removeEvents() {
      }
  }

  var BaseModule = base.BaseModule;
  class MiscModule extends BaseModule {
      constructor() {
          super(1);
      }
      initCmd() {
      }
      initMdr() {
          this.regMdr(1, RuleMdr);
      }
      initProxy() {
      }
  }

  const DEFAULT_TURN_COUNT = 2;
  const DIRECTION = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const DIRECTION_NAME = ["right", "down", "left", "up"];
  class PathNode {
      constructor(position, g, h, parent = null, direction = null) {
          this.position = position;
          this.g = g;
          this.h = h;
          this.parent = parent;
          this.direction = direction;
      }
      get f() {
          return this.g + this.h;
      }
      getPathStr() {
          const list = [this.position.join("_")];
          let p = this.parent;
          while (p) {
              list.push(p.position.join("_"));
              p = p.parent;
          }
          return list.reverse().join(",");
      }
      get pathStr() {
          return this.getPathStr();
      }
      get directionName() {
          if (!this.direction) {
              return "";
          }
          for (let i = 0; i < DIRECTION.length; i++) {
              if (DIRECTION[i].toString() === this.direction.toString()) {
                  return DIRECTION_NAME[i];
              }
          }
          return "";
      }
      getTurnCountTotal() {
          if (!this.parent || !this.parent.direction || !this.direction) {
              return 0;
          }
          let cnt = 0;
          let p = this.parent;
          let d = this.direction;
          while (p && d) {
              if (p.direction && d.toString() !== p.direction.toString()) {
                  cnt++;
              }
              d = p.direction;
              p = p.parent;
          }
          return cnt;
      }
  }
  class AStar {
      constructor(grid, turnCnt = DEFAULT_TURN_COUNT) {
          this._turnCount = 0;
          this._grid = grid;
          this._turnCount = turnCnt;
      }
      heuristic(a, b) {
          return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
      }
      getNeighbors(node, end) {
          const [x, y] = node.position;
          const list = DIRECTION.map(([dx, dy]) => [[x + dx, y + dy], [dx, dy]]);
          return list.filter(([pos]) => end[0] === pos[0] && end[1] === pos[1]
              ? this._grid.isInBounds(pos[0], pos[1])
              : this._grid.isValid(pos[0], pos[1]));
      }
      findPath(start, end) {
          const openList = [];
          const closedSet = new Set();
          const excludeSet = new Set();
          const startNode = new PathNode(start, 0, this.heuristic(start, end));
          openList.push(startNode);
          while (openList.length > 0) {
              openList.sort((a, b) => (a.f + a.getTurnCountTotal()) - (b.f + b.getTurnCountTotal()));
              const currentNode = openList.shift();
              if (excludeSet.has(currentNode.pathStr)) {
                  continue;
              }
              DebugUtils.debugLog(currentNode.pathStr);
              if (currentNode.position[0] === end[0] && currentNode.position[1] === end[1]) {
                  const path = [];
                  let node = currentNode;
                  while (node) {
                      path.unshift(node.position);
                      node = node.parent;
                  }
                  return path;
              }
              closedSet.add(currentNode.pathStr);
              const neighborList = this.getNeighbors(currentNode, end);
              for (const [neighbor, direction] of neighborList) {
                  const neighborPath = currentNode.pathStr + "," + neighbor.toString();
                  if (closedSet.has(neighborPath) || excludeSet.has(neighborPath)) {
                      continue;
                  }
                  const g = currentNode.g + 1;
                  const h = this.heuristic(neighbor, end);
                  const neighborNode = new PathNode(neighbor, g, h, currentNode, direction);
                  if (neighborNode.getTurnCountTotal() > this._turnCount) {
                      excludeSet.add(neighborPath);
                      continue;
                  }
                  const existingNode = openList.find(node => node.pathStr === neighborPath);
                  if (!existingNode || g < existingNode.g) {
                      if (existingNode) {
                          openList.splice(openList.indexOf(existingNode), 1);
                      }
                      openList.push(neighborNode);
                  }
              }
          }
          return [];
      }
  }

  var CellType;
  (function (CellType) {
      CellType[CellType["WALKABLE"] = 0] = "WALKABLE";
      CellType[CellType["OBSTACLE"] = 1] = "OBSTACLE";
  })(CellType || (CellType = {}));

  class Grid {
      constructor(gridData) {
          this._gridData = gridData;
      }
      isValid(x, y) {
          return this.isInBounds(x, y) && this._gridData[x][y] === CellType.WALKABLE;
      }
      isInBounds(x, y) {
          return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
      }
      getValue(x, y) {
          if (!this.isInBounds(x, y)) {
              throw new Error(`Grid.getValue(${x}, ${y}) are out of bounds.`);
          }
          return this._gridData[x][y];
      }
      setValue(x, y, val) {
          if (!this.isInBounds(x, y)) {
              throw new Error(`Grid.getValue(${x}, ${y}) are out of bounds.`);
          }
          this._gridData[x][y] = val;
          return true;
      }
      get cols() {
          return this._gridData[0].length;
      }
      get rows() {
          return this._gridData.length;
      }
  }

  class AStarMgr {
      constructor(data) {
          this.createAStar(data);
      }
      createAStar(data) {
          this._grid = new Grid(data);
          this._astar = new AStar(this._grid);
      }
      updateGrid(point, value) {
          if (this._grid) {
              return this._grid.setValue(point[0], point[1], value);
          }
          return false;
      }
      findPath(start, end) {
          if (this._astar) {
              return this._astar.findPath(start, end);
          }
          return [];
      }
  }

  const CARD_COUNT = 4;
  const CARD_NUM_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  function getCardTypeRes(type, num) {
      const cardCfg = GameCfg.getCfgByNameId("CardConfig", type);
      return `modules/mahjong/${cardCfg.res + num}.png`;
  }

  class MahjongCardData {
      updateInfo(row, col, data) {
          this.row = row;
          this.col = col;
          this.cardData = data;
          const cardCfg = GameCfg.getCfgByNameId("CardConfig", data[0]);
          this["cardName"] = cardCfg.res + data[1];
      }
      isValid() {
          return this.cardData && this.cardData.length > 0;
      }
      getIcon() {
          if (!this.cardData) {
              return "";
          }
          return getCardTypeRes(this.cardData[0], this.cardData[1]);
      }
      checkSame(data) {
          if (!data || !data.cardData) {
              return false;
          }
          if (!this.isValid()) {
              return false;
          }
          return data.cardData[0] === this.cardData[0] && data.cardData[1] === this.cardData[1];
      }
      checkPos(data) {
          if (!data) {
              return false;
          }
          return data.row === this.row && data.col === this.col;
      }
      onAlloc() {
          this.row = 0;
          this.col = 0;
          this.cardData = undefined;
      }
      onFree() {
          this.onAlloc();
      }
  }

  var poolMgr = base.poolMgr;
  var eventMgr = base.eventMgr;
  var facade = base.facade;
  const MAHJONG_LEVEL = "mahjong_level";
  class MahjongModel {
      constructor() {
          this.row = 0;
          this.col = 0;
          this.data = [];
          this.level = 0;
          this.levelScore = 0;
          this._pathData = [];
          this._sameCardMap = {};
      }
      getLevelCfg() {
          const lv = this.getNextLevel();
          const list = GameCfg.getCfgListByName("LevelConfig") || [];
          if (lv >= list.length) {
              return list[list.length - 1];
          }
          return GameCfg.getCfgByNameId("LevelConfig", lv || 1);
      }
      updateScore(score) {
          this.levelScore += score;
          eventMgr.emit("mahjong_update_score");
      }
      updateData() {
          const cfg = this.getLevelCfg();
          this.row = cfg && cfg.layout ? cfg.layout[0] : 8;
          this.col = cfg && cfg.layout ? cfg.layout[1] : 10;
          this.data = [];
      }
      clearData(isReset = false) {
          this.levelScore = 0;
          this.row = 0;
          this.col = 0;
          this.data.length = 0;
          this._pathData.length = 0;
          this._astarMgr = undefined;
          this._rowColStrList = undefined;
          this._sameCardMap = {};
      }
      getMahjongCardList() {
          const list = [];
          const cardTypeList = this.getLevelCfg().cardType || [];
          const fengTypeList = this.getLevelCfg().fengType || [];
          for (let type of cardTypeList) {
              for (let num of CARD_NUM_LIST) {
                  list.push([type, num]);
              }
          }
          for (let feng of fengTypeList) {
              list.push([4, feng]);
          }
          return list;
      }
      getRowColStrList() {
          if (!this._rowColStrList) {
              const rst = [];
              for (let i = 0; i < this.row; i++) {
                  for (let j = 0; j < this.col; j++) {
                      rst[i * this.col + j] = i + "_" + j;
                  }
              }
              this._rowColStrList = rst;
          }
          return this._rowColStrList || [];
      }
      getRandomRowCol() {
          const list = this.getRowColStrList();
          const idx = Math.random() * list.length >> 0;
          const listItem = list.splice(idx, 1)[0];
          return listItem.split("_").map(item => +item);
      }
      getMahjongData() {
          const list = this.getMahjongCardList();
          for (let item of list) {
              for (let i = 0; i < CARD_COUNT; i++) {
                  const randomItemAry = this.getRandomRowCol();
                  if (!this.data[randomItemAry[0]]) {
                      this.data[randomItemAry[0]] = [];
                  }
                  const cardData = poolMgr.alloc(MahjongCardData);
                  cardData.updateInfo(randomItemAry[0], randomItemAry[1], item);
                  this.data[randomItemAry[0]][randomItemAry[1]] = cardData;
              }
          }
          return this.data;
      }
      deleteCard(index) {
          const row = (index / 10 >> 0);
          const col = index % 10;
          if (!this.data || !this.data[row]) {
              return false;
          }
          poolMgr.free(this.data[row][col]);
          this.data[row][col] = undefined;
          if (this._pathData.length) {
              this._pathData[row + 1][col + 1] = 0;
          }
          const cnt = this.getLeaveCardDataList().length;
          if (cnt <= 0) {
              this.showResult();
          }
          return true;
      }
      findPath(startData, targetData) {
          if (!startData || !targetData || !startData.checkSame(targetData)) {
              return [];
          }
          if (!this._astarMgr) {
              const dfsAry = [];
              for (let i = 0; i < this.row + 2; i++) {
                  for (let j = 0; j < this.col + 2; j++) {
                      if (!dfsAry[i]) {
                          dfsAry[i] = [];
                      }
                      if (i === 0 || j === 0 || i === this.row + 1 || j === this.col + 1) {
                          dfsAry[i][j] = 0;
                      }
                      else {
                          const cardData = this.data[i - 1][j - 1];
                          dfsAry[i][j] = cardData ? 1 : 0;
                      }
                  }
              }
              this._pathData = dfsAry;
              this._astarMgr = new AStarMgr(this._pathData);
          }
          const paths = this._astarMgr.findPath([startData.row + 1, startData.col + 1], [targetData.row + 1, targetData.col + 1]);
          return paths || [];
      }
      canConnect(startData, targetData) {
          if (!startData || !targetData) {
              return false;
          }
          const paths = this.findPath(startData, targetData);
          return !!paths.length;
      }
      getConnectCardDataList(cardData) {
          if (!cardData) {
              return [];
          }
          const cardKey = cardData.cardData.toString();
          if (this._sameCardMap[cardKey]) {
              return this._sameCardMap[cardKey] || [];
          }
          const rst = [];
          for (let data of this.data) {
              for (let item of data) {
                  if (item && item.checkSame(cardData)) {
                      rst.push(item);
                  }
              }
          }
          this._sameCardMap[cardKey] = rst;
          return rst;
      }
      getTipsCardDataList() {
          if (!this.data.length) {
              return [];
          }
          let minPath = Number.MAX_SAFE_INTEGER;
          let rst = [];
          const checkSet = new Set();
          for (let rows of this.data) {
              if (!rows || !rows.length)
                  continue;
              for (let item of rows) {
                  if (!item || !item.cardData || !item.isValid())
                      continue;
                  if (checkSet.has(item.cardData.toString()))
                      continue;
                  checkSet.add(item.cardData.toString());
                  const connectList = this.getConnectCardDataList(item);
                  if (!connectList.length)
                      continue;
                  for (let i = 0; i < connectList.length; i++) {
                      const cardI = connectList[i];
                      if (!cardI || !cardI.isValid())
                          continue;
                      for (let j = i + 1; j < connectList.length; j++) {
                          const cardJ = connectList[j];
                          if (!cardJ || !cardJ.isValid())
                              continue;
                          const paths = this.findPath(cardI, cardJ);
                          if (!paths.length)
                              continue;
                          if (paths.length === 2) {
                              return [cardI, cardJ];
                          }
                          if (paths.length < minPath) {
                              rst = [cardI, cardJ];
                              minPath = paths.length;
                          }
                      }
                  }
              }
          }
          return rst;
      }
      getLeaveCardDataList() {
          return this.data.reduce((arr, item) => {
              return arr.concat(item.filter(card => card && card.isValid()));
          }, []);
      }
      getRefreshCardDataList() {
          const list = this.getLeaveCardDataList();
          this._astarMgr = undefined;
          this._rowColStrList = undefined;
          this.data = [];
          for (let i = 0; i < this.row; i++) {
              this.data[i] = new Array(this.col).fill(undefined);
          }
          this._pathData = [];
          for (let card of list) {
              if (!card) {
                  continue;
              }
              const random = this.getRandomRowCol();
              if (!this.data[random[0]]) {
                  this.data[random[0]] = new Array(this.col).fill(undefined);
              }
              card.updateInfo(random[0], random[1], card.cardData);
              this.data[random[0]][random[1]] = card;
          }
          return this.data;
      }
      getChallengeTime() {
          const cfg = this.getLevelCfg();
          if (cfg.time) {
              return cfg.time;
          }
          return 90;
      }
      challengeAgain() {
          this.clearData();
          this.updateData();
      }
      showNext(isAgain) {
          this.clearData();
          this.updateData();
      }
      getNextLevel() {
          return this.level + 1;
      }
      showResult(param) {
          eventMgr.emit("mahjong_show_result");
          facade.openView(2, 3, param);
      }
  }

  var PlatformType;
  (function (PlatformType) {
      PlatformType["WX"] = "wx";
      PlatformType["TT"] = "tt";
      PlatformType["QQ"] = "qq";
      PlatformType["WEB"] = "web";
      PlatformType["UNKNOWN"] = "unknown";
  })(PlatformType || (PlatformType = {}));

  class Platform {
      static get platform() {
          if (typeof wx !== "undefined" && wx.getSystemInfoSync) {
              return PlatformType.WX;
          }
          else if (typeof window !== "undefined") {
              return PlatformType.WEB;
          }
          else {
              return PlatformType.UNKNOWN;
          }
      }
      static get isWx() {
          return this.platform === PlatformType.WX;
      }
      static get isWeb() {
          return this.platform === PlatformType.WEB;
      }
  }

  class WechatAdapter {
      get storage() {
          if (!this._storage) {
              this._storage = new WechatPlatformStorage();
          }
          return this._storage;
      }
  }
  class WechatPlatformStorage {
      clear() {
          wx.clearStorage();
      }
      getItem(key, callback) {
          try {
              wx.getStorage({
                  key: key,
                  success: (result) => {
                      if (callback)
                          callback(JSON.parse(result.data));
                  },
                  fail: () => {
                      if (callback)
                          callback(undefined);
                  },
                  complete: () => {
                  }
              });
          }
          catch (e) {
              return undefined;
          }
      }
      removeItem(key, callback) {
          try {
              wx.removeStorage({
                  key: key,
                  success: () => {
                      if (callback)
                          callback(true);
                  },
                  fail: () => {
                      if (callback)
                          callback(false);
                  },
                  complete: () => {
                  }
              });
          }
          catch (e) {
              if (callback)
                  callback(false);
          }
      }
      setItem(key, val, callback) {
          try {
              wx.setStorage({
                  key: key,
                  data: JSON.stringify(val),
                  success: () => {
                      if (callback)
                          callback(true);
                  },
                  fail: () => {
                      if (callback)
                          callback(false);
                  },
                  complete: () => {
                  }
              });
          }
          catch (e) {
              if (callback)
                  callback(false);
          }
      }
  }

  class WebAdapter {
      get storage() {
          if (!this._storage) {
              this._storage = new WebPlatformStorage();
          }
          return this._storage;
      }
  }
  class WebPlatformStorage {
      setItem(key, val, callback) {
          try {
              localStorage.setItem(key, JSON.stringify(val));
              if (callback) {
                  callback(true);
              }
          }
          catch (e) {
              if (callback) {
                  callback(false);
              }
          }
      }
      getItem(key, callback) {
          try {
              const data = localStorage.getItem(key);
              const parsed = data ? JSON.parse(data) : null;
              if (callback) {
                  callback(parsed);
              }
              return parsed;
          }
          catch (e) {
              if (callback) {
                  callback(undefined);
              }
              return undefined;
          }
      }
      removeItem(key, callback) {
          try {
              localStorage.removeItem(key);
              if (callback) {
                  callback(true);
              }
          }
          catch (e) {
              if (callback) {
                  callback(false);
              }
          }
      }
      clear() {
          localStorage.clear();
      }
  }

  class AdapterFactory {
      static getAdapter() {
          switch (Platform.platform) {
              case PlatformType.WX:
                  return new WechatAdapter();
              case PlatformType.WEB:
                  return new WebAdapter();
              default:
                  throw new Error(`Unsupported platform!`);
          }
      }
  }

  const globalAdapter = AdapterFactory.getAdapter();

  var BaseProxy = base.BaseProxy;
  var eventMgr$1 = base.eventMgr;
  class MahjongProxy extends BaseProxy {
      get model() {
          if (!this._model) {
              this._model = new MahjongModel();
          }
          return this._model;
      }
      init() {
          this.sMahjongInfo();
      }
      cMahjongSuccess() {
          let lev = this.model.level + 1;
          globalAdapter.storage.setItem(MAHJONG_LEVEL, lev, (success) => {
              if (success) {
                  console.log(`cMahjongSuccess setItem success: `, lev);
              }
              else {
                  console.log(`cMahjongSuccess setItem fail: `, lev);
              }
          });
          this.model.level += 1;
      }
      sMahjongInfo() {
          this.model.clearData();
          globalAdapter.storage.getItem(MAHJONG_LEVEL, (data) => {
              console.warn(`sMahjongInfo before getItem: ${this.model.level}`);
              this.model.level = data || 0;
              console.warn(`sMahjongInfo after getItem: ${this.model.level} ${data}`);
              eventMgr$1.emit("mahjong_update_info");
          });
      }
  }

  var BaseMediator$1 = base.BaseMediator;
  var facade$1 = base.facade;
  class MahjongHomeMdr extends BaseMediator$1 {
      constructor() {
          super("modules/mahjong/MahjongHome.scene", Laya.Scene.root);
      }
      addEvents() {
          this._btnStart.on(Laya.Event.CLICK, this, this.onClickBtnStart);
      }
      initUI() {
          this._btnStart = this.ui.getChildByName("btnStart");
      }
      onClose() {
          console.warn(`11111 MahjongHomeMdr.onClose...`, this.params);
      }
      onOpen() {
          console.warn(`11111 MahjongHomeMdr.onOpen...`, this.params);
      }
      removeEvents() {
          this._btnStart.offAll(Laya.Event.CLICK);
      }
      onClickBtnStart() {
          facade$1.closeView(2, 1);
          facade$1.openView(2, 2);
      }
  }

  var TimeLine = Laya.TimeLine;
  var Event = Laya.Event;
  class ComUtils {
      static setTween(box, isTween = true, callback) {
          if (!box) {
              return undefined;
          }
          let timeLine = box["_timeLine_"];
          if (timeLine) {
              timeLine.reset();
              if (!isTween) {
                  timeLine.destroy();
                  return undefined;
              }
          }
          else {
              box["_timeLine_"] = timeLine = new TimeLine();
          }
          timeLine.to(box, { rotation: 10 }, 100)
              .to(box, { rotation: -10 }, 100)
              .to(box, { rotation: 5 }, 100)
              .to(box, { rotation: -5 }, 100)
              .to(box, { rotation: 0 }, 50)
              .play();
          timeLine.on(Event.COMPLETE, this, () => {
              if (callback) {
                  callback.run();
              }
          });
          return timeLine;
      }
      static setScale(box, scale = 1) {
          if (!box) {
              return;
          }
          if (box.scaleX !== scale) {
              box.scaleX = box.scaleY = scale;
          }
      }
      static getNodeByNameList(box, nameList) {
          if (!box) {
              return undefined;
          }
          if (Array.isArray(nameList)) {
              let com = box;
              while (nameList.length) {
                  const name = nameList.shift();
                  com = com.getChildByName(name);
                  if (!com) {
                      console.error(`ComUtils.getNodeByNameList error: `, name);
                  }
              }
              return com;
          }
          else {
              return box.getChildByName(nameList);
          }
      }
  }

  var Box = Laya.Box;
  var Label = Laya.Label;
  var Image$1 = Laya.Image;
  var Timer = Laya.Timer;
  var Tween = Laya.Tween;
  var Handler$1 = Laya.Handler;
  var Sprite$1 = Laya.Sprite;
  var poolMgr$1 = base.poolMgr;
  class TipsItem extends Box {
      onAlloc() {
          this.size(600, 35);
          this.centerX = 0;
          this.centerY = -100;
          if (!this._img) {
              this._img = new Image$1();
              this._img.skin = `modules/common/img_blank.png`;
              this._img.left = this._img.right = this._img.bottom = this._img.top = 0;
              this._img.sizeGrid = `3,8,6,5`;
              this.addChild(this._img);
          }
          if (!this._lab) {
              this._lab = new Label();
              this._lab.fontSize = 22;
              this._lab.color = "#ffffff";
              this._lab.centerX = 0;
              this._lab.centerY = 1;
              this.addChild(this._lab);
          }
          this.alpha = 1;
          this._lab.text = "";
      }
      onFree() {
          this.alpha = 1;
          if (this._lab) {
              this._lab.text = "";
          }
      }
      set text(str) {
          this._lab.text = str;
      }
      execTween() {
          Tween.clearAll(this);
          Tween.to(this, { alpha: 0.8 }, 800, null, Handler$1.create(this, this.execTweenEnd, null, true), 800);
      }
      execTweenEnd() {
          this.removeSelf();
          Tween.clearAll(this);
          poolMgr$1.free(this);
      }
  }
  class TipsMdr extends Box {
      constructor() {
          super();
          this._tipsList = [];
          this._showMaxNum = 5;
          if (!this._sprite) {
              this._sprite = new Sprite$1();
              this._sprite.size(Laya.stage.width, Laya.stage.height);
              this.addChild(this._sprite);
          }
          this.size(Laya.stage.width, Laya.stage.height);
          layerMgr.tips.addChild(this);
      }
      addTips(str) {
          if (Array.isArray(str)) {
              for (let strItem of str) {
                  const tipsItem = poolMgr$1.alloc(TipsItem);
                  tipsItem.text = strItem;
                  this._tipsList.push(tipsItem);
              }
          }
          else {
              const tipsItem = poolMgr$1.alloc(TipsItem);
              tipsItem.text = str;
              this._tipsList.push(tipsItem);
          }
          if (!this._timer) {
              this._timer = new Timer();
              this._timer.loop(100, this, this.onUpdate);
              this.onUpdate();
          }
      }
      onUpdate() {
          if (!this._tipsList.length) {
              this._timer.clearAll(this);
              this._timer = undefined;
              return;
          }
          const existSize = this._sprite.numChildren;
          if (existSize >= this._showMaxNum) {
              return;
          }
          for (let i = 0; i < existSize; i++) {
              const item = this._sprite.getChildAt(i);
              if (item) {
                  item.y = item.y - (item.height + 5);
              }
          }
          const tipsItem = this._tipsList.shift();
          this._sprite.addChild(tipsItem);
          tipsItem.execTween();
      }
  }
  let mdr;
  function showTips(str) {
      if (!mdr) {
          mdr = new TipsMdr();
      }
      mdr.addTips(str);
  }

  var Handler$2 = Laya.Handler;
  var Event$1 = Laya.Event;
  var SoundManager = Laya.SoundManager;
  var BaseMediator$2 = base.BaseMediator;
  var CallBack$1 = base.CallBack;
  var facade$2 = base.facade;
  const INIT_SCALE = 0.4;
  const BIG_SCALE = 0.42;
  const ruleDesc = `1.点击两张相同牌，用≤3条直线连接（可拐弯）\n
2.路径无阻挡即可消除\n 
3.⚡连击加分，消除间隔越短，分数加成越高！\n
4.💡 用 提示（扣5分） 👉 显示可消的一对牌\n
5.用 洗牌（扣10分）👉 重置剩余牌位置`;
  class MahjongMdr extends BaseMediator$2 {
      constructor() {
          super("modules/mahjong/Mahjong.scene", Laya.Scene.root);
          this._preIdx = -1;
          this._lastScoreTime = 0;
          this._endTime = 0;
      }
      addEvents() {
          this.on("mahjong_update_info", this.onRefreshNext, this);
          this.on("mahjong_update_next", this.onRefreshNext, this);
          this.on("mahjong_show_result", this.showResultToClear, this);
          this.on("mahjong_update_score", this.updateScore, this);
      }
      initUI() {
          this._proxy = base.facade.getProxy(2, 2);
          this._list = this.ui.getChildByName("listItem");
          this._list.renderHandler = Handler$2.create(this, this.onRenderListItem, undefined, false);
          this._btnTips = this.ui.getChildByName("btnTips");
          this._btnRefresh = this.ui.getChildByName("btnRefresh");
          this._btnTips.on(Laya.Event.CLICK, this, this.onBtnTips);
          this._btnRefresh.on(Laya.Event.CLICK, this, this.onBtnRefresh);
          this._btnRule = this.ui.getChildByName("btnRule");
          this._btnRule.on(Laya.Event.CLICK, this, this.onClickRule);
      }
      onClose() {
          this._preIdx = -1;
          this._btnTips.off(Laya.Event.CLICK, this, this.onBtnTips);
          this._btnRefresh.off(Laya.Event.CLICK, this, this.onBtnRefresh);
      }
      onOpen() {
          this._proxy.model.clearData();
          this.onRefreshNext();
      }
      removeEvents() {
          this.off("mahjong_update_info", this.onRefreshNext, this);
          this.off("mahjong_update_next", this.onRefreshNext, this);
          this.off("mahjong_show_result", this.showResultToClear, this);
          this.off("mahjong_update_score", this.updateScore, this);
      }
      onRefreshNext(data) {
          console.warn(`11111 onRefreshNext cLv:${this._proxy.model.level}, nLv:${this._proxy.model.getNextLevel()}`);
          this._proxy.model.showNext(data);
          this.resetScore();
          this.updateLevel();
          const list = this._proxy.model.getMahjongData();
          this._list.array = list.reduce((a, b) => a.concat(b));
          this.updateBar();
      }
      updateBar() {
          const now = Date.now() / 1000 >> 0;
          this._endTime = now + this._proxy.model.getChallengeTime();
          const bar = this.ui.getChildByName("bar");
          bar.value = 1;
          base.tweenMgr.remove(bar);
          base.tweenMgr.get(bar).to({ value: 0 }, (this._endTime - now) * 1000, null, CallBack$1.alloc(this, this.onTimeOut, true));
      }
      showResultToClear() {
          const bar = this.ui.getChildByName("bar");
          base.tweenMgr.remove(bar);
      }
      onTimeOut() {
          this._proxy.model.showResult({ type: 1 });
      }
      onRenderListItem(item, index) {
          const boxCard = item.getChildByName("boxCard");
          const img = ComUtils.getNodeByNameList(boxCard, ["img"]);
          const data = item.dataSource;
          if (!data) {
              img.skin = "";
              return;
          }
          item.tag = data;
          img.skin = data.getIcon();
          ComUtils.setScale(boxCard, INIT_SCALE);
          this.setSelect(boxCard, false);
          item.on(Event$1.CLICK, this, this.onClickItem, [index]);
      }
      onClickItem(index) {
          if (this._preIdx > -1 && index === this._preIdx) {
              const boxCard = this._list.getCell(index).getChildByName("boxCard");
              this._preIdx = -1;
              ComUtils.setScale(boxCard, INIT_SCALE);
              this.setSelect(boxCard, false);
              return;
          }
          SoundManager.playSound("audio/mixkit-flop.wav");
          if (this._preIdx > -1 && index !== this._preIdx) {
              const curItemData = this._list.getItem(index);
              const preItemData = this._list.getItem(this._preIdx);
              const curItem = this._list.getCell(index).getChildByName("boxCard");
              const preItem = this._list.getCell(this._preIdx).getChildByName("boxCard");
              if (curItemData && curItemData.checkSame(preItemData)
                  && this._proxy.model.canConnect(preItemData, curItemData)) {
                  ComUtils.setScale(curItem, BIG_SCALE);
                  this.clearCardItem(curItem, index);
                  this.setSelect(curItem, true);
                  this.clearCardItem(preItem, this._preIdx);
                  this.addScore();
              }
              else {
                  ComUtils.setScale(curItem, INIT_SCALE);
                  ComUtils.setScale(preItem, INIT_SCALE);
                  this.setSelect(curItem, false);
                  this.setSelect(preItem, false);
              }
              this._preIdx = -1;
          }
          else {
              const item = this._list.getCell(index);
              const cardData = item.dataSource;
              if (!cardData || !cardData.isValid()) {
                  this._preIdx = -1;
                  return;
              }
              this._preIdx = index;
              const boxCard = item.getChildByName("boxCard");
              ComUtils.setScale(boxCard, BIG_SCALE);
              this.setSelect(boxCard, true);
          }
      }
      updateLevel() {
          const lab = this.ui.getChildByName("labLevel");
          lab.text = "关卡：" + this._proxy.model.getNextLevel();
      }
      addScore() {
          const now = Date.now();
          const diffTime = now - this._lastScoreTime;
          let score = 1;
          if (diffTime < 2 * 1000) {
              score = 5;
          }
          else if (diffTime < 5 * 1000) {
              score = 3;
          }
          this._lastScoreTime = now;
          this._proxy.model.updateScore(score);
          this.updateScore();
      }
      updateScore() {
          const lab = ComUtils.getNodeByNameList(this.ui, ["boxScore", "lab"]);
          lab.text = this._proxy.model.levelScore + "";
          lab.color = this._proxy.model.levelScore > 0 ? "#42e422" : "#ff4646";
      }
      resetScore() {
          this._lastScoreTime = 0;
          const lab = ComUtils.getNodeByNameList(this.ui, ["boxScore", "lab"]);
          lab.text = "0";
      }
      clearCardItem(box, index) {
          const idx = index;
          ComUtils.setTween(box, true, Handler$2.create(this, () => {
              const curImg = box.getChildByName("img");
              curImg.skin = "";
              const imgSel = box.getChildByName("imgSelected");
              imgSel.visible = false;
              this._proxy.model.deleteCard(idx);
          }));
      }
      setSelect(boxCard, isSel = false) {
          const imgSel = ComUtils.getNodeByNameList(boxCard, ["imgSelected"]);
          if (imgSel)
              imgSel.visible = isSel;
      }
      onBtnTips() {
          const cardList = this._proxy.model.getTipsCardDataList();
          if (cardList.length) {
              const cells = this._list.cells || [];
              for (let card of cardList) {
                  const idx = card.row * this._proxy.model.col + card.col;
                  const cardItem = cells[idx].getChildByName("boxCard");
                  if (cardItem) {
                      ComUtils.setTween(cardItem);
                  }
              }
          }
          else {
              showTips("无可消除的卡牌，请洗牌");
          }
          this._proxy.model.updateScore(-5);
      }
      onBtnRefresh() {
          const list = this._proxy.model.getRefreshCardDataList();
          this._list.array = list.reduce((a, b) => a.concat(b));
          this._list.refresh();
          showTips("洗牌成功！");
          this._proxy.model.updateScore(-10);
      }
      onClickRule() {
          facade$2.openView(1, 1, ruleDesc);
      }
  }

  var eventMgr$2 = base.eventMgr;
  var BaseMediator$3 = base.BaseMediator;
  var facade$3 = base.facade;
  class MahjongResultMdr extends BaseMediator$3 {
      constructor() {
          super("modules/mahjong/MahjongResult.scene", layerMgr.modal);
          addPopupMask();
      }
      addEvents() {
      }
      initUI() {
      }
      onClose() {
      }
      onOpen() {
          this._proxy = base.facade.getProxy(2, 2);
          this._param = this.params;
          this._lab = ComUtils.getNodeByNameList(this.ui, ["boxHtml", "lab"]);
          this.ui.btnHome.on(Laya.Event.CLICK, this, this.onClickHome);
          this.ui.btnNext.on(Laya.Event.CLICK, this, this.onClickNext);
          const btnNextLab = this.ui.btnNext.getChildByName("lab");
          if (!this._param || !this._param.type) {
              this._lab.text = `得分: ` + this._proxy.model.levelScore;
              btnNextLab.text = `下一关`;
              this._proxy.cMahjongSuccess();
          }
          else {
              this._lab.text = `挑战时间已到，挑战失败！`;
              btnNextLab.text = `重新挑战`;
          }
      }
      removeEvents() {
          this.ui.btnHome.off(Laya.Event.CLICK, this, this.onClickHome);
          this.ui.btnNext.off(Laya.Event.CLICK, this, this.onClickNext);
      }
      onClickHome() {
          console.warn("MahjongResultMdr.onClickHome...");
          facade$3.openView(2, 1);
          facade$3.closeView(2, 2);
          this.close();
      }
      onClickNext() {
          const challengeAgain = this._param && this._param.type === 1;
          console.warn(`MahjongResultMdr.onClickNext... challengeAgain:${challengeAgain}`);
          eventMgr$2.emit("mahjong_update_next", challengeAgain);
          this.close();
      }
      close() {
          super.close();
          removePopupMask();
      }
  }

  var BaseModule$1 = base.BaseModule;
  class MahjongModule extends BaseModule$1 {
      constructor() {
          super(2);
      }
      initCmd() {
      }
      initMdr() {
          this.regMdr(1, MahjongHomeMdr);
          this.regMdr(2, MahjongMdr);
          this.regMdr(3, MahjongResultMdr);
      }
      initProxy() {
          this.regProxy(2, MahjongProxy);
      }
  }

  function regModules() {
      base.facade.push(MiscModule);
      base.facade.push(MahjongModule);
  }
  function insModules() {
      base.facade.instantiate();
  }
  function initModules() {
      console.log(`[开始初始化模块]`);
      regModules();
      insModules();
  }

  const LOG_LEVEL_ORDER = {
      log: 1,
      info: 2,
      warn: 3,
      error: 4,
      debug: 5,
  };
  const LEVEL_ICON = {
      log: "📘",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      debug: "🐞",
  };
  const LEVEL_STYLES = {
      debug: { color: "white", background: "purple" },
      log: { color: "black", background: "#e0e0e0" },
      info: { color: "white", background: "deepskyblue" },
      warn: { color: "black", background: "gold" },
      error: { color: "white", background: "crimson" },
  };
  const FILTER_LEVEL = "warn";
  function pad(n, len = 2, prefix = "0") {
      const str = prefix.repeat(len) + n.toString();
      return str.slice(-len);
  }
  function padString(n, len = 5, prefix = " ") {
      const nLen = n.length;
      const difLen = len - nLen;
      return prefix.repeat(Math.ceil(difLen / 2)) + n + prefix.repeat(Math.floor(difLen / 2));
  }
  function getTimestamp() {
      const now = new Date();
      return `[${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
          `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}]`;
  }
  function wrapConsoleMethod(originalMethod, color = "", name = "") {
      return (...args) => {
          const logLevel = name || originalMethod.name;
          if (LOG_LEVEL_ORDER[logLevel] > LOG_LEVEL_ORDER[FILTER_LEVEL]) {
              return undefined;
          }
          const timestamp = getTimestamp();
          const logName = padString(logLevel, 5, " ");
          const icon = LEVEL_ICON[logLevel] || "";
          const prefix = `${timestamp}`;
          const style = color ? `background: ${color}; padding: 2px 4px; border-radius: 3px;` : "";
          originalMethod.call(console, `%c${logName}`, style, icon, prefix, ...args);
      };
  }
  let _originalMethods = {};
  function initEnhancedConsole() {
      if (!_originalMethods.log) {
          _originalMethods.log = console.log;
          _originalMethods.warn = console.warn;
          _originalMethods.error = console.error;
          _originalMethods.info = console.info;
          _originalMethods.debug = console.debug;
          console.warn = wrapConsoleMethod(console.log, "gold", "warn");
          console.error = wrapConsoleMethod(console.log, "red", "error");
          console.info = wrapConsoleMethod(console.info, "deepskyblue");
          console.debug = wrapConsoleMethod(console.debug, "violet");
          console.log = wrapConsoleMethod(console.log, "#909090");
      }
  }
  function restoreOriginalConsole() {
      if (_originalMethods.log) {
          console.log = _originalMethods.log;
          console.warn = _originalMethods.warn;
          console.error = _originalMethods.error;
          console.info = _originalMethods.info;
          console.debug = _originalMethods.debug;
          _originalMethods = {};
      }
  }

  var baseInit = base.baseInit;
  var facade$4 = base.facade;
  class Main {
      constructor() {
          if (window["Laya3D"])
              Laya3D.init(GameConfig.width, GameConfig.height);
          else
              Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
          Laya["Physics"] && Laya["Physics"].enable();
          Laya["DebugPanel"] && Laya["DebugPanel"].enable();
          Laya.stage.scaleMode = GameConfig.scaleMode;
          Laya.stage.screenMode = GameConfig.screenMode;
          Laya.stage.alignV = GameConfig.alignV;
          Laya.stage.alignH = GameConfig.alignH;
          Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
          if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
              Laya.enableDebugPanel();
          if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
              Laya["PhysicsDebugDraw"].enable();
          if (GameConfig.stat)
              Laya.Stat.show();
          Laya.alertGlobalError(true);
          initEnhancedConsole();
          Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
          initLayerMgr();
          initLoop();
          baseInit();
          initModules();
          GameCfg.init();
      }
      onVersionLoaded() {
          Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
      }
      onConfigLoaded() {
          facade$4.openView(2, 1);
      }
  }
  let _lastLoop = 0;
  let _rawLoop;
  let stage;
  function _loop() {
      const now = Date.now();
      const elapsed = now - _lastLoop;
      if (elapsed < 33) {
          return false;
      }
      _lastLoop = now;
      try {
          if (_rawLoop) {
              _rawLoop.call(Laya.stage);
          }
      }
      catch (e) {
          console.log(e);
      }
      base.baseLoop();
      return true;
  }
  function initLoop() {
      stage = Laya.stage;
      _rawLoop = stage._loop;
      stage._loop = _loop;
  }
  setInterval(_bgLoop, 1);
  function _bgLoop() {
      const now = Date.now();
      const elapsed = now - _lastLoop;
      if (elapsed < 33 * 1.5) {
          return;
      }
      _loop();
  }
  new Main();

}());
//# sourceMappingURL=bundle.js.map

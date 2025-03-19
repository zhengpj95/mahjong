(function () {
    'use strict';

    var View = Laya.View;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var modules;
        (function (modules) {
            var mahjong;
            (function (mahjong) {
                class MahjongUI extends Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("modules/mahjong/Mahjong");
                    }
                }
                mahjong.MahjongUI = MahjongUI;
                REG("ui.modules.mahjong.MahjongUI", MahjongUI);
                class MahjongHomeUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("modules/mahjong/MahjongHome");
                    }
                }
                mahjong.MahjongHomeUI = MahjongHomeUI;
                REG("ui.modules.mahjong.MahjongHomeUI", MahjongHomeUI);
                class MahjongResultUI extends View {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("modules/mahjong/MahjongResult");
                    }
                }
                mahjong.MahjongResultUI = MahjongResultUI;
                REG("ui.modules.mahjong.MahjongResultUI", MahjongResultUI);
            })(mahjong = modules.mahjong || (modules.mahjong = {}));
        })(modules = ui.modules || (ui.modules = {}));
    })(ui || (ui = {}));

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

    function getQualifiedClassName(value) {
        const type = typeof value;
        if (!value || (type !== "object" && !value.prototype)) {
            return type;
        }
        const prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__") && prototype["__class__"]) {
            return prototype["__class__"];
        }
        else if (type === "function" && value.name) {
            return value.name;
        }
        else if (prototype.constructor && prototype.constructor.name) {
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
    const PoolObjectName = "__PoolObjectName__";
    class PoolManager {
        constructor() {
            this._poolMap = {};
        }
        alloc(cls, ...args) {
            let className = getQualifiedClassName(cls);
            if (!this._poolMap[className]) {
                this._poolMap[className] = [];
            }
            let list = this._poolMap[className];
            if (list.length) {
                let vo = list.pop();
                if (vo["onAlloc"] && typeof (vo["onAlloc"]) === "function") {
                    vo["onAlloc"]();
                }
                return vo;
            }
            let clazz = new cls(...args);
            if (clazz["onAlloc"] && typeof (clazz["onAlloc"]) === "function") {
                clazz["onAlloc"]();
            }
            clazz[`${PoolObjectName}`] = className;
            return clazz;
        }
        free(obj) {
            if (!obj) {
                return false;
            }
            let refKey = obj[`${PoolObjectName}`];
            if (!refKey || !this._poolMap[refKey] || this._poolMap[refKey].indexOf(obj) > -1) {
                return false;
            }
            if (obj["onFree"] && typeof (obj["onFree"]) === "function") {
                obj["onFree"]();
            }
            this._poolMap[refKey].push(obj);
            return true;
        }
        clear() {
            this._poolMap = {};
        }
        getContent() {
            return this._poolMap;
        }
        setCount(count = 5) {
            for (let key in this._poolMap) {
                let list = this._poolMap[key];
                if (list.length > count) {
                    list.length = count;
                }
            }
        }
    }
    const poolMgr = new PoolManager();
    DebugUtils.debug("poolMgr", poolMgr);

    var EventDispatcher = Laya.EventDispatcher;
    class EventManager extends EventDispatcher {
        on(type, caller, listener, args) {
            return super.on(type, caller, listener, args);
        }
        off(type, caller, listener, onceOnly) {
            return super.off(type, caller, listener, onceOnly);
        }
        event(type, data) {
            return super.event(type, data);
        }
    }
    const eventMgr = new EventManager();
    DebugUtils.debug("eventMgr", eventMgr);

    var Scene$1 = Laya.Scene;
    const CARD_COUNT = 4;
    const CARD_NUM_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const CARD_TYPE_LIST = [1, 2];
    const FENG_TYPE_LIST = [5, 6];
    const CardTypeName = {
        [1]: "tong",
        [3]: "wan",
        [2]: "tiao",
        [4]: "feng"
    };
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
        updateData(row = 8, col = 10) {
            this.row = row;
            this.col = col;
            this.data = [];
        }
        clearData(isReset = false) {
            if (isReset) {
                this.level = 0;
            }
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
            for (let type of CARD_TYPE_LIST) {
                for (let num of CARD_NUM_LIST) {
                    list.push([type, num]);
                }
            }
            for (let feng of FENG_TYPE_LIST) {
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
            const lv = this.level;
            if (lv <= 10) {
                return 60 * 3;
            }
            else if (lv <= 20) {
                return 60 * 2;
            }
            return 90;
        }
        challengeAgain() {
            this.clearData();
            this.updateData();
        }
        showNext() {
            this.level += 1;
            this.clearData();
            this.updateData();
        }
        showResult(param) {
            eventMgr.event("mahjong_show_result");
            Scene$1.open("modules/mahjong/MahjongResult.scene", false, param);
        }
    }
    class MahjongCardData {
        updateInfo(row, col, data) {
            this.row = row;
            this.col = col;
            this.cardData = data;
            this["cardName"] = CardTypeName[data[0]] + data[1];
        }
        isValid() {
            return this.cardData && this.cardData.length > 0;
        }
        getIcon() {
            if (!this.cardData) {
                return "";
            }
            return `mahjong/${CardTypeName[this.cardData[0] + ""] + this.cardData[1]}.png`;
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

    class MahjongProxy {
        static ins() {
            if (!this._instance) {
                this._instance = new MahjongProxy();
                DebugUtils.debugClass(this._instance);
            }
            return this._instance;
        }
        get model() {
            if (!this._model) {
                this._model = new MahjongModel();
            }
            return this._model;
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

    var Sprite = Laya.Sprite;
    var Scene$2 = Laya.Scene;
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
            Scene$2.root;
            this.modal;
            this.tips;
        }
        get modal() {
            if (!this._modal) {
                this._modal = new Sprite();
                Scene$2["_modal_"] = Laya.stage.addChildAt(this._modal, 1);
                const modal = Scene$2["_modal_"];
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
                Scene$2["_tips_"] = Laya.stage.addChildAt(this._tips, 2);
                const tips = Scene$2["_tips_"];
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
    let layerMgr;
    function initLayerMgr() {
        layerMgr = new LayerManager();
        layerMgr.init();
    }

    var Box = Laya.Box;
    var Label = Laya.Label;
    var Image = Laya.Image;
    var Timer = Laya.Timer;
    var Tween = Laya.Tween;
    var Handler = Laya.Handler;
    var Sprite$1 = Laya.Sprite;
    class TipsItem extends Box {
        onAlloc() {
            this.size(600, 35);
            this.centerX = 0;
            this.centerY = -100;
            if (!this._img) {
                this._img = new Image();
                this._img.skin = `common/bg0.png`;
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
            Tween.to(this, { alpha: 0.6 }, 800, null, Handler.create(this, this.execTweenEnd, null, true), 800);
        }
        execTweenEnd() {
            this.removeSelf();
            Tween.clearAll(this);
            poolMgr.free(this);
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
                    const tipsItem = poolMgr.alloc(TipsItem);
                    tipsItem.text = strItem;
                    this._tipsList.push(tipsItem);
                }
            }
            else {
                const tipsItem = poolMgr.alloc(TipsItem);
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

    var Script = Laya.Script;
    var Image$1 = Laya.Image;
    function createImgMask() {
        const img = new Image$1();
        img.skin = `common/img_progress.png`;
        img.width = img.height = 0;
        img.sizeGrid = "11,49,8,46";
        return img;
    }
    class BarProgress extends Script {
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
        set value(val) {
            if (this._imgMask && this._imgBar) {
                this._imgMask.width = val * this._imgBar.width;
            }
        }
        get value() {
            if (this._imgMask && this._imgBar) {
                return this._imgMask.width / this._imgBar.width;
            }
            return 0;
        }
    }

    var Handler$1 = Laya.Handler;
    var Event$1 = Laya.Event;
    var SoundManager = Laya.SoundManager;
    var CallBack = base.CallBack;
    const INIT_SCALE = 0.4;
    const BIG_SCALE = 0.45;
    class MahjongMdr extends ui.modules.mahjong.MahjongUI {
        constructor() {
            super();
            this._preIdx = -1;
            this._lastScoreTime = 0;
            this._endTime = 0;
            this._proxy = MahjongProxy.ins();
        }
        createChildren() {
            super.createChildren();
            this._list = this.getChildByName("listItem");
            this._list.renderHandler = Handler$1.create(this, this.onRenderListItem, undefined, false);
            this._btnTips = this.getChildByName("btnTips");
            this._btnRefresh = this.getChildByName("btnRefresh");
            this._btnTips.clickHandler = Handler$1.create(this, this.onBtnTips, undefined, false);
            this._btnRefresh.clickHandler = Handler$1.create(this, this.onBtnRefresh, undefined, false);
            eventMgr.on("mahjong_update_next", this, this.onRefreshNext);
            eventMgr.on("mahjong_show_result", this, this.showResultToClear);
        }
        onOpened(param) {
            super.onOpened(param);
            this._proxy.model.clearData(true);
            Laya.loader.load("res/atlas/mahjong.atlas", Laya.Handler.create(this, this.onLoadedSuccess, undefined, true));
        }
        onClosed(type) {
            super.onClosed(type);
            this._preIdx = -1;
            this._btnTips.clickHandler.clear();
            this._btnTips.clickHandler = undefined;
            this._btnRefresh.clickHandler.clear();
            this._btnRefresh.clickHandler = undefined;
        }
        onLoadedSuccess() {
            console.warn("11111 onLoadedSuccess");
            this.onRefreshNext();
        }
        onRefreshNext(data) {
            console.warn(`11111 onRefreshNext`);
            if (data) {
                this._proxy.model.challengeAgain();
            }
            else {
                this._proxy.model.showNext();
            }
            this.resetScore();
            this.updateLevel();
            const list = this._proxy.model.getMahjongData();
            this._list.array = list.reduce((a, b) => a.concat(b));
            this.updateBar();
        }
        updateBar() {
            const now = Date.now() / 1000 >> 0;
            this._endTime = now + this._proxy.model.getChallengeTime();
            const bar = this.getChildByName("bar");
            const barComp = bar.getComponent(BarProgress);
            barComp.value = 1;
            base.tweenMgr.remove(bar);
            base.tweenMgr.get(bar).to({ value: 0 }, (this._endTime - now) * 1000, null, CallBack.alloc(this, this.onTimeOut, true));
        }
        showResultToClear() {
            const bar = this.getChildByName("bar");
            base.tweenMgr.remove(bar);
        }
        onTimeOut() {
            this._proxy.model.showResult({ type: 1 });
        }
        onRenderListItem(item, index) {
            const img = ComUtils.getNodeByNameList(item, ["boxCard", "img"]);
            const data = item.dataSource;
            if (!data) {
                img.skin = "";
                return;
            }
            item.tag = data;
            img.skin = data.getIcon();
            ComUtils.setScale(item.getChildByName("boxCard"), INIT_SCALE);
            item.on(Event$1.CLICK, this, this.onClickItem, [index]);
        }
        onClickItem(index) {
            if (this._preIdx > -1 && index === this._preIdx) {
                const boxCard = this._list.getCell(index).getChildByName("boxCard");
                this._preIdx = -1;
                ComUtils.setScale(boxCard, INIT_SCALE);
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
                    this.clearCardItem(preItem, this._preIdx);
                    this.addScore();
                }
                else {
                    ComUtils.setScale(curItem, INIT_SCALE);
                    ComUtils.setScale(preItem, INIT_SCALE);
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
            }
        }
        updateLevel() {
            const lab = this.getChildByName("labLevel");
            lab.text = "关卡：" + this._proxy.model.level;
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
            this._proxy.model.levelScore += score;
            this._lastScoreTime = now;
            const lab = ComUtils.getNodeByNameList(this, ["boxScore", "lab"]);
            lab.text = this._proxy.model.levelScore + "";
        }
        resetScore() {
            this._lastScoreTime = 0;
            const lab = ComUtils.getNodeByNameList(this, ["boxScore", "lab"]);
            lab.text = "0";
        }
        clearCardItem(box, index) {
            const idx = index;
            ComUtils.setTween(box, true, Handler$1.create(this, () => {
                const curImg = box.getChildByName("img");
                curImg.skin = "";
                this._proxy.model.deleteCard(idx);
            }));
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
        }
        onBtnRefresh() {
            const list = this._proxy.model.getRefreshCardDataList();
            this._list.array = list.reduce((a, b) => a.concat(b));
            this._list.refresh();
            showTips("洗牌成功！");
        }
    }

    var Scene$3 = Laya.Scene;
    var Handler$2 = Laya.Handler;
    class MahjongHomeMdr extends ui.modules.mahjong.MahjongHomeUI {
        createChildren() {
            super.createChildren();
            this._btnStart = this.getChildByName("btnStart");
            this._btnStart.clickHandler = Handler$2.create(this, this.onClickBtnStart, undefined, true);
        }
        onOpened(param) {
            super.onOpened(param);
            console.warn(`11111 MahjongHomeMdr.onOpened...`, param);
        }
        onClosed(type) {
            super.onClosed(type);
        }
        onClickBtnStart() {
            Scene$3.open("modules/mahjong/Mahjong.scene");
        }
    }

    var Scene$4 = Laya.Scene;
    var Event$2 = Laya.Event;
    class MahjongResultMdr extends ui.modules.mahjong.MahjongResultUI {
        createChildren() {
            super.createChildren();
            setLayerIndex(this, LayerIndex.MODAL);
            this._proxy = MahjongProxy.ins();
            this._lab = ComUtils.getNodeByNameList(this, ["boxHtml", "lab"]);
            this.btnHome.once(Event$2.CLICK, this, this.onClickHome);
            this.btnNext.once(Event$2.CLICK, this, this.onClickNext);
        }
        onOpened(param) {
            super.onOpened(param);
            this._param = param;
            if (!this._param || !this._param.type) {
                this._lab.text = `得分: ` + this._proxy.model.levelScore;
                this.btnNext.text.text = `下一关`;
            }
            else {
                this._lab.text = `挑战时间已到，挑战失败！`;
                this.btnNext.text.text = `重新挑战`;
            }
        }
        onClosed(type) {
            super.onClosed(type);
            this.btnHome.off(Event$2.CLICK, this, this.onClickHome);
            this.btnNext.off(Event$2.CLICK, this, this.onClickNext);
        }
        onClickHome() {
            console.warn("MahjongResultMdr.onClickHome...");
            Scene$4.open("modules/mahjong/MahjongHome.scene");
            this.close();
        }
        onClickNext() {
            console.warn("MahjongResultMdr.onClickNext...");
            const challengeAgain = this._param && this._param.type === 1;
            eventMgr.event("mahjong_update_next", challengeAgain);
            this.close();
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("modules/mahjong/MahjongMdr.ts", MahjongMdr);
            reg("script/BarProgress.ts", BarProgress);
            reg("modules/mahjong/MahjongHomeMdr.ts", MahjongHomeMdr);
            reg("modules/mahjong/MahjongResultMdr.ts", MahjongResultMdr);
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
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
            initLayerMgr();
            initLoop();
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    let _rowLoop;
    function _loop() {
        try {
            if (_rowLoop) {
                _rowLoop.call(Laya.stage);
            }
            base.baseLoop();
        }
        catch (e) {
            console.log(e);
        }
    }
    function initLoop() {
        let stage = Laya.stage;
        _rowLoop = stage["_loop"];
        stage["_loop"] = _loop;
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map

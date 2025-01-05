(function () {
    'use strict';

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
                class MainInfoUI extends Scene {
                    constructor() { super(); }
                    createChildren() {
                        super.createChildren();
                        this.loadScene("modules/mahjong/MainInfo");
                    }
                }
                mahjong.MainInfoUI = MainInfoUI;
                REG("ui.modules.mahjong.MainInfoUI", MainInfoUI);
            })(mahjong = modules.mahjong || (modules.mahjong = {}));
        })(modules = ui.modules || (ui.modules = {}));
    })(ui || (ui = {}));

    class PathNode {
        constructor(position, g, h, parent = null, direction = null) {
            this.position = position;
            this.g = g;
            this.h = h;
            this.parent = parent;
            this.direction = direction;
            if (this.getTurnCount()) {
                this.g += 1;
            }
        }
        get f() {
            return this.g + this.h;
        }
        getTurnCount() {
            if (!this.parent || !this.parent.direction || !this.direction) {
                return 0;
            }
            return this.direction.toString() !== this.parent.direction.toString() ? 1 : 0;
        }
    }
    class AStar {
        constructor(grid) {
            this._grid = grid;
        }
        heuristic(a, b) {
            return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
        }
        getNeighbors(node, end) {
            const [x, y] = node.position;
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0],
            ];
            const list = directions.map(([dx, dy]) => [[x + dx, y + dy], [dx, dy]]);
            return list.filter(([pos]) => end[0] === pos[0] && end[1] === pos[1]
                ? this._grid.isInBounds(pos[0], pos[1])
                : this._grid.isValid(pos[0], pos[1]));
        }
        findPath(start, end) {
            const openList = [];
            const closedSet = new Set();
            const startNode = new PathNode(start, 0, this.heuristic(start, end));
            openList.push(startNode);
            while (openList.length > 0) {
                openList.sort((a, b) => (a.f + a.getTurnCount()) - (b.f + b.getTurnCount()));
                const currentNode = openList.shift();
                if (currentNode.position[0] === end[0] && currentNode.position[1] === end[1]) {
                    const path = [];
                    let node = currentNode;
                    while (node) {
                        path.unshift(node.position);
                        node = node.parent;
                    }
                    return path;
                }
                closedSet.add(currentNode.position.toString());
                const neighbors = this.getNeighbors(currentNode, end);
                for (const [neighborPos, direction] of neighbors) {
                    if (closedSet.has(neighborPos.toString())) {
                        continue;
                    }
                    const g = currentNode.g + 1;
                    const h = this.heuristic(neighborPos, end);
                    const existingNode = openList.find(node => node.position[0] === neighborPos[0] && node.position[1] === neighborPos[1]);
                    if (!existingNode || g < existingNode.g) {
                        if (existingNode) {
                            openList.splice(openList.indexOf(existingNode), 1);
                        }
                        openList.push(new PathNode(neighborPos, g, h, currentNode, direction));
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
            this._pathData = [];
            this._sameCardMap = {};
        }
        updateData(row = 8, col = 10) {
            this.row = row;
            this.col = col;
            this.data = [];
        }
        clearData() {
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
                    const cardData = new MahjongCardData();
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
            this.data[row][col] = undefined;
            if (this._pathData.length) {
                this._pathData[row + 1][col + 1] = 0;
            }
            return true;
        }
        findPath(startData, targetData) {
            if (!startData || !targetData || !startData.checkSame(targetData)) {
                return [];
            }
            const startPoint = { row: startData.row + 1, col: startData.col + 1 };
            const targetPoint = { row: targetData.row + 1, col: targetData.col + 1 };
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
            const paths = this._astarMgr.findPath([startPoint.row, startPoint.col], [targetPoint.row, targetPoint.col]);
            return paths || [];
        }
        canConnect(startData, targetData) {
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
            for (let rows of this.data) {
                for (let item of rows) {
                    if (!item)
                        continue;
                    const connectList = this.getConnectCardDataList(item);
                    if (!connectList.length)
                        continue;
                    for (let card of connectList) {
                        if (!card || card.checkPos(item))
                            continue;
                        if (!this.data[card.row][card.col])
                            continue;
                        const paths = this.findPath(item, card);
                        if (!paths.length)
                            continue;
                        if (paths.length === 2) {
                            return [item, card];
                        }
                        if (paths.length < minPath) {
                            rst = [item, card];
                            minPath = paths.length;
                        }
                    }
                }
            }
            return rst;
        }
    }
    class MahjongCardData {
        updateInfo(row, col, data) {
            this.row = row;
            this.col = col;
            this.cardData = data;
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
            return data.cardData[0] === this.cardData[0] && data.cardData[1] === this.cardData[1];
        }
        checkPos(data) {
            if (!data) {
                return false;
            }
            return data.row === this.row && data.col === this.col;
        }
    }

    class MahjongProxy {
        static ins() {
            if (!this._instance) {
                this._instance = new MahjongProxy();
                window[this._instance.constructor.name] = this._instance;
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
    }

    var Handler = Laya.Handler;
    var Event$1 = Laya.Event;
    var SoundManager = Laya.SoundManager;
    const INIT_SCALE = 0.4;
    const BIG_SCALE = 0.45;
    class MahjongMdr extends ui.modules.mahjong.MahjongUI {
        constructor() {
            super();
            this._preIdx = -1;
            this._proxy = MahjongProxy.ins();
        }
        createChildren() {
            super.createChildren();
            this._list = this.getChildByName("listItem");
            this._list.renderHandler = Handler.create(this, this.onRenderListItem, undefined, false);
            this._btnTips = this.getChildByName("btnTips");
            this._btnRefresh = this.getChildByName("btnRefresh");
            this._btnTips.clickHandler = Handler.create(this, this.onBtnTips, undefined, false);
            this._btnRefresh.clickHandler = Handler.create(this, this.onBtnRefresh, undefined, false);
            Laya.loader.load("res/atlas/mahjong.atlas", Laya.Handler.create(this, this.onLoadedSuccess));
            SoundManager.autoStopMusic = false;
            SoundManager.playMusic("audio/mixkit-tick-tock-clock-timer-music.wav", 0);
        }
        onOpened(param) {
            super.onOpened(param);
        }
        onClosed(type) {
            super.onClosed(type);
            this._preIdx = -1;
        }
        onLoadedSuccess() {
            console.log("11111 onLoadedSuccess");
            this._proxy.model.updateData(8, 10);
            const list = this._proxy.model.getMahjongData();
            this._list.array = list.reduce((a, b) => a.concat(b));
        }
        onRenderListItem(item, index) {
            const img = item.getChildByName("boxCard").getChildByName("img");
            const data = item.dataSource;
            if (!data) {
                img.skin = "";
                return;
            }
            item.tag = data;
            img.skin = data.getIcon();
            item.on(Event$1.CLICK, this, this.onClickItem, [index]);
            item.on(Event$1.MOUSE_DOWN, this, this.onClickMouseDown, [index]);
            item.on(Event$1.MOUSE_UP, this, this.onClickMouseUp, [index]);
            item.on(Event$1.MOUSE_OUT, this, this.onClickMouseUp, [index]);
        }
        onClickItem(index) {
            SoundManager.playSound("audio/mixkit-flop.wav");
            if (this._preIdx > -1 && index !== this._preIdx) {
                const curItemData = this._list.getItem(index);
                const preItemData = this._list.getItem(this._preIdx);
                const curItem = this._list.getCell(index).getChildByName("boxCard");
                const preItem = this._list.getCell(this._preIdx).getChildByName("boxCard");
                if (curItemData.checkSame(preItemData) && this._proxy.model.canConnect(curItemData, preItemData)) {
                    ComUtils.setScale(curItem, BIG_SCALE);
                    this.clearCardItem(curItem, index);
                    this.clearCardItem(preItem, this._preIdx);
                }
                else {
                    ComUtils.setScale(curItem, INIT_SCALE);
                    ComUtils.setScale(preItem, INIT_SCALE);
                }
                this._preIdx = -1;
            }
            else {
                this._preIdx = index;
                const item = this._list.getCell(index).getChildByName("boxCard");
                ComUtils.setScale(item, BIG_SCALE);
            }
        }
        clearCardItem(box, index) {
            const idx = index;
            ComUtils.setTween(box, true, Handler.create(this, () => {
                const curImg = box.getChildByName("img");
                curImg.skin = "";
                this._proxy.model.deleteCard(idx);
            }));
        }
        onClickMouseDown(index) {
        }
        onClickMouseUp(index) {
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
        }
        onBtnRefresh() {
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("modules/mahjong/MahjongMdr.ts", MahjongMdr);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "modules/mahjong/Mahjong.scene";
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
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map

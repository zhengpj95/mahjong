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

    const CARD_COUNT = 4;
    const CARD_NUM_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const CARD_TYPE_LIST = [1, 2];
    const FENG_TYPE_LIST = [5, 6];
    const CardTypeName = {
        [1]: "tong",
        [3]: "wan",
        [2]: "tiao",
        [4]: "feng",
    };
    class MahjongModel {
        constructor() {
            this.row = 8;
            this.col = 10;
            this.data = [];
        }
        updateRowCol(row, col) {
            this.row = row;
            this.col = col;
            this.data = [];
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
            return this._rowColStrList;
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
            index += 1;
            const row = index / 10 >> 0;
            const col = index % 10 - 1;
            if (!this.data || !this.data[row]) {
                return false;
            }
            this.data[row][col] = undefined;
            return true;
        }
        getDirectionList(index) {
            const leftIdx = Math.max(0, index - 1);
            const rightIdx = Math.max(index + 1, this.col - 1);
            const topIdx = Math.max(0, index - this.col);
            const bottomIdx = Math.max(index + this.col, this.row - 1);
            return [topIdx, rightIdx, bottomIdx, leftIdx];
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
    }

    class MahjongProxy {
        constructor() {
            this.data.updateRowCol(8, 10);
        }
        static ins() {
            if (!this._instance) {
                this._instance = new MahjongProxy();
            }
            return this._instance;
        }
        get data() {
            if (!this._data) {
                this._data = new MahjongModel();
            }
            return this._data;
        }
    }

    var Handler = Laya.Handler;
    var Event = Laya.Event;
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
            Laya.loader.load("res/atlas/mahjong.atlas", Laya.Handler.create(this, this.onLoadedSuccess));
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
            const list = this._proxy.data.getMahjongData();
            this._list.array = list.reduce((a, b) => a.concat(b));
            console.log(list);
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
            item.on(Event.CLICK, this, this.onClickItem, [index]);
            item.on(Event.MOUSE_DOWN, this, this.onClickMouseDown, [index]);
            item.on(Event.MOUSE_UP, this, this.onClickMouseUp, [index]);
            item.on(Event.MOUSE_OUT, this, this.onClickMouseUp, [index]);
        }
        onClickItem(index) {
            if (this._preIdx > -1) {
                const curItemData = this._list.getItem(index);
                const preItemData = this._list.getItem(this._preIdx);
                if (curItemData === preItemData) {
                    const curImg = this._list.getCell(index).getChildByName("boxCard").getChildByName("img");
                    curImg.skin = "";
                    const preImg = this._list.getCell(this._preIdx).getChildByName("boxCard").getChildByName("img");
                    preImg.skin = "";
                }
                console.log(11111, index, this._preIdx, curItemData, preItemData);
                this._proxy.data.deleteCard(index);
                this._proxy.data.deleteCard(this._preIdx);
                this._preIdx = -1;
            }
            else {
                this._preIdx = index;
            }
        }
        onClickMouseDown(index) {
        }
        onClickMouseUp(index) {
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
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
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

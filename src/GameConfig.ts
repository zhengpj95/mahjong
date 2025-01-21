/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import MahjongMdr from "./modules/mahjong/MahjongMdr"
import MahjongHomeMdr from "./modules/mahjong/MahjongHomeMdr"
import MahjongResultMdr from "./modules/mahjong/MahjongResultMdr"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=640;
    static height:number=1136;
    static scaleMode:string="showall";
    static screenMode:string="none";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="modules/mahjong/MahjongHome.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("modules/mahjong/MahjongMdr.ts",MahjongMdr);
        reg("modules/mahjong/MahjongHomeMdr.ts",MahjongHomeMdr);
        reg("modules/mahjong/MahjongResultMdr.ts",MahjongResultMdr);
    }
}
GameConfig.init();
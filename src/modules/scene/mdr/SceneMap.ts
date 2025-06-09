import Sprite = Laya.Sprite;
import Image = Laya.Image;
import Handler = Laya.Handler;
import UIComponent = Laya.UIComponent;
import { IMapData, MapCellData } from "../model/MapConst";

/**
 * @date 2025/6/9
 */
export class SceneMap extends Sprite {
  private _mapId: number;
  private _miniImg: Image;
  private _sprite: Sprite;
  private _bmpMap: Record<string, MapBmp> = {};

  constructor() {
    super();
  }

  public init(mapId: number): void {
    this._mapId = mapId;
    this._sprite = new Sprite();
    this.addChild(this._sprite);

    this.setBg();
  }

  private setBg(): void {
    Laya.loader.load(
      `resources/map/${this._mapId}/info.json`,
      Handler.create(this, this.onLoad),
      null,
      Laya.Loader.JSON,
      4,
    );
  }

  private onLoad(mapData: IMapData): void {
    const img = new Image();
    img.skin = `resources/map/${this._mapId}/mini.jpg`;
    img.width = mapData.width;
    img.height = mapData.height;
    this._miniImg = img;
    this.addChildAt(img, 0);

    const rows = Math.ceil(mapData.height / mapData.sliceHeight);
    const cols = Math.ceil(mapData.width / mapData.sliceWidth);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const bmp = new MapBmp();
        bmp.init(this._mapId, i, j);
        this._sprite.addChild(bmp);
        this._bmpMap[bmp.name] = bmp;
      }
    }
  }
}

/**
 * 地图块
 */
class MapBmp extends UIComponent {
  private _bmp: Image;

  public init(mapId: number, row: number, col: number): void {
    const url = `resources/map/${mapId}/tiles/${row}_${col}.jpg`;
    this.x = col * MapCellData.GameSliceWidth;
    this.y = row * MapCellData.GameSliceHeight;
    this.name = `${mapId}_${row}_${col}`;

    if (!this._bmp) {
      this._bmp = new Image();
      this.addChild(this._bmp);
    }

    this._bmp.skin = url;
  }

  public destroy(destroyChild?: boolean) {
    super.destroy(destroyChild);
  }

  public onDestroy() {
    super.onDestroy();
    this._bmp && this._bmp.destroy();
  }
}

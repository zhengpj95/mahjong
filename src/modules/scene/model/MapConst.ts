export interface IMapData {
  blocks: number[][];
  cellHeight: number;
  cellWidth: number;
  height: number;
  width: number;
  sliceWidth: number;
  sliceHeight: number;
  path: string;
}

export class MapCellData {
  public static GameCellWidth = 32;
  public static GameCellHeight = 32;

  public static GameSliceWidth = 256;
  public static GameSliceHeight = 256;

  public static GameAoiWidth: number = 256;
  public static GameAoiHeight: number = 256;
}

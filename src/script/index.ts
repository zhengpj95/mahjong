/**
 * @date 2025/3/22
 */
import Label = Laya.Label;
import Box = Laya.Box;
import Image = Laya.Image;


/** 进度条组件 */
export type BarProgressComp = Box & {
  imgBar: Image;
  lab: Label;
  value: number;
}

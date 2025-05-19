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
  value: number; // 进度比例，比如：1/100
  text: string;  // 进度文本，比如：50%, 1/100
}

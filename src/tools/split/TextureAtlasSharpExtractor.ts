/**
 * @author zpj
 * @date 2025/8/14
 * 使用 TypeScript + Node.js 从 TexturePacker 的 texture 格式图集中拆分出单张图片。
 * 支持 rotated / trimmed 图片，还原到原始尺寸。
 *
 * 依赖：npm install sharp fs-extra
 */

import path from "node:path";
import sharp from "sharp";
import fs from "node:fs/promises";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface FrameData {
  frame: Rect;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: Rect; // x/y 为贴回原图的偏移；w/h 为 trim 后尺寸
  sourceSize: { w: number; h: number }; // 原始未裁剪尺寸
}

interface TextureJSON {
  frames: Record<string, FrameData>;
  meta: { image: string; size: { w: number; h: number }; scale: string };
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true; // 能访问，说明存在
  } catch {
    return false; // 抛错 → 不存在
  }
}

export class TextureAtlasSharpExtractor {
  constructor(
    private jsonPath: string,
    private outputDir: string,
    private type: "texture" = "texture", // 唯一参数：图集格式，这里固定使用 'texture'
  ) {
    if (this.type !== "texture") throw new Error("仅支持 'texture' 格式");
  }

  async extractAll() {
    const data: TextureJSON = JSON.parse(
      await fs.readFile(this.jsonPath, "utf-8"),
    );
    const pngPath = path.resolve(path.dirname(this.jsonPath), data.meta.image);
    if (!(await pathExists(pngPath))) {
      throw new Error(`找不到图集 PNG：${pngPath}`);
    }

    await fs.mkdir(this.outputDir, { recursive: true });
    const atlas = sharp(pngPath);

    for (const [name, f] of Object.entries(data.frames)) {
      await this.extractFrame(atlas, name, f);
    }
    console.log(`✅ Done → ${this.outputDir}`);
  }

  /** 提取并还原单张图片（兼容 rotated + trimmed） */
  private async extractFrame(
    atlasImage: sharp.Sharp,
    name: string,
    frame: FrameData,
  ) {
    const { x, y, w, h } = frame.frame;

    // 裁剪当前帧
    let img = atlasImage
      .clone()
      .extract({ left: x, top: y, width: w, height: h });

    // 如果是旋转的，TexturePacker 是顺时针旋转 90° 存储的
    if (frame.rotated) {
      img = atlasImage
        .clone()
        .extract({ left: x, top: y, width: h, height: w }); // 旋转的话，是把 w h 互换处理的

      img = img.rotate(270); // 顺时针 90° → rotate(90)
    }

    // 如果 trimmed，需要补透明像素到原始尺寸
    if (frame.trimmed) {
      const { w: fullW, h: fullH } = frame.sourceSize;
      const { x: offsetX, y: offsetY } = frame.spriteSourceSize;

      // 创建透明画布
      const emptyBuffer = await sharp({
        create: {
          width: fullW,
          height: fullH,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .png()
        .toBuffer();

      const croppedBuffer = await img.png().toBuffer();

      // 把裁剪好的图贴到透明画布上
      img = sharp(emptyBuffer).composite([
        { input: croppedBuffer, left: offsetX, top: offsetY },
      ]);
    }

    // 保存文件
    const savePath = path.join(this.outputDir, `${name}.png`);
    await img.toFile(savePath);
    console.log(`🖼 生成: ${savePath}`);
  }
}

// 使用示例
(async () => {
  const intputDir = path.resolve(
    "C:\\Users\\zpj\\Desktop\\online_resources",
    "bubble_shooter.json",
  );
  const outputDir = path.resolve(
    "C:\\Users\\zpj\\Desktop\\online_resources",
    "output",
  );
  const extractor = new TextureAtlasSharpExtractor(
    intputDir, // JSON 文件
    outputDir, // 输出目录
    "texture", // 格式类型
  );
  await extractor.extractAll();
})();

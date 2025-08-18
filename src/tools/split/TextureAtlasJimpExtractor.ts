import fs from "node:fs/promises";
import path from "node:path";
import { Jimp } from "jimp";

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
  spriteSourceSize: Rect;
  sourceSize: { w: number; h: number };
}

interface TextureJSON {
  frames: Record<string, FrameData>;
  meta: { image: string; size: { w: number; h: number }; scale: string };
}

export class TextureAtlasJimpExtractor {
  constructor(
    private jsonPath: string,
    private outputDir: string,
    private type: "texture" = "texture",
  ) {
    if (this.type !== "texture") {
      throw new Error("仅支持 'texture' 格式");
    }
  }

  async extractAll() {
    // 读取 JSON
    const rawJson = await fs.readFile(this.jsonPath, "utf-8");
    const data: TextureJSON = JSON.parse(rawJson);

    // PNG 路径
    const pngPath = path.resolve(path.dirname(this.jsonPath), data.meta.image);
    await this.assertExists(pngPath, `找不到图集 PNG：${pngPath}`);

    // 输出目录
    await fs.mkdir(this.outputDir, { recursive: true });

    // 遍历 frames
    for (const [name, frame] of Object.entries(data.frames)) {
      await this.extractFrame(name, frame, pngPath);
    }

    console.log(`✅ 拆分完成 → ${this.outputDir}`);
  }

  private async extractFrame(name: string, f: FrameData, pngPath: string) {
    const atlas = await Jimp.read(pngPath);
    const { x, y, w, h } = f.frame;
    let sub: { write: (d: any) => Promise<void> };

    if (f.rotated) {
      // rotated: true → 图集里顺时针 90°，要逆时针旋回
      sub = atlas.clone().crop({ x, y, w: h, h: w }).rotate(-90);
    } else {
      sub = atlas.clone().crop({ x, y, w, h });
    }

    // 如果 trimmed，还原到原始尺寸画布
    if (f.trimmed) {
      const { w: fullW, h: fullH } = f.sourceSize;
      const { x: offX, y: offY } = f.spriteSourceSize;
      const canvas = new Jimp({
        width: fullW,
        height: fullH,
        color: 0x00000000,
      }); // 透明背景
      canvas.composite(sub, offX, offY);
      sub = canvas;
    }

    const savePath = path.join(this.outputDir, `${name}.png`);
    await sub.write(savePath);
    console.log(`🖼 生成: ${name} ${savePath}`);
  }

  private async assertExists(filePath: string, errMsg: string) {
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(errMsg);
    }
  }
}

//
// // 使用示例
// (async () => {
//   const inputJson = path.resolve(
//     "C:\\Users\\zpj\\Desktop\\online_resources",
//     "bubble_shooter.json",
//   );
//   const outputDir = path.resolve(
//     "C:\\Users\\zpj\\Desktop\\online_resources",
//     "output_images",
//   );
//   try {
//     const extractor = new TextureAtlasExtractor(
//       inputJson,
//       outputDir,
//       "texture",
//     );
//     await extractor.extractAll();
//   } catch (e) {
//     console.log(e);
//   }
// })();

import * as path from "path";
import * as fs from "fs";

interface SceneStructure {
  name: string;
  _$id: string;
  _$child: ChildStructure[];
  _$runtime: string;
  _$type: string;
  _$ver: number;
}

interface ChildStructure {
  name: string;
  _$id: string;
  _$var: boolean;
  _$type: string;
  _$child: ChildStructure[];
  _$prefab?: string; // 预制体唯一id
}

/**
 * 生成场景的 .d.ts 文件
 * @author zpj
 * @date 2025/5/21
 */
@IEditorEnv.regSceneHook()
class BuildSceneUIHook implements IEditorEnv.ISceneHook {
  onCreateNode(scene: IEditorEnv.IGameScene, node: Laya.Node): void {
    if (node instanceof Laya.Sprite) {
      console.log("onCreateNode: ", node);
    }
  }

  private createNode(child: ChildStructure, obj: any): void {
    let prefab = "";
    if (child.name?.startsWith("$")) {
      if (child._$prefab) {
        prefab = child._$prefab;
      } else {
        obj[child.name] = {};
        obj[child.name].node = "Laya." + child._$type;
        if (child._$child?.length) {
          obj[child.name].childs = {};
          for (let c of child._$child) {
            this.createNode(c, obj[child.name].childs);
          }
        }
      }
    }
    if (prefab) {
      // console.log(`11111 prefab: `, prefab); // todo
    }
  }

  private createNodeStr(k: string, child: { node: string, childs: any }, deep = 0): string {
    if (!child?.node) return "";
    let str = "  ".repeat(deep) + `${k}: ${child.node}`;
    if (child?.childs && Object.keys(child.childs).length) {
      str += ` & {\n`;
      for (let k in child.childs) {
        str += this.createNodeStr(k, child.childs[k], deep + 1) + "\n";
      }
      str += "  ".repeat(deep) + "}";
    }
    str += ";";
    return str;
  }

  onSaveScene(scene: IEditorEnv.IMyScene, data: SceneStructure): void {
    const _children = data?._$child ?? [];
    const obj: { [key: string]: { node: string, childs: any } } = {};
    for (const child of _children) {
      this.createNode(child, obj);
    }

    // @ts-ignore 宏定义
    if (DEBUG) {
      console.log(1111, scene);
      console.log(1111, data);
    }

    const scenePath: string = (scene as any)["_sceneFilePath"];
    if (!scenePath.endsWith(".ls")) {
      return; // 不是场景文件，过滤
    }
    const [fileDir, fileName] = getSceneUIName(scenePath);
    let str = `/** ${fileDir} */\n` + `export interface ${fileName} extends Laya.Scene { \n`;
    if (Object.keys(obj).length) {
      for (const key in obj) {
        str += this.createNodeStr(key, obj[key], 1) + "\n";
      }
    }
    str += "}\n";
    const tsPath = getDtsFileName(scenePath);
    const tsPathDir = path.dirname(tsPath);
    if (!fs.existsSync(tsPathDir)) {
      fs.mkdirSync(tsPathDir, { recursive: true });
    }

    fs.writeFile(tsPath, str, "utf-8", (err) => {
      if (err) {
        console.log(`❌ BuildSceneUIHook build error: ${fileDir}`, err);
      } else {
        console.log(`✅ BuildSceneUIHook build success: ${fileDir}`);
      }
    });
  }
}

// [ scene/mahjong/MahjongHome.ls, MahjongHomeScene ]
function getSceneUIName(scenePath: string): [string, string] {
  const scenePathAry: string[] = scenePath.split(path.sep);
  const assetsIdx = scenePathAry.indexOf("assets");
  const fileDir = scenePathAry.slice(assetsIdx + 1).join("/");
  const fileName = scenePathAry[scenePathAry.length - 1].replace(".ls", "") + "Scene";
  return [fileDir, fileName];
}

// [ xxx/src/3rd-types/xxx.d.ts ]
function getDtsFileName(scenePath: string): string {
  const scenePathAry: string[] = scenePath.split(path.sep);
  const assetsIdx = scenePathAry.indexOf("assets");
  return path.join(scenePathAry.slice(0, assetsIdx).join("/"), "src/3rd-types", `${scenePathAry[scenePathAry.length - 2]}.d.ts`);
}
import * as path from "path";
import { GenUIDts } from "./GenUIDts";
import { toolsObj } from "../index";

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
class GenUISceneHook implements IEditorEnv.ISceneHook {
  onCreateNode(
    scene: IEditorEnv.IMyScene,
    node: Laya.Node,
  ): void | Promise<void> {
    if (node instanceof Laya.Image) {
      Laya.loader.load(node.skin).then((r: Laya.Texture) => {
        if (!r) {
          node.skin = ""; // 清除image的skin默认值
        }
      });
    } else if (
      node instanceof Laya.FontClip ||
      node instanceof Laya.Clip ||
      node instanceof Laya.Button
    ) {
      node.skin = "";
    }
  }

  async onSaveScene(
    scene: IEditorEnv.IMyScene,
    data: SceneStructure,
  ): Promise<void> {
    const scenePath: string = (scene as any)["_sceneFilePath"];
    if (!scenePath.endsWith(".ls")) {
      return; // 不是场景文件，过滤
    }
    const filePath = path.dirname(scenePath.replace(toolsObj.ProjectRoot, ""));
    GenUIDts.generateDts(filePath)
      .then(() => {
        console.log(`✅ gen ui 执行成功`);
      })
      .catch((err) => {
        console.log(`❌ gen ui 执行错误 `, err, filePath);
      });
  }
}

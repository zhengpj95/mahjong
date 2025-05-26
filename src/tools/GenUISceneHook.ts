import * as path from "path";
import { FsUtils } from "./FsUtils";
import { GenUIDts } from "./GenUIDts";

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
  async onSaveScene(scene: IEditorEnv.IMyScene, data: SceneStructure): Promise<void> {
    const scenePath: string = (scene as any)["_sceneFilePath"];
    if (!scenePath.endsWith(".ls")) {
      return; // 不是场景文件，过滤
    }
    let filePath = path.dirname(scenePath.replace(FsUtils.ProjectRoot, ""));
    GenUIDts.generateDts(filePath).then(() => {
      console.log(`✅ gen ui 执行成功`);
    }).catch((err) => {
      console.log(`❌ gen ui 执行错误 `, err);
    });
  }
}

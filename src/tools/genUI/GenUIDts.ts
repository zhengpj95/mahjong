import { FsUtils } from "../FsUtils";
import * as fs from "fs/promises";
import * as path from "path";
import { toolsObj, toPascalCase } from "../index";

interface NodeInfo {
  type?: string;
  id?: string;
  name?: string;
  node?: NodeInfo;
  comp?: string[];

  [key: string]: any;
}

interface ViewInfo {
  [key: string]: NodeInfo;
}

// 组件结构
interface IComponentNode {
  _$type: string;
  scriptPath: string;

  [key: string]: any;
}

// 节点结构
interface IChildNode {
  name: string;
  _$id?: string;
  _$type: string;
  _$prefab?: string;
  _$child?: IChildNode[];
  _$comp?: IComponentNode[];

  _$override?: string;

  [key: string]: any;
}

/**
 * @author zpj
 * @date 2025/5/23
 */
export class GenUIDts {

  public static async generateDts(dir: string): Promise<void> {
    const basename = path.basename(dir);
    const files = await FsUtils.walk(dir, ".ls");
    const map = new Map<string, ViewInfo>();
    for (const file of files) {
      const content = await fs.readFile(file, { encoding: "utf-8" });
      const child = (JSON.parse(content) as IChildNode)?._$child ?? [];

      // @ts-ignore
      if (DEBUG) {
        console.log(`▶️ start to generate ls file: `, file.replace(toolsObj.ProjectRoot, ""));
      }

      const obj: ViewInfo = {};
      for (let c of child) {
        if (c._$type === "List") {
          const renderObj = {};
          await this.parseChild(c._$child[0]?._$child[0], renderObj, 0);
          const cName = toPascalCase(c.name.replace("$", ""));
          map.set(file.replace(toolsObj.ProjectRoot, "") + cName, renderObj);
          (renderObj as any)["isRender"] = true; // list的item子项
        }
        await this.parseChild(c, obj, 0);
      }

      let fileName = file.replace(toolsObj.ProjectRoot, "");
      map.set(fileName, obj);
    }
    const fileContent = this.createViewStr(map);
    await this.writeDtsFile(fileContent, basename);
  }

  public static async parseChild(child: IChildNode, parent: {
    [key: string]: NodeInfo
  }, deep = 0, isPrefab = false): Promise<void> {
    const name: string = child?.name;
    if (child?._$prefab) {
      const prefabInfo = await this.createPrefabNode(child._$prefab, name);
      if (child?._$comp?.length) {
        const compList: string[] = [];
        for (let c of child._$comp) {
          const compStr = await this.createComponentNode(c.scriptPath);
          if (compStr?.length) {
            compList.push(...compStr);
          }
        }
        if (compList?.length) {
          if (prefabInfo.comp?.length) {
            prefabInfo.comp.push(...compList);
          } else {
            prefabInfo.comp = compList;
          }
        }
      }
      if (child?._$child?.length) {
        const overrideObj: { [key: string]: string } = {};
        for (let c of child._$child) {
          if (c._$override) {
            overrideObj[c._$override] = c.name; // 重命名
          } else {
            await this.parseChild(c, prefabInfo.node); // 新加组件
          }
        }

        if (prefabInfo.node && Object.keys(overrideObj)) {
          for (let k in prefabInfo.node) {
            const n: NodeInfo = prefabInfo.node[k];
            if (n.id && overrideObj[n.id]) {
              n.name = overrideObj[n.id];
            }
          }
        }
      }
      if (prefabInfo) {
        parent[name] = prefabInfo;
      }
      return;
    }
    if (!name?.startsWith("$") && !isPrefab) {
      return;
    }
    let obj: NodeInfo = parent[name];
    if (!obj) {
      obj = parent[name] = <NodeInfo>{};
    }
    obj.id = child._$id;
    obj.name = name;
    obj.type = `Laya.${child._$type}`;
    if (child._$comp) {
      const compList: string[] = [];
      for (let c of child._$comp) {
        const compStr = await this.createComponentNode(c.scriptPath);
        if (compStr?.length) {
          compList.push(...compStr);
        }
      }
      if (compList.length) {
        obj.comp = compList;
      }
    }
    if (child?._$child?.length) {
      for (let c of child._$child) {
        const cname: string = c.name;
        if (!cname?.startsWith("$")) {
          continue;
        }
        if (!obj.node) obj.node = {};
        await this.parseChild(c, obj.node, deep + 1);
      }
    }
  }

  public static createViewStr(map: Map<string, ViewInfo>): string {
    if (!map) return "";
    const entries = map.entries();
    const lines: string[] = [];
    for (let [key, view] of entries) {
      const isRender = !!view["isRender"]; // 处理list的item子项，独立的继承Box组件
      const basename = path.basename(key).replace(".ls", "");
      let lsKey = key.replace(/\\/g, "/");
      if (!lsKey.endsWith(".ls")) {
        lsKey = lsKey.replace(".ls", ".ls ");
      }
      lines.push(`/** ${lsKey} */\n`);
      lines.push(`export interface ${basename}${isRender ? "Render" : "View"} extends Laya.${isRender ? "Box" : "Scene"} {\n`);
      for (let k in view) {
        if (typeof view[k] === "string") continue;
        lines.push(...this.createViewNode(view[k], 1));
      }
      lines.push("}\n\n");
    }
    return lines.join("");
  }

  public static createViewNode(node: NodeInfo, deep = 1): string[] {
    if (!node?.name?.startsWith("$")) return [];
    const lines: string[] = ["  ".repeat(deep) + `${node.name}: ${node.type}`];
    if (node?.node && Object.keys(node?.node).length) {
      let rst1: string[] = [];
      for (let k in node.node) {
        rst1 = rst1.concat(this.createViewNode(node.node[k], deep + 1));
      }
      lines.push(" & {\n");
      lines.push(...rst1);
      if (node?.comp?.length) {
        for (const c of node.comp) {
          lines.push("  ".repeat(deep + 1) + c + "\n");
        }
      }
      lines.push("  ".repeat(deep) + "};\n");
    } else if (node?.comp?.length) {
      lines.push(` & {\n`);
      node.comp.forEach(value => {
        lines.push("  ".repeat(deep + 1) + value + "\n");
      });
      lines.push("  ".repeat(deep) + "};\n");
    } else {
      lines.push(";\n");
    }
    return lines;
  }

  public static async createPrefabNode(uuid: string, name: string): Promise<NodeInfo | undefined> {
    let prefabPath = await FsUtils.getPrefabByUUID(uuid);
    if (!prefabPath) return undefined;
    const prefabContent = await fs.readFile(prefabPath, { encoding: "utf-8" });
    if (!prefabContent) return undefined;
    const prefabJson: IChildNode = JSON.parse(prefabContent);
    const obj = <NodeInfo>{};
    obj.id = prefabJson._$id;
    obj.type = `Laya.${prefabJson._$type}`;
    obj.name = name;
    if (prefabJson._$child?.length) {
      obj.node = {};
      for (const c of prefabJson._$child) {
        await this.parseChild(c, obj.node, 1, true);
      }
    }
    if (prefabJson._$comp) {
      const compList: string[] = [];
      for (const c of prefabJson._$comp) {
        const compStr = await this.createComponentNode(c.scriptPath);
        if (compStr?.length) {
          compList.push(...compStr);
        }
      }
      if (compList?.length) {
        obj.comp = compList;
      }
    }
    return obj;
  }

  public static async createComponentNode(scriptPath: string): Promise<string[]> {
    if (!scriptPath) return [];
    const basename = path.basename(scriptPath);
    const compName = basename.replace(".ts", "");
    const prefabUIContent = await fs.readFile(path.join(toolsObj.ProjectRoot, "src/tools", "genUI/PrefabUI.json"), { encoding: "utf-8" });
    return JSON.parse(prefabUIContent)[compName] ?? [];
  }

  public static async writeDtsFile(fileContent: string, basename: string): Promise<void> {
    const rooPath = path.join(toolsObj.ProjectRoot + "src/3rd-types",);
    const filePath = path.join(rooPath, basename + ".d.ts");
    try {
      await fs.mkdir(rooPath, { recursive: true });
      await fs.writeFile(filePath, fileContent, { encoding: "utf-8" });
      console.log(`✅ write ui .d.ts success: ${filePath.replace(toolsObj.ProjectRoot, "")}`);
    } catch (err) {
      console.log(`❌ write ui .d.ts error: ${filePath.replace(toolsObj.ProjectRoot, "")}`, err);
    }
  }
}

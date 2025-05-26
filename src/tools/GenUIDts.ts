import { FsUtils } from "./FsUtils";
import * as fs from "fs/promises";
import * as path from "path";

interface NodeInfo {
  type?: string;
  name?: string;
  node?: NodeInfo;
  comp?: string[];

  [key: string]: any;
}

interface ViewInfo {
  [key: string]: NodeInfo;
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
      const child = JSON.parse(content)?.["_$child"];
      const basename = path.basename(file).replace(".ls", "");

      // @ts-ignore
      if (DEBUG) {
        console.log(`start to generate ls file: `, file, basename);
      }

      const obj: ViewInfo = {};
      for (let c of child) {
        await this.genChild(c, obj, 0);
      }

      // @ts-ignore
      obj["fileName"] = file.replace(FsUtils.ProjectRoot, "");
      map.set(`${basename}View`, obj);
    }
    const fileContent = this.createViewStr(map);
    await this.writeDtsFile(fileContent, basename);
  }

  public static async genChild(child: any, parent: { [key: string]: NodeInfo }, deep = 0): Promise<void> {
    const name: string = child?.["name"];
    if (!name?.startsWith("$")) return;
    if (child["_$prefab"]) {
      const prefabInfo = await this.genPrefabNode(child["_$prefab"], name);
      if (child["_$comp"]) {
        const compList: string[] = [];
        for (let c of child["_$comp"]) {
          const compStr = await this.getComponentNode(c["scriptPath"]);
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
      if (prefabInfo) {
        parent[name] = prefabInfo;
      }
      return;
    }
    let obj: NodeInfo = parent[name];
    if (!obj) {
      obj = parent[name] = <NodeInfo>{};
    }
    obj.name = name;
    obj.type = `Laya.${child["_$type"]}`;
    if (child["_$comp"]) {
      const compList: string[] = [];
      for (let c of child["_$comp"]) {
        const compStr = await this.getComponentNode(c["scriptPath"]);
        if (compStr?.length) {
          compList.push(...compStr);
        }
      }
      if (compList.length) {
        obj.comp = compList;
      }
    }
    if (child["_$child"]?.length) {
      for (let c of child["_$child"]) {
        const cname: string = c["name"];
        if (!cname?.startsWith("$")) {
          continue;
        }
        if (!obj.node) obj.node = {};
        await this.genChild(c, obj.node, deep + 1);
      }
    }
  }

  public static createViewStr(map: Map<string, any>): string {
    if (!map) return "";
    const entries = map.entries();
    let rst = "";
    for (let [key, obj] of entries) {
      rst += `/** ${(obj["fileName"] as string).replace(/\\/g, "/")} */\n`;
      rst += `export interface ${key} extends Laya.Scene {\n`;
      for (let k in obj) {
        rst += this.createNodeStr(obj[k], 1);
      }
      rst += "}\n\n";
    }
    return rst;
  }

  public static createNodeStr(node: NodeInfo, deep = 1): string {
    console.log(deep, node);
    if (!node?.name) return "";
    let rst: string = "  ".repeat(deep) + `${node.name}: ${node.type}`;
    if (node?.node) {
      let rst1 = "";
      for (let k in node.node) {
        rst1 += this.createNodeStr(node.node[k], deep + 1);
      }
      rst += " & {\n" + rst1;
      if (node?.comp?.length) {
        for (const c of node.comp) {
          rst += "  ".repeat(deep + 1) + c + "\n";
        }
      }
      rst += "  ".repeat(deep) + "};\n";
    } else if (node?.comp?.length) {
      rst += ` & {\n`;
      node.comp.forEach(value => {
        rst += "  ".repeat(deep + 1) + value + "\n";
      });
      rst += "  ".repeat(deep) + "};\n";
    } else {
      rst += ";\n";
    }
    return rst;
  }

  public static async writeDtsFile(fileContent: string, basename: string): Promise<void> {
    const rooPath = path.join(FsUtils.ProjectRoot + "src/3rd-types",);
    const filePath = path.join(rooPath, basename + ".d.ts");
    try {
      await fs.mkdir(rooPath, { recursive: true });
      await fs.writeFile(filePath, fileContent, { encoding: "utf-8" });
      console.log(`✅ write ui .d.ts success: ${filePath}`);
    } catch (err) {
      console.log(`❌ write ui .d.ts error: ${filePath}`, err);
    }
  }

  public static async genPrefabNode(uuid: string, name: string): Promise<NodeInfo | undefined> {
    let prefabPath = await FsUtils.getPrefabByUUID(uuid);
    if (!prefabPath) return;
    const prefabContent = await fs.readFile(prefabPath, { encoding: "utf-8" });
    const prefabJson = JSON.parse(prefabContent);
    const obj = <NodeInfo>{};
    obj.type = `Laya.${prefabJson["_$type"]}`;
    obj.name = name;
    if (prefabJson["_$child"]?.length) {
      obj.node = {};
      for (const c of prefabJson["_$child"]) {
        await this.genChild(c, obj.node, 1);
      }
    }
    if (prefabJson["_$comp"]) {
      const compList: string[] = [];
      for (const c of prefabJson["_$comp"]) {
        const compStr = await this.getComponentNode(c["scriptPath"]);
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

  public static async getComponentNode(scriptPath: string): Promise<string[]> {
    if (!scriptPath) return [];
    const basename = path.basename(scriptPath);
    const compName = basename.replace(".ts", "");
    const prefabUIContent = await fs.readFile(path.join(FsUtils.ProjectRoot, "src/tools", "PrefabUI.json"), { encoding: "utf-8" });
    return JSON.parse(prefabUIContent)[compName] ?? [];
  }
}

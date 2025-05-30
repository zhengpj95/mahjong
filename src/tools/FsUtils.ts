import * as fs from "fs/promises";
import * as path from "path";
import { toolsObj } from "./index";

/**
 * @author zpj
 * @date 2025/5/22
 */
export class FsUtils {

  /**
   * 异步递归查找指定目录下所有指定扩展名的文件
   * @param dir 要扫描的目录
   * @param ext 要查找的扩展名
   * @returns 文件绝对路径数组
   */
  public static async getAllFilesByExt(dir: string, ext: string): Promise<string[]> {
    let results: string[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const subResults = await FsUtils.getAllFilesByExt(fullPath, ext);
          results = results.concat(subResults);
        } else if (entry.isFile() && fullPath.endsWith(ext)) {
          results.push(fullPath);
        }
      }
    } catch (err) {
      console.error(`FsUtils.getAllFilesByExt 读取目录失败: ${dir}`, err);
    }

    return results;
  }

  /**
   * 得到所有 .lh 预制体文件map
   */
  public static async walkPrefab(): Promise<Map<string, string[]>> {
    const map = new Map<string, string[]>();
    const dirList = ["assets/prefab/", "assets/scene/"];
    for (let dir of dirList) {
      const p = path.join(toolsObj.ProjectRoot, dir);
      const files = await this.getAllFilesByExt(p, ".lh");
      for (let f of files) {
        const basename = path.basename(f);
        const mateFile = await fs.readFile(f + ".meta", { encoding: "utf-8" });
        const mateFileUUID = JSON.parse(mateFile)?.["uuid"];
        map.set(basename, [mateFileUUID, f]);
        map.set(mateFileUUID, [basename, f]);
      }
    }
    return map;
  }

  public static async walk(dir: string, ext: string): Promise<string[]> {
    const dirPath = path.join(toolsObj.ProjectRoot, dir);
    return this.getAllFilesByExt(dirPath, ext);
  }

  public static async getPrefabByUUID(uuid: string): Promise<string> {
    const map = await this.walkPrefab();
    return map.get(uuid)?.[1] ?? "";
  }
}
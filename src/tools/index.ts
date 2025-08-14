import * as path from "node:path";
import * as fs from "node:fs";

/**
 * tools全局对象
 * @author zpj
 * @date 2025/5/30
 */
class ToolsObject {
  private _projectRoot: string;

  /**
   * 获取项目根目录
   * 若为ide运行，则获取传入文件的路径，通过文件路径向上查找，直到找到 package.json 文件为止
   * 若为代码运行，通过当前路径向上查找，直到找到 package.json 文件为止
   * @param value
   * @private
   */
  private getProjectRoot(value?: string): string {
    // eslint-disable-next-line no-undef
    let currentDir = value ?? __dirname;

    // 向上查找直到找到 package.json
    while (currentDir !== path.parse(currentDir).root) {
      if (fs.existsSync(path.join(currentDir, "package.json"))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }

    throw new Error("无法找到项目根目录（没有找到package.json）");
  }

  // ide运行时，设置项目根目录
  public set ProjectRoot(value: string) {
    this._projectRoot = this.getProjectRoot(value);
    console.log("项目根目录:", this._projectRoot);
  }

  public get ProjectRoot(): string {
    if (!this._projectRoot) {
      this._projectRoot = this.getProjectRoot();
      console.log("项目根目录:", this._projectRoot);
    }
    return this._projectRoot;
  }
}

export const toolsObj = new ToolsObject();

/**
 * 将字符串转换为 PascalCase（每个单词首字母大写）
 * @param input 输入字符串
 * @returns 转换后的 PascalCase 字符串
 */
export function toPascalCase(input: string): string {
  return input
    .replace(/[-_\s]+(.)?/g, (_, group1) =>
      group1 ? group1.toUpperCase() : "",
    )
    .replace(/^(.)/, (_, group1) => group1.toUpperCase());
}

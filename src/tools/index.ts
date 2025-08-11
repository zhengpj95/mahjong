import * as path from "node:path";
import * as fs from "node:fs";

/**
 * tools全局对象
 * @author zpj
 * @date 2025/5/30
 */
function getProjectRoot(): string {
  // eslint-disable-next-line no-undef
  let currentDir = __dirname;

  // 向上查找直到找到 package.json
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, "package.json"))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error("无法找到项目根目录（没有找到package.json）");
}

export let PROJECT_ROOT: string;

class ToolsObject {
  public get ProjectRoot(): string {
    if (!PROJECT_ROOT) {
      PROJECT_ROOT = getProjectRoot();
      console.log("项目根目录:", PROJECT_ROOT);
    }
    return PROJECT_ROOT;
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

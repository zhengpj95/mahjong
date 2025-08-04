/**
 * tools全局对象
 * @author zpj
 * @date 2025/5/30
 */
class ToolsObject {
  public ProjectRoot = "E:\\project_laya_3.0\\mahjong\\";
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

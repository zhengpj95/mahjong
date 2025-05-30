import { FsUtils } from "../FsUtils";
import * as path from "path";
import * as fs from "fs/promises";

/**
 * @author zpj
 * @date 2025/5/30
 */
export async function startCreate(moduleName: string): Promise<void> {
  moduleName = moduleName.toLowerCase();
  const srcPath = path.join(FsUtils.ProjectRoot, "src/modules/", moduleName);
  await fs.mkdir(srcPath, { recursive: true });
  await fs.mkdir(path.join(srcPath, "model"), { recursive: true });

  const scenePath = path.join(FsUtils.ProjectRoot, "assets/scene/", moduleName);
  await fs.mkdir(scenePath, { recursive: true });

  const realName = toPascalCase(moduleName);
  const txtList = await FsUtils.walk("src/tools/create/tmpl", ".txt");
  const date = new Date();
  const time = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  for (let f of txtList) {
    const basename = path.basename(f);
    let fileContent = await fs.readFile(f, { encoding: "utf-8" });
    fileContent = fileContent.replace(/#MODULENAME#/g, realName).replace(/#DATE#/g, time);
    let filePath = path.join(srcPath, basename.replace("_", "/").replace(".txt", ".ts"));
    const tsBasename = path.basename(filePath);
    console.log(tsBasename);
    if (tsBasename.includes("model") || tsBasename.includes("proxy")) {
      const realFileName = realName + tsBasename.replace(/^(.)/, (_, g1) => g1.toUpperCase());
      filePath = filePath.replace(tsBasename, realFileName);
    }
    await fs.writeFile(filePath, fileContent, { encoding: "utf-8" });
  }

  return Promise.resolve();
}


/**
 * 将字符串转换为 PascalCase（每个单词首字母大写）
 * @param input 输入字符串
 * @returns 转换后的 PascalCase 字符串
 */
function toPascalCase(input: string): string {
  return input
    .replace(/[-_\s]+(.)?/g, (_, group1) => group1 ? group1.toUpperCase() : "")
    .replace(/^(.)/, (_, group1) => group1.toUpperCase());
}

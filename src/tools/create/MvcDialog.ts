import TextInput = gui.TextInput;
import * as fs from "fs";
import * as path from "path";
import { startCreate } from "./index";
import { toolsObj } from "../index";

/**
 * 弹窗
 */
export class MmvDialog extends IEditor.Dialog {

  async create() {
    this.contentPane = await gui.UIPackage.createWidget("editorResources/MvcDialog.widget");
  }

  onShown() {
    this.title = "MVC -- 构建逻辑模块";
    const textInput = this.contentPane.getChild("labModule").getChild("textInput") as TextInput;
    textInput.text = "";
    this.contentPane.getChild("btnCancel").on("click", () => {
      this.hide();
    });
    this.contentPane.getChild("btnConfirm").on("click", () => {
      this.createModule(textInput.text);
    });
  }

  onHide() {
    //
  }

  private createModule(moduleName: string): void {
    if (!moduleName) return;
    const dirList: string[] = [];
    const modulesPath = path.join(toolsObj.ProjectRoot, "/src/modules");
    const dirs = fs.readdirSync(modulesPath, { withFileTypes: true });
    dirs.forEach(value => {
      if (value.isDirectory()) {
        dirList.push(value.name);
      }
    });
    if (dirList.includes(moduleName)) {
      console.error(`❌ MVC 创建模块：src/modules/ 已存在 ${moduleName} ，不可重复创建`);
      return;
    }

    dirList.length = 0;
    const sceneDirs = fs.readdirSync(path.join(toolsObj.ProjectRoot, "assets/scene"), { withFileTypes: true });
    sceneDirs.forEach(value => {
      if (value.isDirectory()) {
        dirList.push(value.name);
      }
    });
    if (dirList.includes(moduleName)) {
      console.error(`❌ MVC 创建模块：assets/scene/ 已存在 ${moduleName} ，不可重复创建`);
      return;
    }

    startCreate(moduleName).then(value => {
      console.info(`✅ MVC 创建模块 成功!!!`);
    }).catch(err => {
      console.error(`❌ MVC 创建模块 失败 `, err);
    });
  }

  @IEditor.menu("App/私人/MVC")
  static showMvc() {
    Editor.showDialog(MmvDialog, null).catch(err => {
      console.log(`❌ MVC 打开弹窗 失败 `, err);
    });
  }
}

import TextInput = gui.TextInput;
import * as fs from "fs";
import * as path from "path";
import { startCreate } from "./create/index";
import { toolsObj } from "./index";

// @IEditor.panel("TestPanel", {
//   title: "TestPanel",
//   icon: "editorResources/img_test_panel_icon.png"
// })
// export class TestPanel extends IEditor.EditorPanel {
//   async create(): Promise<void> {
//     this._panel = await gui.UIPackage.createWidget("editorResources/MvcDialog.widget");
//     let input: gui.TextInput = this._panel.getChild("TextInput").getChild("title");
//     input.on("changed", () => {
//       console.log("改变了！" + input.text);
//     });
//     const btn: gui.Button = this._panel.getChild("btnConfirm");
//     btn.on("click", () => {
//       console.log(`btnConfirm click...`);
//     });
//     this._panel.getChild("btnCancel").on("click", () => {
//       console.log(`btnCancel click...`);
//     });
//   }
//
//   onExtensionReload() {
//     console.log(`11111 onExtensionReload`, this.contentPane);
//   }
// }

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
      if (err) {
        console.error(`❌ MVC 创建模块 失败 `, err);
      } else {
      }
    });
  }
}

/**
 * 扩展内置菜单
 */
class MenuImpl {
  @IEditor.menu("App/developer/MVC")
  static showMvc() {
    Editor.showDialog(MmvDialog, null).catch(err => {
      if (err) {
        console.log(err);
      }
    });
  }

  // // 在鼠标处弹出菜单
  // static showMenu(): void {
  //   if (!IEditor.Menu.getById("MyTestMenu")) {
  //     IEditor.Menu.create("MyTestMenu", [
  //       {
  //         label: "test",
  //         submenu: [
  //           { label: "a" },
  //           {
  //             label: "b",
  //             submenu: [
  //               {
  //                 label: "c",
  //                 click: function () {
  //                   console.log(`showMenu click...`);
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //       }
  //     ]);
  //   }
  //   //当需要弹出时
  //   IEditor.Menu.getById("MyTestMenu").show();
  // }
}

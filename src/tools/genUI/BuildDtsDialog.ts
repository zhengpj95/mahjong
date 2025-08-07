import { GenUIDts } from "./GenUIDts";
import { FsUtils } from "../FsUtils";
import * as path from "node:path";
import { toolsObj } from "../index";

/**
 * @author zpj
 * @date 2025/8/7
 */
export class BuildDtsDialog extends IEditor.Dialog {
  async create(): Promise<void> {
    this.contentPane = await gui.UIPackage.createWidget(
      "editorResources/BuildDts.widget",
    );
    this.title = "BuildDts -- 皮肤类型文件";
  }

  protected onShown(...args: any[]): void {
    super.onShown(...args);

    const boxSelectFolder: gui.Image =
      this.contentPane.getChild("boxSelectFolder");
    const textInput: gui.TextInput = boxSelectFolder.getChild("textInput");
    textInput.text = "";
    const iconButton = boxSelectFolder.getChild("IconButton");
    iconButton.on(
      "click",
      () => {
        Editor.showOpenDialog({
          title: "select file",
          properties: ["openDirectory"],
        }).then((value) => {
          textInput.text = value.filePaths[0] ?? "";
        });
      },
      this,
    );

    this.contentPane.getChild("btnConfirm").on(
      "click",
      () => {
        this.startToBuild(textInput.text).then((r) => {
          //
        });
      },
      this,
    );
  }

  protected onHide(): void {
    super.onHide();
  }

  private async startToBuild(folderPath?: string): Promise<void> {
    const checkBox: gui.Button = this.contentPane
      .getChild("boxSelectAll")
      .getChild("Checkbox");
    if (!checkBox.selected && !folderPath) {
      // eslint-disable-next-line no-undef
      alert(`❌ BuildDts 请选择目录或勾选选项`);
      return;
    }
    if (checkBox.selected) {
      const folderList = await FsUtils.getSubdirectories(
        path.join(toolsObj.ProjectRoot, "assets/scene"),
      );
      if (folderList.length) {
        for (const folder of folderList) {
          try {
            await GenUIDts.generateDts("assets/scene/" + folder);
          } catch (err) {
            // eslint-disable-next-line no-undef
            alert(`❌ BuildDts 生成失败: ${folder} ${err}`);
          }
        }
      }
    } else {
      const folder = folderPath.replace(toolsObj.ProjectRoot, "");
      try {
        await GenUIDts.generateDts(folder);
        console.log(`✅ BuildDts 生成完成`);
      } catch (err) {
        // eslint-disable-next-line no-undef
        alert(`❌ BuildDts 生成失败: ${folder} ${err} `);
      }
    }
  }

  @IEditor.menu("App/私人/BuildDts")
  static showBuildDtsDialog(): void {
    Editor.showDialog(BuildDtsDialog, null).catch((err) => {
      console.error("❌ BuildDtsDialog 打开弹窗失败: ", err);
    });
  }
}

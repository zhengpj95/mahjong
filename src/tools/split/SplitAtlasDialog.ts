import * as fs from "node:fs";

/**
 * @author zpj
 * @date 2025/7/1
 */
export class SplitAtlasDialog extends IEditor.Dialog {

  async create() {
    let panel = IEditor.GUIUtils.createInspectorPanel();
    let data = Editor.getSettings("SplitAtlasSetting").data;
    panel.inspect(data, "SplitAtlasSetting");
    this.contentPane = panel;

    panel.on("click_start_gen", this.startGen, this);
  }

  protected onShown() {
    (this.contentPane as IEditor.InspectorPanel).resetDefault();
    this.title = "图集分割工具";
    this.setSize(450, 180);
  }

  protected onHide() {
    super.onHide();
  }

  private startGen(): void {
    let data = Editor.getSettings("SplitAtlasSetting").data;
    if (!data.outputPath || !fs.existsSync(data.outputPath)) {
      alert("需要设置正确的输出目录。\n输出目录设置在：私人>图集分割工具");
      return;
    }
    // todo
  }
}

class SplitAtlasSetting {
  @IEditor.onLoad
  static start() {
    Editor.typeRegistry.addTypes([
      {
        name: "SplitAtlasSetting",
        catalogBarStyle: "hidden",
        properties: [
          {
            name: "help",
            caption: "提示",
            inspector: "Info",
            type: "string",
            default: "输入文件夹中需要有图集文件，输出目录会生成分割后的图片。",
          },
          {
            name: "inputPath",
            caption: "输入目录",
            inspector: "File",
            options: {
              absolutePath: true,
              properties: ["openDirectory"]
            },
            type: "string",
          },
          {
            name: "outputPath",
            caption: "输出目录",
            inspector: "File",
            options: {
              absolutePath: true,
              properties: ["openDirectory"],
            },
            type: "string",
          },
          {
            name: "",
            inspector: "Buttons",
            options: { buttons: [{ caption: "生成", event: "click_start_gen" }] }
          }
        ]
      }
    ]);
    Editor.extensionManager.createSettings("SplitAtlasSetting", "project");
  }
}

class SplitPngMenu {
  @IEditor.menu("App/私人/图集分割工具")
  static showSplitPngDialog(): void {
    Editor.showDialog(SplitAtlasDialog, null).catch(err => {
      console.error(`❌ SplitPng 弹出失败`, err);
    });
  }
}

/**
 * 配置方式处理
 * @author zpj
 * @date 2025/7/1
 */
export class SplitAtlasDialog extends IEditor.Dialog {
  async create() {
    const panel = IEditor.GUIUtils.createInspectorPanel();
    const data = Editor.getSettings("SplitAtlasSetting").data;
    panel.allowUndo = true;
    panel.inspect(data, "SplitAtlasSetting");
    this.contentPane = panel;
    this.title = "图集分割工具";
  }

  protected onShown() {
    (this.contentPane as IEditor.InspectorPanel).resetDefault();
    this.setSize(500, 250);

    this.contentPane.on("click_start_gen", this.startGen, this);
    this.contentPane.on(
      "click_cancel_gen",
      () => {
        this.hide();
      },
      this,
    );

    // 获取配置创建的组件 todo
  }

  protected onHide() {
    super.onHide();
    this.contentPane.offAllCaller(this);
  }

  private startGen(): void {
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
            default:
              "输入文件夹必须是图集文件或图片，输出目录会以图集名生成子文件夹",
          },
          {
            name: "inputPath",
            caption: "输入目录",
            inspector: "File",
            options: {
              absolutePath: true,
              properties: ["openFile"],
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
            name: "splitMode",
            caption: "分割模式",
            inspector: "RadioGroup",
            type: "string",
            options: {
              ComboBox: {
                // 使用ComboBox显示，没办法直接展示出来 todo 待研究
                items: ["Array", "Atlas", "Json"],
                visibleItemCount: 3,
              },
            },
          },
          {
            name: "buttons",
            inspector: "Buttons",
            options: {
              buttons: [
                { caption: "取消", event: "click_cancel_gen" },
                { caption: "生成", event: "click_start_gen" },
              ],
            },
          },
        ],
      },
    ]);
    Editor.extensionManager.createSettings("SplitAtlasSetting", "project");
  }
}

class SplitAtlasMenu {
  @IEditor.menu("App/私人/图集分割工具")
  static showSplitAtlasDialog(): void {
    Editor.showDialog(SplitAtlasDialog, null).catch((err) => {
      console.error(`❌ SplitAtlas 弹出失败`, err);
    });
  }
}

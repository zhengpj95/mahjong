import ComboBox = gui.ComboBox;
import Label = gui.Label;
import TextInput = gui.TextInput;

const SplitModeList = ["TexturePacker", "Atlas", "Json", "Array"];

/**
 * 配置方式处理
 * @author zpj
 * @date 2025/7/30
 */
class SplitAtlasMenu {
  @IEditor.menu("App/私人/图集分割工具New")
  static showSplitAtlasDialog(): void {
    Editor.showDialog(SplitAtlasDialogNew, null).catch((err) => {
      console.error(`❌ SplitAtlas 弹出失败`, err);
    });
  }
}

// 皮肤方式处理
export class SplitAtlasDialogNew extends IEditor.Dialog {
  private _comboBox: ComboBox;
  private _boxInput: Label;
  private _boxOutput: Label;

  async create() {
    this.contentPane = await gui.UIPackage.createWidget(
      "editorResources/SplitAtlas.widget",
    );
    this.title = "图集分割工具";
  }

  protected onShown() {
    this.contentPane
      .getChild("btnConfirm")
      .on("click", this.btnConfirmFunc, this);
    this.contentPane.getChild("btnCancel").on(
      "click",
      () => {
        console.log(11111, new Date().toLocaleTimeString());
        this.hide();
      },
      this,
    );
    this._comboBox = <ComboBox>(
      this.contentPane.getChild("boxSplitType").getChild("ComboBox")
    );
    this._comboBox.items = SplitModeList;
    this._comboBox.visibleItemCount = SplitModeList.length;
    this._comboBox.selectedIndex = 0;

    this._boxInput = <Label>this.contentPane.getChild("boxInput");
    this._boxInput
      .getChild("IconButton")
      .on("click", this.openFileDialog, this);

    this._boxOutput = this.contentPane.getChild("boxOutput");
    this._boxOutput
      .getChild("IconButton")
      .on("click", this.openFileDialog2, this);
  }

  protected onHide() {
    super.onHide();
    this.contentPane.offAllCaller(this);
  }

  private openFileDialog() {
    Editor.showOpenDialog({
      title: "select file",
      filters: [{ extensions: ["png"], name: "" }],
    }).then((value) => {
      this._boxInput.getChild("textInput").text = value.filePaths[0] ?? "";
    });
  }

  private openFileDialog2() {
    Editor.showOpenDialog({
      title: "select file",
      properties: ["openDirectory"],
    }).then((value) => {
      this._boxOutput.getChild("textInput").text = value.filePaths[0] ?? "";
    });
  }

  private btnConfirmFunc(): void {
    const comboBox = this._comboBox;
    const boxInput = <TextInput>this._boxInput.getChild("textInput");
    if (!boxInput.text) {
      window.alert(
        "需要设置正确的输入目录。\n输入目录设置在：私人>图集分割工具>输入目录",
      );
      return;
    }
    const boxOutput = <TextInput>this._boxOutput.getChild("textInput");
    if (!boxOutput.text) {
      window.alert(
        "需要设置正确的输出目录。\n输出目录设置在：私人>图集分割工具>输出目录",
      );
      return;
    }
    // todo
    const splitMode = comboBox.items[comboBox.selectedIndex];
    console.log(boxInput.text, boxOutput.text, splitMode);
    if (splitMode === "TexturePacker") {
      // TexturePacker 模式
    }
  }
}

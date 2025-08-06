/**
 * @author zpj
 * @date 2025/8/6
 */
import UIComponent = Laya.UIComponent;

// 重写List的方法，处理$命名组件
export function injectList(): void {
  const prototype = Laya.List.prototype;
  // @ts-ignore
  const rawCreateItem = prototype.createItem;
  // @ts-ignore
  prototype.createItem = function (this: Laya.List): UIComponent {
    const box = rawCreateItem.call(this);
    if (box) {
      const children: Laya.Node[] = (box as any)["_children"];
      for (const child of children) {
        buildNodeRecursive(child, box);
      }
    }
    // console.log(`List createItem: ${box.name} `, box, this.itemRender);
    return box;
  };
}

// 把$命名组件写入父节点，方便使用
function buildNodeRecursive(node: Laya.Node, parent: Laya.Node): void {
  if (!node?.name?.startsWith("$")) {
    return;
  }
  (parent as any)[node.name] = node;
  const children: Laya.Node[] = (node as any)["_children"];
  for (const child of children) {
    buildNodeRecursive(child, node);
  }
}

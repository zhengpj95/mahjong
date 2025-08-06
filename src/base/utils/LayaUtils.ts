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
    const rstObj: ItemRenderObj = { child: {} };
    buildItemRenderRecursive(this.itemRender?._$child || [], rstObj);
    if (box) {
      const children: Laya.Node[] = (box as any)["_children"];
      for (const child of children) {
        buildNodeRecursive(child, box, rstObj);
      }
    }
    return box;
  };
}

// 把$命名组件写入父节点，方便使用
function buildNodeRecursive(
  node: Laya.Node,
  parent: Laya.Node,
  rstObj: ItemRenderObj,
): void {
  if (!rstObj?.child?.[node.name]) {
    return;
  }
  (parent as any)[node.name] = node;
  const children: Laya.Node[] = (node as any)["_children"];
  for (const child of children) {
    buildNodeRecursive(child, node, rstObj.child[node.name]);
  }
}

type ItemRenderStructure = {
  name: string;
  _$var?: boolean; // 是否是变量
  _$child?: ItemRenderStructure[]; // 子组件
};

type ItemRenderObj = {
  child?: Record<string, ItemRenderObj>; // 子组件
};

// 构建 name以$开头 或者 勾选定义变量 的itemRender结构体
function buildItemRenderRecursive(
  itemRender: ItemRenderStructure[],
  rstObj: ItemRenderObj,
): void {
  if (!itemRender?.length || !rstObj) return;
  rstObj.child = {};

  // console.log("buildItemRenderRecursive: ", itemRender);
  for (const item of itemRender) {
    if (item.name.startsWith("$") || item._$var) {
      rstObj.child[item.name] = {};
      rstObj.child[item.name].child = {};
      if (item._$child) {
        buildItemRenderRecursive(item._$child, rstObj.child[item.name]);
      }
    }
  }
}

// todo test
// const obj = {
//   name: "render",
//   _$child: [
//     {
//       name: "$boxCard",
//       _$var: true,
//       _$child: [
//         {
//           name: "img",
//           _$var: true,
//         },
//         {
//           name: "$imgSelected",
//           _$child: [{ name: "img1" }, { name: "img2", _$var: true }],
//         },
//       ],
//     },
//   ],
// };
// const rstObj: ItemRenderObj = { child: {} };
// buildItemRenderRecursive(obj._$child, rstObj);
// console.log(`rstObj:`, rstObj.child);

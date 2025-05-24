/**
 * @author zpj
 * @date 2025/5/23
 */

import { GenUIDts } from "./GenUIDts";

async function test(): Promise<void> {
  // const a = await FsUtils.walkPrefab();
  // console.log(a);

  await GenUIDts.generateDts("assets/scene/Hoodle");
  // await GenUIDts.generateDts("assets/scene/Mahjong");

  // let str = await GenUIDts.getComponentNode("../src/script/BarProgress.ts");
  // console.log(str);
}

test();

import { MiscModule } from "./misc/index";
import { MahjongModule } from "./mahjong/index";

/**
 * @author zpj
 * @date 2025/4/29
 */
function regModules(): void {
  base.facade.push(MiscModule);
  base.facade.push(MahjongModule);
}

// 实例化所有模块
function insModules(): void {
  base.facade.instantiate();
}

export function initModules(): void {
  console.log(`[开始初始化模块]`);
  regModules();
  insModules();
}

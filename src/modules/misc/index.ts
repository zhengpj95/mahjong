import BaseModule = base.BaseModule;
import { ModuleType } from "@def/module-type";

/**
 * @author zpj
 * @date 2025/4/29
 */
export class MiscModule extends BaseModule {
  constructor() {
    super(ModuleType.MISC);
  }

  protected initCmd(): void {
  }

  protected initMdr(): void {
  }

  protected initProxy(): void {
  }
}
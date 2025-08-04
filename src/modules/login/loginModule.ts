import BaseModule = base.BaseModule;
import { ModuleName } from "@def/module-name";
import { LoginViewType } from "@def/login";
import { LoginMdr } from "./view/LoginMdr";

/**
 * @author zpj
 * @date 2025/6/13
 */
export class LoginModule extends BaseModule {
  constructor() {
    super(ModuleName.LOGIN);
  }

  protected initCmd(): void {
    //
  }

  protected initMdr(): void {
    this.regMdr(LoginViewType.LOGIN, LoginMdr);
  }

  protected initProxy(): void {
    //
  }
}

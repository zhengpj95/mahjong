// setup-husky-commitlint.mjs
import fs from "node:fs";
import { execSync } from "node:child_process";

const run = cmd => execSync(cmd, { stdio: "inherit" });

console.log("📦 安装依赖: husky + commitlint...");
run("npm install --save-dev husky @commitlint/cli @commitlint/config-conventional");

console.log("📁 创建 .husky 目录结构...");
fs.mkdirSync(".husky/_", { recursive: true });

// husky.sh (必要脚本)
fs.writeFileSync(".husky/_/husky.sh", `
#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi
fi
`);
fs.chmodSync(".husky/_/husky.sh", 0o755);

// commit-msg hook
fs.writeFileSync(".husky/commit-msg", `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "✅ commit-msg hook triggered"

npx --no commitlint --edit "$1"
`);
fs.chmodSync(".husky/commit-msg", 0o755);

// commitlint.config.js
fs.writeFileSync("commitlint.config.js", `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
        'feat', //新功能
        'fix', //bug
        'refactor', //重构
        'optimize', //优化
        'style', //格式
        'docs', //文档
        'chore', //辅助工具变动
        'test' //测试案例改动
      ]]
    }
};
`);

console.log("✅ husky + commitlint 配置完成！试试提交一个不规范的信息看看效果吧~");

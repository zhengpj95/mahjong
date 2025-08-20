import { execSync } from "child_process";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";

const logger = (msg) => console.log("🔧 ", msg);
const errorLogger = (msg) => console.error("❌ ", msg);

// 安装依赖
const installDeps = () => {
  const deps = [
    "eslint@^9",
    "@eslint/js",
    "typescript",
    "typescript-eslint",
    "prettier",
    "eslint-plugin-prettier",
    "json",
  ];
  logger(`安装依赖: ${deps.join(", ")}`);
  execSync(`npm install -D ${deps.join(" ")}`, { stdio: "inherit" });
};

// 写文件工具
const write = (filename, content) => {
  fs.writeFile(filename, content, (err) => {
    if (err) throw err;
    logger(`写入文件: ${filename}`);
  });
};

// 生成配置文件
const generateConfigs = () => {
  // .prettierrc
  // write(
  //   ".prettierrc",
  //   JSON.stringify(
  //     {
  //       singleQuote: true,
  //       semi: true,
  //       tabWidth: 2,
  //       trailingComma: "all",
  //     },
  //     null,
  //     2,
  //   ),
  // );

  // tsconfig.json（如果没有）
  if (!fs.existsSync("tsconfig.json")) {
    logger("未找到 tsconfig.json，自动生成默认配置");
    write(
      "tsconfig.json",
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            module: "ESNext",
            moduleResolution: "Node",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
          },
          include: ["src", "scripts"],
        },
        null,
        2,
      ),
    );
  }

  // eslint.config.mjs
  const eslintConfig = `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'warn',
      'semi': ['error', 'always'], // 强制语句末尾分号
      'no-var': 'warn', // 使用let或const代替var
      'prefer-const': 'warn', // 优先使用const
      'eqeqeq': ['warn', 'smart'], // 必须使用 === 或 !==
      'linebreak-style': ['error', 'unix'], // 强制使用Unix风格
      '@typescript-eslint/prefer-for-of': 'warn', // 如果索引仅用于访问要迭代的数组，则优先于for循环的for-of循环
      '@typescript-eslint/prefer-enum-initializers': 'error', // 最好初始化每个枚举成员值 
    },
  },
  {
    ignores: ["dist/", "node_modules/", "assets/", "bin", "engine"],
  },
];`;
  write("eslint.config.js", eslintConfig);
};

// 添加 lint 脚本 到 package.json
function updatePackageJsonScripts() {
  const pkgPath = path.resolve(process.cwd(), "package.json");

  if (!fs.existsSync(pkgPath)) {
    errorLogger("找不到 package.json 文件，无法添加脚本");
    return;
  }

  const raw = fs.readFileSync(pkgPath, "utf8");
  let pkg;

  try {
    pkg = JSON.parse(raw);
  } catch (e) {
    errorLogger("解析 package.json 失败：", e);
    return;
  }

  pkg.scripts = pkg.scripts || {};
  pkg.scripts.lint = "eslint src/**/*.ts";
  pkg.scripts["lint:fix"] = "eslint src/**/*.ts --fix";

  try {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    logger("成功写入 lint 和 lint:fix 到 package.json");
  } catch (e) {
    errorLogger("写入 package.json 失败：", e);
  }
}

// 执行
const run = () => {
  logger("开始配置 ESLint v9...");
  installDeps();
  generateConfigs();
  updatePackageJsonScripts();
  logger("✅ 完成！你现在可以使用 npm run lint / lint:fix 来检查和修复代码。");
};

run();

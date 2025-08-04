import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        Laya: "readonly", // LayaAir 引擎全局变量
        base: "readonly", // LayaAir 引擎全局变量
        wx: "readonly", // 微信小游戏全局变量
        console: "readonly",
        window: "readonly",
        module: "readonly",

        IEditor: "readonly", // LayaAir 编辑器全局变量
        Editor: "readonly", // LayaAir 编辑器全局变量
        gui: "readonly", // LayaAir 编辑器全局变量
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // 注意：必须能覆盖这些 ts 文件
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,
      semi: ["error", "always"], // 强制语句末尾分号
      eqeqeq: ["error", "smart"], // 必须使用 === 或 !==
      "no-var": "error", // 使用let或const代替var
      "no-undef": "warn", // 未定义的变量提示
      "prefer-const": "warn", // 优先使用const
      "no-unused-vars": "off", // ❌ 关闭 JS 的默认版本
      "@typescript-eslint/no-unused-vars": [
        "off",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ], // 允许未使用的变量，但忽略以下划线开头的变量
      "linebreak-style": ["error", "unix"], // 强制使用Unix风格
      "@typescript-eslint/prefer-for-of": "warn", // 如果索引仅用于访问要迭代的数组，则优先于for循环的for-of循环
      "@typescript-eslint/prefer-enum-initializers": "error", // 最好初始化每个枚举成员值
      "@typescript-eslint/no-explicit-any": "off", // 允许隐式any类型
      "@typescript-eslint/no-empty-function": "warn", // 允许空函数
      "@typescript-eslint/no-non-null-assertion": "warn", // 允许非空断言
      "no-require-imports": "error", // 禁止使用 require 导入
    },
    ignores: ["src/3rd/**", "src/3rd-types/**"], // 忽略3rd目录和src/3rd-types目录
  },
  // 💅 可选：Prettier 配合使用（统一格式）
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
  // 全局忽略文件夹
  {
    ignores: ["dist/**", "node_modules/**", "assets/**", "bin/**"],
  },
];

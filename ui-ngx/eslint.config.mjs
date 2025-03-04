import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier', // 使用 eslint-config-prettier 中的配置项
      'prettier/@typescript-eslint', // 禁用 @typescript-eslint 中的格式化规则
    ],
    plugins: [
      '@typescript-eslint',
      'unused-imports',
      'prettier', // 注册 prettier 插件
    ],
    rules: {
      semi: ['error', 'always'], // 要求语句以分号结尾
      'no-unused-vars': 'off', // 对未使用的变量发出警告
      'no-multiple-empty-lines': ['error', { max: 1 }], // 连续空行的最大数量为 2 行
      '@typescript-eslint/no-unused-vars': 'off', // 关闭 TypeScript 的未使用变量规则
      'unused-imports/no-unused-imports': 'error', // 开启 unused-imports 规则，删除未使用的导入
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': 'error', // 在 ESLint 中运行 Prettier，并启用该插件提供的规则    },
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

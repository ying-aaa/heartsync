import { defineConfig, toEscapedSelector as e, presetUno, transformerDirectives } from 'unocss';
// import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
  // @ts-ignore
  transformers: [transformerDirectives()],
  rules: [
    [
      /^custom-hover$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector);
        return `
            ${selector} {
              display: flex;
              height: 100%;
              padding: 1px 10px 0;
              cursor: pointer;
              align-items: center;
              transition: background var(--transition-time-02);
            }
            /* you can have multiple rules */
            ${selector}:hover {
              background-color: var(--top-header-hover-color);
            }
            .dark ${selector}:hover {
              background-color: var(--el-bg-color-overlay);
            }
            `;
      },
    ],
    [
      /^layout-border__left$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector);
        return `
              ${selector}:before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 100%;
                background-color: var(--el-border-color);
                z-index: 3;
              }
              `;
      },
    ],
    [
      /^layout-border__right$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector);
        return `
            ${selector}:after {
              content: "";
              position: absolute;
              top: 0;
              right: 0;
              width: 1px;
              height: 100%;
              background-color: var(--el-border-color);
              z-index: 3;
            }
            `;
      },
    ],
    [
      /^layout-border__top$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector);
        return `
            ${selector}:before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 1px;
              background-color: var(--el-border-color);
              z-index: 3;
            }
            `;
      },
    ],
    [
      /^layout-border__bottom$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector);
        return `
            ${selector}:after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 1px;
              background-color: var(--el-border-color);
              z-index: 3;
            }
            `;
      },
    ],
  ],
  presets: [presetUno({ dark: 'class', attributify: false })],
  // transformers: [transformerVariantGroup()],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'absolute-center': 'absolute top-50% left-50% -translate-x-50% -translate-y-50%',
    'absolute-center-x': 'absolute left-50% -translate-x-50%',
    'absolute-center-y': 'absolute top-50% -translate-y-50%',
    'backdrop-fit': 'bg-center bg-cover object-cover object-center',
    'border-line': 'border-1px border-solid border-color-[var(--base-divider-color)]',
  },
  cli: {
    entry: {
      /**
       * Glob patterns to match files
       * Include HTML and inline templates in components.
       */
      patterns: ['src/**/*.html', 'src/**/*.ts'],
      /**
       * The output filename for the generated UnoCSS file
       */
      outFile: './src/styles/uno.css',
    },
  },
});

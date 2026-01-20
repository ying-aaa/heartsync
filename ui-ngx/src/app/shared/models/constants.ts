import { DisplayGrid, GridType } from 'angular-gridster2';

export const Constants = {
  serverErrorCode: {
    passwordViolation: 45,
  },
  entryPoints: {
    login: '',
    tokenRefresh: '',
    nonTokenBased: '',
  },
};

export const MediaBreakpoints = {
  xs: 'screen and (max-width: 599px)',
  sm: 'screen and (min-width: 600px) and (max-width: 959px)',
  md: 'screen and (min-width: 960px) and (max-width: 1279px)',
  lg: 'screen and (min-width: 1280px) and (max-width: 1919px)',
  xl: 'screen and (min-width: 1920px) and (max-width: 5000px)',
  'lt-sm': 'screen and (max-width: 599px)',
  'lt-md': 'screen and (max-width: 959px)',
  'lt-lg': 'screen and (max-width: 1279px)',
  'lt-xl': 'screen and (max-width: 1919px)',
  'gt-xs': 'screen and (min-width: 600px)',
  'gt-sm': 'screen and (min-width: 960px)',
  'gt-md': 'screen and (min-width: 1280px)',
  'gt-lg': 'screen and (min-width: 1920px)',
  'gt-xl': 'screen and (min-width: 5001px)',
  'md-lg': 'screen and (min-width: 960px) and (max-width: 1819px)',
};
type MediaBreakpointKey = keyof typeof MediaBreakpoints;

export const resolveBreakpoint = (breakpoint: MediaBreakpointKey | string): string => {
  if (breakpoint in MediaBreakpoints) {
    return MediaBreakpoints[breakpoint as MediaBreakpointKey];
  }
  return breakpoint;
};

export const gridTypeOptions = [
  {
    label: '自适应容器（Fit）',
    value: GridType.Fit,
    // 核心描述
    description:
      '网格会**自适应填充容器**，无滚动条；列/行的尺寸会根据容器大小自动调整，所有网格项都在可视区域内，不会超出容器边界。',
    // 使用场景
    usage:
      '✅ 响应式全屏仪表盘（如后台监控面板）\n✅ 容器尺寸固定且需适配不同屏幕（如中等尺寸的统计卡片区域）\n✅ 不希望出现滚动条，所有内容一次性展示',
  },
  {
    label: '垂直滚动（ScrollVertical）',
    value: GridType.ScrollVertical,
    description:
      '列宽固定，行数可无限扩展，超出容器高度时**垂直滚动**；列数适配容器宽度，行高固定，垂直方向可无限添加网格项。',
    usage:
      '✅ 列表式网格布局（如表单配置项、多模块配置页）\n✅ 网格项数量多、高度方向内容超出视图（如审批流程节点配置）\n✅ 希望横向紧凑排列，纵向可滚动查看更多内容',
  },
  // {
  //   label: '水平滚动（ScrollHorizontal）',
  //   value: GridType.ScrollHorizontal,
  //   description:
  //     '行高固定，列数可无限扩展，超出容器宽度时**水平滚动**；行数适配容器高度，列宽固定，水平方向可无限添加网格项。',
  //   usage:
  //     '✅ 横向延展的时序类布局（如时间轴、多维度数据对比）\n✅ 垂直空间有限、需要横向展示多个部件（如大屏可视化的横向模块）\n✅ 按列维度分类的内容（如不同渠道的数据分析卡片）',
  // },
  // {
  //   label: '固定行列宽高（Fixed）',
  //   value: GridType.Fixed,
  //   description:
  //     '列宽和行高都**固定像素值**，列数由容器宽度/列宽决定，行数由容器高度/行高决定；超出容器时无滚动（需手动限制网格项数量）。',
  //   usage:
  //     '✅ 固定尺寸的仪表盘（如大屏展示、像素级还原的设计稿）\n✅ 网格项尺寸统一且无需响应式调整（如九宫格菜单）\n✅ 对布局精度要求高的场景（如报表卡片排版）',
  // },
  // {
  //   label: '垂直固定列数（VerticalFixed）',
  //   value: GridType.VerticalFixed,
  //   description:
  //     '列宽**按比例自适应**（如1fr），行高固定像素值；垂直方向可滚动，列数固定（由配置的 `cols` 决定），不受容器宽度影响。',
  //   usage:
  //     '✅ 移动端垂直布局的网格（如商品列表、卡片流）\n✅ 列数固定但需适配不同屏幕宽度（如3列布局适配手机/平板）\n✅ 垂直方向内容多、需要滚动，横向保持固定列数',
  // },
  // {
  //   label: '水平固定列数（HorizontalFixed）',
  //   value: GridType.HorizontalFixed,
  //   description:
  //     '行高**按比例自适应**，列宽固定像素值；水平方向可滚动，行数固定（由配置的 `rows` 决定），不受容器高度影响。',
  //   usage:
  //     '✅ 横向固定行数的布局（如导航栏+内容区的组合模块）\n✅ 水平滚动的多屏内容（如不同业务模块的横向切换）\n✅ 行数固定、列数可无限扩展的场景（如多维度数据看板）',
  // },
];

export const displayGridOptions = [
  {
    label: '拖拽时显示网格线（OnDragAndResize）',
    value: DisplayGrid.OnDragAndResize,
    description: '网格线**随鼠标拖拽网格显示**',
  },
  {
    label: '始终显示网格线（Always）',
    value: DisplayGrid.Always,
    description: '网格线**一直显示**',
  },
  {
    label: '不显示网格线（None）',
    value: DisplayGrid.None,
    description: '不显示网格线。',
  },
];

export const backgroundImageModeOptions = [
  { label: '宽度填满容器，高度按比例缩放', value: '100%' },
  { label: '高度填满容器，宽度按比例缩放', value: 'auto 100%' },
  { label: '铺满容器，裁剪多余部分', value: 'cover' },
  { label: '完整显示，留白以适应容器', value: 'contain' },
  { label: '保持原始尺寸，不缩放', value: 'auto' },
];

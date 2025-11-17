export const nodeConfigs = [
  {
    title: '控制',
    key: 'control',
    nodes: [
      {
        title: '条件分支',
        key: 'condition',
        description: '根据单个条件判断执行不同分支（if-else）',
        icon: '',
      },
      {
        title: '确认框',
        key: 'confirm',
        description: '弹出一个确认框，点击确定执行下一步，点击取消则取消执行',
        icon: '',
      },
      // 循环遍历
      {
        title: '循环遍历',
        key: 'loop',
        description: '遍历列表/数组中的每一项并执行子逻辑',
        icon: '',
      },
      // 延迟执行
      {
        title: '延迟执行',
        key: 'delay',
        description: '延迟执行指定的时间',
        icon: '',
      },
      // 结束
      {
        title: '结束',
        key: 'end',
        description: '结束流程',
        icon: '',
      },
    ],
  },
  {
    title: '动作',
    key: 'action',
    nodes: [
      // 组件动作
      {
        title: '组件动作',
        key: 'component',
        description: '执行组件动作',
        icon: '',
      },
      // 页面跳转
      {
        title: '页面跳转',
        key: 'page',
        description: '打开指定弹窗、抽屉、跳转到指定页面',
        icon: '',
      },
      // 通知提示
      {
        title: '通知提示',
        key: 'notice',
        description: '弹出通知提示',
        icon: '',
      },
    ],
  },
  {
    title: '数据',
    key: 'data',
    nodes: [
      // 操作资产
      {
        title: '操作资产',
        key: 'asset',
        description: '操作资产数据',
        icon: '',
      },
      // 读取缓存
      {
        title: '读取缓存',
        key: 'get-cache',
        description: '读取缓存数据',
        icon: '',
      },
      // 操作缓存
      {
        title: '操作缓存',
        key: 'operation-cache',
        description: '操作缓存数据',
        icon: '',
      },
      // 获取数据主键
      {
        title: '获取主键',
        key: 'get-primary-key',
        description: '获取数据主键',
        icon: '',
      },
      // 获取表单数据
      {
        title: '表单取值',
        key: 'get-form-data',
        description: '获取表单数据',
        icon: '',
      },
      // 设置表单数据
      {
        title: '表单赋值',
        key: 'set-form-data',
        description: '设置表单数据',
        icon: '',
      },
    ],
  },
  {
    title: '变量',
    key: 'variables',
    nodes: [
      // 操作便利
      {
        title: '操作变量',
        key: 'operation-variable',
        description: '操作变量数据',
        icon: '',
      },
      // 常用函数
      {
        title: '常用函数',
        key: 'common-function',
        description: '常用函数',
        icon: '',
      },
    ],
  },
  {
    title: '服务',
    key: 'service',
    nodes: [
      // 调用后端服务
      {
        title: '请求',
        key: 'request',
        description: '请求自定义接口',
        icon: '',
      },
      {
        title: '服务编排',
        key: 'service',
        description: '自定义服务端执行的节点逻辑',
        icon: '',
      },
    ],
  },
];

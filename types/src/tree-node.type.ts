/**
 * 目录树节点通用字段接口（所有需层级功能的实体必须实现）
 */
export interface ILevelNode {
  id: string; // 主键ID
  parentId: string; // 父节点ID（根节点为0）
  sort: number; // 同层级排序值
  level: number; // 层级
  nodeType: number; // 节点类型：0=纯目录（不可点击），1=业务节点（可点击）
  allowChildren?: number; // 可选：是否允许有子节点（0=否，1=是）
}

/**
 * 移动排序请求参数接口（通用）
 */
export interface IMoveNodeDto {
  nodeId: string; // 要移动的节点ID
  targetParentId: string; // 目标父节点ID
  sortStrategy: 'by_sort_value' | 'by_adjacent_node'; // 排序策略
  sortValue?: number; // 仅by_sort_value时传
  adjacentNodeId?: number; // 仅by_adjacent_node时传
  position?: 'before' | 'after'; // 仅by_adjacent_node时传
}

// 节点类型枚举
export enum IDocumentNodeType {
  PURE_DIR = 0, // 纯目录（不可点击）
  BUSINESS = 1, // 业务节点（可点击）
}

// 允许子节点枚举
export enum IAllowChildren {
  NO = 0,
  YES = 1,
}

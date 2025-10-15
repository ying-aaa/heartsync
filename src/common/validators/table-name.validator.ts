import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// 主流数据库通用保留关键字（可根据业务扩展）
export const DB_RESERVED_KEYWORDS = [
  'select',
  'insert',
  'update',
  'delete',
  'from',
  'where',
  'and',
  'or',
  'group',
  'by',
  'order',
  'limit',
  'offset',
  'join',
  'on',
  'as',
  'case',
  'when',
  'then',
  'else',
  'end',
  'null',
  'not',
  'in',
  'like',
  'between',
  'exists',
  'table',
  'column',
  'database',
  'user',
  'index',
  'primary',
  'key',
  'foreign',
  'unique',
  'check',
  'default',
  'auto_increment',
  'true',
  'false',
  'boolean',
  'int',
  'varchar',
  'text',
  'date',
  'time',
  'timestamp',
];

/**
 * 数据库表名验证器
 * 规则：
 * 1. 长度 1-64 字符
 * 2. 仅含字母、数字、下划线，且以字母开头
 * 3. 不能以双下划线开头（避免系统表冲突）
 * 4. 不能是数据库保留关键字
 */
@ValidatorConstraint({ name: 'validTableName', async: false })
export class ValidTableNameValidator implements ValidatorConstraintInterface {
  private errorMessage: string = '';

  validate(tableName: string, args: ValidationArguments): boolean {
    // 1. 检查是否为字符串（基础类型校验）
    if (typeof tableName !== 'string') {
      this.errorMessage = '表名必须是字符串';
      return false;
    }

    // 2. 长度校验
    if (tableName.length < 1 || tableName.length > 64) {
      this.errorMessage = '表名长度必须在 1-64 个字符之间';
      return false;
    }

    // 3. 格式校验（字母开头，仅含字母、数字、下划线，不能以双下划线开头）
    const nameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/; // 字母开头，后续可跟字母、数字、下划线
    if (!nameRegex.test(tableName)) {
      this.errorMessage = '表名只能包含字母、数字、下划线，且必须以字母开头';
      return false;
    }
    if (tableName.startsWith('__')) {
      this.errorMessage = '表名不能以双下划线（__）开头（避免系统表冲突）';
      return false;
    }

    // 4. 关键字校验（忽略大小写，如 Table 和 table 都不允许）
    const lowerTableName = tableName.toLowerCase();
    if (DB_RESERVED_KEYWORDS.includes(lowerTableName)) {
      this.errorMessage = `表名不能使用数据库关键字：${tableName}`;
      return false;
    }

    // 所有校验通过
    return true;
  }

  defaultMessage(): string {
    return this.errorMessage;
  }
}

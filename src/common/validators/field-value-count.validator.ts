import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * 通用字段值数量验证器
 * @param field 要检查的字段名（如 'isPrimaryKey'、'status'）
 * @param targetValue 目标值（如 true、'active'）
 * @param expectedCount 允许的数量（如 1、2）
 * 示例：@Validate(FieldValueCountValidator, ['isPrimaryKey', true, 1]) 表示检查 isPrimaryKey 为 true 的数量必须是1
 */
@ValidatorConstraint({ name: 'fieldValueCount', async: false })
export class FieldValueCountValidator implements ValidatorConstraintInterface {
  private targetField: string = '';
  private targetValue: any;
  private expectedCount: number = 0;
  private actualCount: number = 0;

  validate(array: any[], args: ValidationArguments): boolean {
    // 从参数中获取配置（字段名、目标值、预期数量）
    [this.targetField, this.targetValue, this.expectedCount] = args.constraints;
    // 校验参数合法性
    if (!this.targetField || this.expectedCount === undefined) {
      throw new Error(
        '请指定字段名、目标值和预期数量（如 @Validate(FieldValueCountValidator, ["field", value, 1])）',
      );
    }

    // 统计数组中符合条件的元素数量（field === targetValue）
    this.actualCount = array.filter(
      (item) => item[this.targetField] === this.targetValue,
    ).length;

    // 数量匹配则通过
    return this.actualCount === this.expectedCount;
  }

  defaultMessage(): string {
    return `字段 [${this.targetField}] 等于 [${this.targetValue}] 的数量必须是 ${this.expectedCount} 个，当前是 ${this.actualCount} 个`;
  }
}

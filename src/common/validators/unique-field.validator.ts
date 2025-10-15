import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * 通用字段唯一性验证器
 * @param field 要检查的字段名（如 'name'、'code'）
 * 示例：@Validate(UniqueFieldValidator, ['name']) 表示检查数组中每个对象的 name 字段是否唯一
 */
@ValidatorConstraint({ name: 'uniqueField', async: false })
export class UniqueFieldValidator implements ValidatorConstraintInterface {
  private duplicateValues: any[] = []; // 存储重复的值
  private targetField: string = ''; // 目标字段名

  validate(array: any[], args: ValidationArguments): boolean {
    // 从参数中获取要检查的字段名（第一个参数必须是字段名）
    this.targetField = args.constraints[0];
    if (!this.targetField) {
      throw new Error(
        '请指定要检查的字段名（如 @Validate(UniqueFieldValidator, ["name"])）',
      );
    }

    // 提取数组中每个对象的目标字段值
    const values = array.map((item) => item[this.targetField]);
    // 统计每个值的出现次数
    const valueCountMap = new Map<any, number>();
    values.forEach((value) => {
      valueCountMap.set(value, (valueCountMap.get(value) || 0) + 1);
    });

    // 筛选出重复的值
    this.duplicateValues = Array.from(valueCountMap.entries())
      .filter(([_, count]) => count > 1)
      .map(([value]) => value);

    // 无重复则验证通过
    return this.duplicateValues.length === 0;
  }

  defaultMessage(): string {
    return `字段 [${this.targetField}] 的值不能重复，重复的值：${this.duplicateValues.join(', ')}`;
  }
}

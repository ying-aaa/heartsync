import { NotFoundException } from '@nestjs/common';
import { UnifiedDbStrategy } from '../abstract/unified-db-strategy.interface';

export class DbRegistry {
  private static strategies = new Map<string, new () => UnifiedDbStrategy>();

  // 注册数据库实现（传入二合一的类）
  static register(strategyClass: new () => UnifiedDbStrategy): void {
    const strategy = new strategyClass();
    if (this.strategies.has(strategy.type)) {
      console.warn(`数据库${strategy.type}已注册，将覆盖`);
    }
    this.strategies.set(strategy.type, strategyClass);
  }

  // 根据类型获取二合一的策略实例
  static getStrategy(type: string): UnifiedDbStrategy {
    const StrategyClass = this.strategies.get(type);
    if (!StrategyClass) {
      throw new NotFoundException(`未注册数据库类型：${type}`);
    }
    return new StrategyClass();
  }

  // 获取所有支持的数据库类型
  static getSupportedTypes(): string[] {
    return Array.from(this.strategies.keys());
  }
}

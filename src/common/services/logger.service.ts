import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';

// 日志级别（从低到高）
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({ scope: Scope.TRANSIENT }) //  transient 确保每个注入点有独立实例（避免上下文混乱）
export class HsLoggerService implements LoggerService {
  private logger: winston.Logger;
  private defaultContext = 'App'; // 默认上下文（如无指定）

  constructor(private configService: ConfigService) {
    // 初始化 Winston 日志实例
    this.logger = winston.createLogger({
      level: this.getLogLevel(), // 动态日志级别（开发环境debug，生产环境info）
      format: this.getLogFormat(), // 日志格式
      transports: this.getTransports(), // 输出目标（控制台+文件）
    });
  }

  setContext(context: string) {
    this.defaultContext = context;
  }

  /**
   * 基础日志方法（内部使用）
   */
  private logTo(
    level: LogLevel,
    message: string,
    context?: string,
    meta?: any,
  ) {
    const logContext = context || this.defaultContext;
    this.logger.log(level, message, { context: logContext, ...meta });
  }

  /**
   * 调试日志（开发环境用）
   */
  debug(message: string, context?: string, meta?: any) {
    this.logTo('debug', message, context, meta);
  }

  /**
   * 信息日志（常规操作）
   */
  log(message: string, context?: string, meta?: any) {
    this.logTo('info', message, context, meta);
  }

  /**
   * 警告日志（不影响运行但需注意）
   */
  warn(message: string, context?: string, meta?: any) {
    this.logTo('warn', message, context, meta);
  }

  /**
   * 错误日志（异常/故障）
   */
  error(message: string, trace?: string, context?: string, meta?: any) {
    // 错误日志包含堆栈信息（trace）
    this.logTo('error', message, context, { trace, ...meta });
  }

  /**
   * 获取日志级别（根据环境变量动态调整）
   */
  private getLogLevel(): LogLevel {
    const env = this.configService.get('NODE_ENV') || 'development';
    return env === 'production' ? 'info' : 'debug';
  }

  /**
   * 日志格式（开发环境用简单格式，生产环境用JSON格式便于解析）
   */
  private getLogFormat(): winston.Logform.Format {
    const env = this.configService.get('NODE_ENV') || 'development';

    if (env === 'production') {
      // 生产环境：JSON格式（包含时间、级别、消息、上下文、堆栈等）
      return winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.json(),
      );
    } else {
      // 开发环境：彩色文本格式（更易读）
      return winston.format.combine(
        winston.format.colorize(), // 彩色输出
        winston.format.timestamp({ format: 'HH:mm:ss' }), // 简化时间格式
        winston.format.printf(
          ({ timestamp, level, message, context, trace }) => {
            // 格式：[时间] [级别] [上下文] 消息 [堆栈]
            return `[${timestamp}] ${level} [${context}] ${message} ${trace ? `\n${trace}` : ''}`;
          },
        ),
      );
    }
  }

  /**
   * 日志输出目标（控制台+按日期分割的文件）
   */
  private getTransports(): winston.transport[] {
    const transports: winston.transport[] = [];

    // 1. 控制台输出（开发环境必选，生产环境可选）
    transports.push(
      new winston.transports.Console({
        // 生产环境控制台只输出warn和error（避免日志刷屏）
        level:
          this.configService.get('NODE_ENV') === 'production'
            ? 'warn'
            : 'debug',
      }),
    );

    // 2. 文件输出（按日期分割，保留30天）
    const fileTransportOptions = {
      dirname: 'logs', // 日志文件目录（项目根目录下的logs文件夹）
      filename: '%DATE%.log', // 文件名格式（如2024-10-12.log）
      datePattern: 'YYYY-MM-DD', // 日期格式
      maxSize: '20m', // 单个文件最大20MB
      maxFiles: '30d', // 保留30天日志
      zippedArchive: true, // 超过30天的日志压缩存档
    };

    // 所有级别日志文件（info及以上，包含debug）
    transports.push(
      new DailyRotateFile({
        ...fileTransportOptions,
        filename: 'all-%DATE%.log', // 区分所有日志和错误日志
        level: 'debug',
      }),
    );

    // 错误日志单独文件（只记录error级别，便于排查）
    transports.push(
      new DailyRotateFile({
        ...fileTransportOptions,
        filename: 'error-%DATE%.log',
        level: 'error',
      }),
    );

    return transports;
  }
}

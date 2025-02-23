import { Renderer2 } from '@angular/core';

/** 判断一个值是否为 Object
 * @param {any} value
 * @param {string} [mode='toString'] - 判定模式：'typeof' | 'instanceof' | 'toString' | 'comprehensive'
 * @return { boolean }
 */
export function isObject(
  value: any,
  mode: 'typeof' | 'instanceof' | 'toString' | 'comprehensive' = 'toString',
): boolean {
  const modeConfig = {
    typeof:
      typeof value === 'object' && value !== null && !Array.isArray(value),
    instanceof:
      value instanceof Object && value !== null && !Array.isArray(value),
    toString: Object.prototype.toString.call(value) === '[object Object]',
    comprehensive:
      typeof value === 'object' && value !== null && !Array.isArray(value),
  };

  return modeConfig[mode];
}

/** 比较两个对象或数组的相同的属性对应的值是否相同
 * @param {any} value1
 * @param {any} value2
 * @return { boolean }
 * */
export function isSameObj(value1: any, value2: any): boolean {
  if (typeof value1 === typeof value2) {
    if (isObject(value1) && isObject(value2)) {
      for (const key1 in value1) {
        for (const key2 in value2) {
          if (key1 === key2) {
            return !isSameObj(value1[key1], value2[key2][1]);
          }
        }
      }
    }
    if (Array.isArray(value1) && Array.isArray(value2)) {
      return value1.every((val1, index) => val1 === value2[index]);
    }
    return value1 === value2;
  }
  return false;
}

/** 根据查找并返回最终匹配项
 * @param { Array<any> } origin 需要查找的数据源
 * @param { any } value 对应查找项
 * @param { [string, string] } 查找的子项属性名称，对比的属性名称
 * @param { Array<number> } existingOffset 位置记录
 * @returns { offset: number[], value: any }  返回结果: 查找到的位置, 查找到的项
 */
export function getRecursivePosition<T>(
  origin: any[],
  value: any,
  attributes: [string, string],
  existingOffset: number[] = [],
): {
  offset: number[];
  value: any;
} | null {
  const [childrenName, diffName] = attributes;
  for (let i = 0; i < origin.length; i++) {
    let offset: number[] = [...existingOffset, i];
    if (origin[i][diffName] == value) {
      return { offset, value: origin[i] };
    } else {
      const originChildren = origin[i][childrenName];
      if (originChildren && originChildren.length) {
        const res = getRecursivePosition(
          originChildren,
          value,
          attributes,
          offset,
        );
        if (res) return res;
      }
    }
  }
  return null;
}

/** 对象深拷贝克隆
 * @param { any } obj - 原始对象
 * @param { WeakMap<object, object> } hash - 循环引用检查
 * @returns { any } - 克隆的新对象
 */
export function deepClone<T>(obj: T, hash = new WeakMap()): T {
  // 如果是原始类型，直接返回
  if (obj === null) return null as any;
  if (obj instanceof Date) return new Date(obj) as any;
  if (obj instanceof RegExp) return new RegExp(obj) as any;
  if (typeof obj !== 'object') return obj as any;

  // 如果是数组
  if (Array.isArray(obj)) {
    const clone: any[] = [];
    for (let item of obj) {
      clone.push(deepClone(item, hash));
    }
    return clone as T;
  }

  // 如果是对象
  if (obj instanceof Object) {
    // 检查是否已经克隆过，防止循环引用
    if (hash.has(obj)) return hash.get(obj) as T;

    const clone: { [key: string]: any } = {};
    hash.set(obj, clone);

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone((obj as any)[key], hash);
      }
    }
    return clone as T;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

/** 处理 ng Element 的 style
 * @param { Renderer2 } renderer - ng 的 Renderer2
 * @param { HTMLElement } el - ng 的 ElementRef
 * @param { { [key: string]: string | number } } style - 要操作的 style 对象
 * @param { "set" | "remove" } [mode='set'] - 处理模式：'set' - 追加或修改 style，'remove' - 删除 style
 */
export function handlerNgElStyle(
  renderer: Renderer2,
  el: HTMLElement,
  style: {
    [key: string]: string | number;
  },
  mode: 'set' | 'remove' = 'set',
): void {
  for (const attr in style) {
    if (style.hasOwnProperty(attr)) {
      renderer[`${mode}Style`](el, attr, style[attr]);
    }
  }
}

/**
 * 生成自定义 UUID 的函数
 *
 * @param {number} [length=12] - UUID 的长度，默认为 12 位
 * @param {boolean} [addLetters=false] - 是否在 UUID 前面添加 6 位随机字母，默认为 false
 * @param {string} [prefix=''] - 自定义前缀，默认为空字符串
 * @returns {string} 生成的 UUID 字符串
 */
export function generateUUID(
  prefix: string = '',
  addLetters: boolean = false,
  length: number = 12,
): string {
  let lettersPart = '';
  if (addLetters) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 6; i++) {
      lettersPart += letters.charAt(Math.floor(Math.random() * letters.length));
    }
  }

  let digitsPart = '';
  const digits = '0123456789';
  for (let i = 0; i < length; i++) {
    digitsPart += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return `${prefix}${lettersPart}${digitsPart}`;
}

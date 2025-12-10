import { Renderer2 } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { IAnyPropObj } from '@shared/models/common-component';

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
    typeof: typeof value === 'object' && value !== null && !Array.isArray(value),
    instanceof: value instanceof Object && value !== null && !Array.isArray(value),
    toString: Object.prototype.toString.call(value) === '[object Object]',
    comprehensive: typeof value === 'object' && value !== null && !Array.isArray(value),
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
        const res = getRecursivePosition(originChildren, value, attributes, offset);
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
 * @param {string} [prefix=''] - 自定义前缀，默认为空字符串
 * @param {boolean} [addLetters=false] - 是否在 UUID 前面添加 6 位随机字母，默认为 false
 * @param {number} [length=16] - UUID 的长度，默认为 16 位
 * @returns {string} 生成的 UUID 字符串
 */
export function generateUUID(
  prefix: string = '',
  addLetters: boolean = false,
  length: number = 16,
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

/**
 * 提取配置的类型定义。
 *
 * @description
 * - 每个属性可以是一个布尔值（表示是否保留该属性），
 * - 或者是一个嵌套的 PickConfig 对象（用于处理嵌套对象）。
 */
export type PickConfig = {
  [key: string]: boolean | PickConfig;
};

/**
 * 提取嵌套对象或数组的指定属性。
 *
 * @param obj - 目标对象或数组，可以是任意嵌套结构。
 * @param pickConfig - 提取配置对象，指定需要保留的属性。
 * @param childName - 嵌套属性的名称，默认为 'children'。
 * @returns 返回一个新对象或数组，只包含 pickConfig 中指定的属性。
 */
export function extractProperties<T extends Record<string, any> | any[]>(
  obj: T,
  pickConfig: PickConfig,
  childName: string = 'children',
): T {
  /**
   * 辅助函数：根据 pickConfig 提取对象的指定属性。
   *
   * @param o - 当前处理的对象。
   * @param config - 当前层级的提取配置。
   * @returns 返回提取后的对象。
   */
  function pick(o: Record<string, any>, config: PickConfig): Record<string, any> {
    if (typeof o !== 'object' || o === null) {
      // 如果当前值不是对象或为 null，直接返回
      return o;
    }
    const result: Record<string, any> = {};
    for (const key in config) {
      const value = o[key];
      if (value === undefined || value === null) {
        // 如果目标对象中没有该属性，跳过
        continue;
      }
      if (typeof config[key] === 'object' && config[key] !== null) {
        // 如果配置中该属性是对象，递归提取
        result[key] = pick(value, config[key]);
      } else {
        // 否则直接提取该属性
        result[key] = value;
      }
    }
    return result;
  }

  if (Array.isArray(obj)) {
    // 如果目标是数组，递归处理每个元素
    return obj.map((item) => extractProperties(item, pickConfig, childName)) as T;
  } else if (typeof obj === 'object' && obj !== null) {
    // 提取当前对象的指定属性
    const currentPick: Record<string, any> = pick(obj, pickConfig);
    // 如果配置中包含嵌套属性，递归处理
    if (pickConfig[childName] && Array.isArray(obj[childName])) {
      currentPick[childName] = obj[childName].map((child: Record<string, any>) =>
        extractProperties(child, pickConfig, childName),
      );
    }
    return currentPick as T;
  } else {
    // 如果目标不是对象或数组，直接返回
    return obj;
  }
}

export function isBoolean(value: any) {
  return typeof value === 'boolean';
}

export function isDefined(value: any): boolean {
  return typeof value !== 'undefined';
}

export function isUndefined(value: any): boolean {
  return typeof value === 'undefined';
}

export function isDefinedAndNotNull(value: any): boolean {
  return typeof value !== 'undefined' && value !== null;
}

export function isUndefinedOrNull(value: any): boolean {
  return typeof value === 'undefined' || value === null;
}

export function isEmptyStr(value: any): boolean {
  return value === '';
}

export function isNotEmptyStr(value: any): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

export function isNumber(value: any): boolean {
  return typeof value === 'number';
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isNotEmpty(value: any): boolean {
  if (typeof value === 'string') return isNotEmptyStr(value);
  return value || value === 0;
}

export function isMobile() {
  // 使用正则表达式匹配常见的移动设备浏览器的用户代理字符串
  const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

/**
 * 从对象中提取指定的属性。
 * @param {T} obj - 原始对象。
 * @param {string[]} keys - 需要提取的属性键数组。
 * @returns {Pick<T, K>} - 一个新对象，只包含指定的属性。
 */
export function pick(obj: IAnyPropObj, keys: Array<string>) {
  if (typeof obj !== 'object' || obj === null || !Array.isArray(keys)) {
    return obj;
  }

  const result: IAnyPropObj = {};

  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });

  return result;
}

export function getParamFromRoute(paramName: string, route: ActivatedRoute): string | null {
  let currentRoute: ActivatedRoute | null = route;

  while (currentRoute) {
    // 同时检查路径参数和查询参数
    const paramValue =
      currentRoute.snapshot.paramMap.get(paramName) ||
      currentRoute.snapshot.queryParamMap.get(paramName);

    if (paramValue !== null) return paramValue;

    currentRoute = currentRoute.parent;
  }
  return null;
}

/**
 * 从字符串中匹配指定开头字符串和指定结尾字符串之间的子字符串（包括开头和结尾字符串）。
 * @param {string} str - 需要匹配的源字符串。
 * @param {string} startStr - 指定的开头字符串。
 * @param {string} endStr - 指定的结尾字符串。
 * @returns {string} - 匹配到的子字符串，如果没有匹配到则返回空字符串。
 */
export function matchSubstring(str: string, startStr: string, endStr: string) {
  // 找到第一个匹配的开头字符串的位置
  const startIndex = str.indexOf(startStr);

  // 如果没有找到开头字符串，返回空字符串
  if (startIndex === -1) {
    return '';
  }

  // 计算结尾字符串的起始位置（从开头字符串的下一个字符开始）
  const endSearchStart = startIndex + startStr.length;

  // 从 endSearchStart 位置开始，找到第一个匹配的结尾字符串的位置
  const endIndex = str.indexOf(endStr, endSearchStart);

  // 如果没有找到结尾字符串，返回空字符串
  if (endIndex === -1) {
    return '';
  }

  // 返回匹配的子字符串（包括开头字符串和结尾字符串）
  return str.substring(startIndex, endIndex + endStr.length);
}

/**
 * 将树结构数据按照指定 key 拉平为一维数组
 * @param {Array<any>} treeData - 树结构数据
 * @param {string} key - 用于拉平的 key
 * @returns {Array<any>} - 拉平后的数组
 */
export function flattenTree(treeData: Array<any>, key: string) {
  const result: Array<any> = [];
  treeData.forEach((item) => {
    result.push(item);
    if (item[key]) {
      result.push(...flattenTree(item[key], key));
    }
  });

  return result;
}

/**
 * 查询树节点中某个节点的父节点数据
 * @param {Array<IAnyPropObj>} treeData - 树结构数据
 * @param {string} value - 用于查找的值
 * @param {attributes} key - 用于查找的存储key
 * @param {string} key - 用于查找的key
 * @returns {IAnyPropObj | null} - 拉平后的数组
 */
export function findParentById(
  treeData: IAnyPropObj[],
  targetValue: string,
  childrenName: string = 'children',
  key: string = 'id',
): IAnyPropObj | null {
  for (let node of treeData) {
    if (node[childrenName]) {
      const isInParent = node[childrenName].some((item: IAnyPropObj) => item[key] === targetValue);
      if (isInParent) {
        return node; // 找到目标节点的父节点
      }
      const parent = findParentById(node[childrenName], targetValue, childrenName, key); // 递归搜索子节点
      if (parent) {
        return parent; // 如果在子节点中找到父节点，返回结果
      }
    }
  }
  return null; // 如果遍历完所有节点仍未找到，返回 null
}

/**
 * 获取路由路径片段
 * @param route 路由对象
 * @returns 路由路径片段
 */
export function getRoutePathSegments(route: ActivatedRoute | null): Route[] {
  const segments: Route[] = [];
  while (route) {
    if (route.routeConfig) {
      segments.push(route.routeConfig);
    }
    route = route.firstChild;
  }
  return segments;
}

/**
 * download 根据地址下载文件，可自定义文件名
 * @param {string} dataURL - 文件地址
 * @param {string} [fileName] - 自定义文件名
 * @returns {void}
 */
export async function download(url: string, fileName: string) {
  // 工具函数：dataURL转Blob（复用原有逻辑）
  function dataURLToBlob(dataURL: string): Blob {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  // 工具函数：创建a标签下载Blob
  function downloadBlob(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // 清理DOM
    window.URL.revokeObjectURL(url); // 释放内存
  }

  // 工具函数：将相对路径转换为绝对路径
  function getAbsoluteUrl(relativeUrl: string): string {
    // 利用URL构造函数自动拼接当前域名和协议
    // window.location.origin 是当前页面的基础域名（如 https://example.com）
    return new URL(relativeUrl, window.location.origin).href;
  }

  try {
    let blob: Blob;
    let absoluteUrl = url;

    // 1. 处理dataURL（以data:开头）
    if (url.startsWith('data:')) {
      blob = dataURLToBlob(url);
    }
    // 2. 处理绝对路径网络URL（以http://或https://开头）
    else if (url.startsWith('http://') || url.startsWith('https://')) {
      absoluteUrl = url; // 已为绝对路径，无需处理
    }
    // 3. 处理相对路径（自动拼接当前域名）
    else {
      absoluteUrl = getAbsoluteUrl(url); // 转换为绝对路径
    }

    // 如果是网络URL（包括转换后的绝对路径），发起请求获取Blob
    if (absoluteUrl.startsWith('http://') || absoluteUrl.startsWith('https://')) {
      const response = await fetch(absoluteUrl, {
        mode: 'cors',
        cache: 'no-store',
      });
      if (!response.ok) {
        // 注入弹窗服务
        alert(`下载失败：${response.statusText}`);
        throw new Error(`下载失败：${response.statusText}`);
      }
      blob = await response.blob();
      downloadBlob(blob, fileName);
    }

    // 执行下载
  } catch (error) {
    console.error('下载出错：', error);
    throw error; // 抛出错误让调用方处理
  }
}

export function isImage(path: string) {
  if (!path) return false;
  // 1. 先判断是否为 base64 格式的图片（data URI）
  const isBase64Image = /^data:image\/(jpg|jpeg|png|gif|webp);base64,/i.test(path);
  if (isBase64Image) {
    return true;
  }

  // 2. 再判断传统文件路径（原有逻辑）
  const fileName = path.split('?')[0].split('#')[0]; // 去掉查询参数和锚点
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
}

export function isVideo(path: string) {
  if (!path) return false;
  // 1. 先判断是否为 base64 格式的视频（data URI）
  const isBase64Video = /^data:video\/(mp4|mov|avi|flv|mkv);base64,/i.test(path);
  if (isBase64Video) {
    return true;
  }

  // 2. 再判断传统文件路径（原有逻辑）
  const fileName = path.split('?')[0].split('#')[0]; // 去掉查询参数和锚点
  return /\.(mp4|mov|avi|flv|mkv)$/i.test(fileName);
}

/**
 * 将驼峰命名法转换为横线分隔命名法（kebab-case）
 * @param str 待转换的驼峰字符串（如 backgroundColor、BackgroundColor）
 * @returns 横线分隔的字符串（如 background-color）
 */
export function camelToKebabCase(str: string): string {
  // 处理非字符串、空字符串的情况
  if (typeof str !== 'string' || str.trim() === '') {
    return '';
  }

  // 核心正则：匹配大写字母，在其前加横线；处理连续大写（如 API → api）
  const kebabStr = str
    // 匹配大写字母（排除开头），在前面加横线
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    // 处理开头大写的情况（如 BackgroundColor → -background-color）
    .replace(/^([A-Z])/, '$1')
    // 统一转为小写
    .toLowerCase();

  // 移除可能的开头横线（如原字符串首字母大写时产生的）
  return kebabStr.startsWith('-') ? kebabStr.slice(1) : kebabStr;
}

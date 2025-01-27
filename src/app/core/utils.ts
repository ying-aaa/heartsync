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
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

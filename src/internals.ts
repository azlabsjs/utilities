// @internal
export const getTag = (value: any) => {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
};

// @internal
export const constructorName = (value: any) => {
  return typeof value?.constructor === 'function'
    ? value?.constructor?.name
    : undefined;
};

// @internal
export const isArrayLikeLength = (value: number) => {
  /** Used as references for various `Number` constants. */
  const MAX_SAFE_INTEGER = 9007199254740991;
  return (
    typeof value === 'number' &&
    value > -1 &&
    value % 1 === 0 &&
    value <= MAX_SAFE_INTEGER
  );
};

// @internal
export const isObjectLike = (value: any) =>
  value !== null && typeof value === 'object';

// @internal
export const isGeneratorObj = (value: any) =>
  typeof value.throw === 'function' &&
  typeof value.return === 'function' &&
  typeof value.next === 'function';

// @internal
export const isGeneratorFunction = (name: object) => {
  return constructorName(name) === 'GeneratorFunction';
};

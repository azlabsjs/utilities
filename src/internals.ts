export const getTag = (value: any) => {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
};

export const constructorName = (value: any) => {
  return typeof value?.constructor === 'function'
    ? value?.constructor?.name
    : undefined;
};

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

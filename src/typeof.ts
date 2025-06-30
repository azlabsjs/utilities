import {
  constructorName,
  getTag,
  isArrayLikeLength,
  isGeneratorFunction,
  isGeneratorObj,
  isObjectLike,
} from './internals';
import { UnknownType } from './types';

/**
 * checks if `value` is a valid javascript exception/error object
 */
export function isError(value: unknown) {
  return (
    value instanceof Error ||
    (typeof (value as Error)?.message === 'string' &&
      value?.constructor &&
      typeof (value?.constructor as UnknownType)?.stackTraceLimit === 'number')
  );
}

/**
 * checks if `value` is a variadic function parameter
 */
export function isArguments(value: UnknownType) {
  if (
    typeof value?.length === 'number' &&
    typeof value?.callee === 'function'
  ) {
    return true;
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */
export const isBuffer = (value: UnknownType) => {
  if (value.constructor && typeof value.constructor.isBuffer === 'function') {
    return value.constructor.isBuffer(value);
  }
  return false;
};

/**
 * checks if provided value is a valid javascript date object
 */
export function isDate(value: UnknownType) {
  if (value instanceof Date) return true;
  return (
    typeof value.toDateString === 'function' &&
    typeof value.getDate === 'function' &&
    typeof value.setDate === 'function'
  );
}

/**
 * checks if value is a regular expression object
 */
export function isRegexp(value: UnknownType) {
  if (value instanceof RegExp) return true;
  return (
    typeof value.flags === 'string' &&
    typeof value.ignoreCase === 'boolean' &&
    typeof value.multiline === 'boolean' &&
    typeof value.global === 'boolean'
  );
}

/**
 * checks if provided value is iterable or has `length` property
 */
export function isArrayLike(value: UnknownType) {
  return (
    value !== null &&
    typeof value !== 'function' &&
    isArrayLikeLength(value.length)
  );
}

export function isTypedArray(value: UnknownType) {
  /** Used to match `toStringTag` values of typed arrays. */
  const reTypedTag =
    /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;
  return isObjectLike(value) && reTypedTag.test(getTag(value));
}

/**
 * Returns `true` if value if a prototype instead of object value
 */
export function isPrototype(value: unknown) {
  const constructor = value && (value as UnknownType).constructor;
  const prototype =
    (typeof constructor === 'function' && constructor.prototype) ||
    Object.prototype;
  return value === prototype;
}

/**
 * Checks if a given data structure is empty.
 *
 * **Note**
 *
 *  Array and string are empty if `.length` property === 0.
 *
 *  Object is empty each key of the object returns a truthy value
 */
export function isEmpty(value: UnknownType) {
  if (value == null) {
    return true;
  }
  if (
    isArrayLike(value) &&
    (Array.isArray(value) ||
      typeof value === 'string' ||
      typeof value.splice === 'function' ||
      isBuffer(value) ||
      isTypedArray(value) ||
      isArguments(value))
  ) {
    return !value.length;
  }
  const tag = getTag(value);
  if (tag === '[object Map]' || tag === '[object Set]') {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !Object.keys(value).length;
  }
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Check if the value of the object is not equals to null or undefined
 */
export function isDefined(value: unknown) {
  return typeof value !== 'undefined' && value !== null && value !== undefined;
}

/**
 * Check if a given value is a JS object
 *
 */
export function isObject<
  T extends Record<string, UnknownType> = Record<string, UnknownType>,
>(value: unknown): value is T {
  return (
    value !== null &&
    !Array.isArray(value) &&
    (typeof value === 'object' || typeof value === 'function')
  );
}

/**
 * checks if `value` parameter is a plain javascipt object
 */
export function isPlainObject<
  T extends Record<string, UnknownType> = Record<string, UnknownType>,
>(value: unknown): value is T {
  if (isObject(value) === false) return false;

  // If has modified constructor
  const constructor_ = (value as UnknownType).constructor;
  if (constructor_ === undefined) return true;

  // If has modified prototype
  const prototype_ = constructor_.prototype;
  if (isObject(prototype_) === false) return false;

  // If constructor does not have an Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  if (prototype_.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

/**
 * checks if a variable is of primitive type aka string|number|boolean|symbol
 */
export function isPrimitive(
  value: unknown
): value is number | string | boolean | symbol {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'symbol':
      return true;
  }
  return !!(
    value instanceof String ||
    value === String ||
    value instanceof Number ||
    value === Number ||
    value instanceof Boolean ||
    value === Boolean
  );
}

/** checks if the provided function parameter is of type number */
export function isNumber(value: unknown): value is number {
  if (value === null || typeof value === 'undefined') {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (isObjectLike(value)) {
    return false;
  }
  value = isNaN(value as number) ? value : +(value as number);
  return (
    typeof value === 'number' || value instanceof Number || value === Number
  );
}

export function isNullOrNaN(
  value: unknown
): value is null | undefined | typeof NaN {
  if (isObject(value) || isArray(value)) {
    return true;
  }
  if (!isDefined(value)) {
    return true;
  }
  return isNaN(value as number);
}

/**
 * @description Checks if a variable is of Array type
 * @param value
 * @returns
 */
export function isArray<T = UnknownType>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export const typeOf = (value: unknown) => {
  if (value === void 0) return 'undefined';
  if (value === null) return 'null';
  let type = typeof value as string;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFunction(value) ? 'generatorfunction' : 'function';
  }
  if (Array.isArray(value)) return 'array';
  if (isBuffer(value)) return 'buffer';
  if (isArguments(value)) return 'arguments';
  if (isDate(value)) return 'date';
  if (isError(value)) return 'error';
  if (isRegexp(value)) return 'regexp';

  switch (constructorName(value)) {
    case 'Symbol':
      return 'symbol';
    case 'Promise':
      return 'promise';
    // Set, Map, WeakSet, WeakMap
    case 'WeakMap':
      return 'weakmap';
    case 'WeakSet':
      return 'weakset';
    case 'Map':
      return 'map';
    case 'Set':
      return 'set';
    // 8-bit typed arrays
    case 'Int8Array':
      return 'int8array';
    case 'Uint8Array':
      return 'uint8array';
    case 'Uint8ClampedArray':
      return 'uint8clampedarray';
    // 16-bit typed arrays
    case 'Int16Array':
      return 'int16array';
    case 'Uint16Array':
      return 'uint16array';
    // 32-bit typed arrays
    case 'Int32Array':
      return 'int32array';
    case 'Uint32Array':
      return 'uint32array';
    case 'Float32Array':
      return 'float32array';
    case 'Float64Array':
      return 'float64array';
  }
  if (isGeneratorObj(value)) {
    return 'generator';
  }

  // Non-plain objects
  type = Object.prototype.toString.call(value);
  switch (type) {
    case '[object Object]':
      return 'object';
    // iterators
    case '[object Map Iterator]':
      return 'mapiterator';
    case '[object Set Iterator]':
      return 'setiterator';
    case '[object String Iterator]':
      return 'stringiterator';
    case '[object Array Iterator]':
      return 'arrayiterator';
  }

  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

export function isFunction<
  T extends (...args: UnknownType[]) => UnknownType = (
    ...args: UnknownType[]
  ) => UnknownType,
>(arg: unknown): arg is T {
  return typeof arg === 'function';
}

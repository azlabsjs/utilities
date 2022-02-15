import { constructorName, getTag, isArrayLikeLength } from './internals';

export type Callable = () => any;
export type Fn = (value?: any) => void;

export const maxNumberSize = () => Number.MAX_SAFE_INTEGER;

/**
 * Determines if two objects or two values are equivalent.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `equals`.
 *
 * @param first Object or value to compare.
 * @param second Object or value to compare.
 * @returns true if arguments are equal.
 */
export const equals = (first: any, second: any) => {
  if (first === second) {
    return true;
  }
  if (first === null || second === null) {
    return false;
  }
  const typeofFirst = typeof first;
  if (typeofFirst === typeof second && typeofFirst === 'object') {
    if (Array.isArray(first)) {
      if (!Array.isArray(second)) {
        return false;
      }
      const length = first.length;
      if (length === second.length) {
        for (let index = 0; index < length; index++) {
          if (!equals(first[index], second[index])) {
            return false;
          }
        }
        return true;
      }
    } else {
      if (Array.isArray(second)) {
        return false;
      }
      let keySet = new Set(
        (function*() {
          for (const k of Object.keys(first)) {
            if (!equals(first[k], second[k])) {
              break;
            }
            yield k;
          }
        })()
      );
      for (let key in second) {
        if (!keySet.has(key) && typeof second[key] !== 'undefined') {
          return false;
        }
      }
      return true;
    }
  }
  return false;
};

/**
 * Check if the value of the object is not equals to null or undefined
 *
 * @param value
 */
export const isDefined = (value: any) =>
  typeof value !== 'undefined' && value !== null && value !== undefined;

/**
 * Check if a given value is a JS object
 *
 * @param value
 */
export const isObject = (value: any) =>
  value !== null &&
  !Array.isArray(value) &&
  (typeof value === 'object' || typeof value === 'function');

export const isObjectLike = (value: any) =>
  value !== null && typeof value === 'object';

export const isPrototype = (value: any) => {
  const constructor = value && value.constructor;
  const prototype =
    (typeof constructor === 'function' && constructor.prototype) ||
    Object.prototype;
  return value === prototype;
};

/**
 *
 * @param value
 */
export function isPlainObject(value: any) {
  let constructor_, prototype_;

  if (isObject(value) === false) return false;

  // If has modified constructor
  constructor_ = value.constructor;
  if (constructor_ === undefined) return true;

  // If has modified prototype
  prototype_ = constructor_.prototype;
  if (isObject(prototype_) === false) return false;

  // If constructor does not have an Object-specific method
  if (prototype_.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

/**
 * @description Checks if a variable is of primitive type aka string|number|boolean
 * @param param [[any]]
 */
export const isPrimitive = (param: any) => {
  switch (typeof param) {
    case 'string':
    case 'number':
    case 'boolean':
      return true;
  }
  return !!(
    param instanceof String ||
    param === String ||
    param instanceof Number ||
    param === Number ||
    param instanceof Boolean ||
    param === Boolean
  );
};

/**
 * @description Checks if the provided function parameter is of type number
 */
export const isNumber = (value: any) => {
  if (value === null || typeof value === 'undefined') {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (isObjectLike(value)) {
    return false;
  }
  value = isNaN(value as any) ? value : +value;
  return (
    typeof value === 'number' || value instanceof Number || value === Number
  );
};

export const isNullOrNaN = (value: any) => {
  if (isObject(value) || isArray(value)) {
    return true;
  }
  if (!isDefined(value)) {
    return true;
  }
  return isNaN(value);
};

/**
 * @description Checks if a variable is of Array type
 * @value value [[any]]
 */
export const isArray = (value: any) => Array.isArray(value);

/**
 * @description Generate the hascode of a given string
 * @param name
 */
export function hashCode(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    // tslint:disable-next-line: no-bitwise
    hash = (Math.imul(31, hash) + name.charCodeAt(i)) | 0;
  }
  return hash;
}

export const check = (callback: {
  (arg0: string[]): any;
  name?: any;
  required: any[];
}) => (params: string[] = []) => {
  const { required } = callback;
  const missing = required?.filter((param: string) => !(param in params)) ?? [];
  if (missing.length !== 0) {
    throw new Error(`${callback.name}() Missing required parameter(s):
    ${missing.join(', ')}`);
  }
  return callback(params);
};

export const isError = (value: any) => {
  return (
    value instanceof Error ||
    (typeof value?.message === 'string' &&
      value?.constructor &&
      typeof value?.constructor?.stackTraceLimit === 'number')
  );
};

export const isGeneratorObj = (value: any) =>
  typeof value.throw === 'function' &&
  typeof value.return === 'function' &&
  typeof value.next === 'function';

export const isArguments = (value: any) => {
  if (
    typeof value?.length === 'number' &&
    typeof value?.callee === 'function'
  ) {
    return true;
  }
  return false;
};

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */
export const isBuffer = (value: any) => {
  if (value.constructor && typeof value.constructor.isBuffer === 'function') {
    return value.constructor.isBuffer(value);
  }
  return false;
};

export const isDate = (value: any) => {
  if (value instanceof Date) return true;
  return (
    typeof value.toDateString === 'function' &&
    typeof value.getDate === 'function' &&
    typeof value.setDate === 'function'
  );
};

export const isRegexp = (value: any) => {
  if (value instanceof RegExp) return true;
  return (
    typeof value.flags === 'string' &&
    typeof value.ignoreCase === 'boolean' &&
    typeof value.multiline === 'boolean' &&
    typeof value.global === 'boolean'
  );
};

export const isArrayLike = (value: any) => {
  return (
    value !== null &&
    typeof value !== 'function' &&
    isArrayLikeLength(value.length)
  );
};

export const isTypedArray = (value: any) => {
  /** Used to match `toStringTag` values of typed arrays. */
  const reTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;
  return isObjectLike(value) && reTypedTag.test(getTag(value));
};

export const isEmpty = (value: any) => {
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
};

export const isGeneratorFunction = (name: object) => {
  return constructorName(name) === 'GeneratorFunction';
};

export const typeOf = (value: any) => {
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

  return type
    .slice(8, -1)
    .toLowerCase()
    .replace(/\s/g, '');
};

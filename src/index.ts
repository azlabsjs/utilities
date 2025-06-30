import { UnknownType } from './types';

export type Callable<
  Params extends UnknownType[] = unknown[],
  RType = unknown,
> = (...args: Params) => RType;

// Unknown types utility functions
export { shallowEqual, deepEqual } from './unknown';

// Types utilities functions
export {
  isEmpty,
  isArguments,
  isArray,
  isArrayLike,
  isObject,
  isBuffer,
  isDate,
  isDefined,
  isError,
  isNullOrNaN,
  isNumber,
  isPlainObject,
  isPrimitive,
  isPrototype,
  isRegexp,
  isTypedArray,
  typeOf,
  isFunction
} from './typeof';

// Assertion functions
export { assertRequiredArgs } from './assert';


/**
 * @description Generic Javascript function type definition
 */
export type Callable<Params extends any[] = unknown[], RType = unknown> = (...args: Params) => RType;

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
} from './typeof';

//TODO : Remove in future release as does not have any idea of what it's doing
export const check =
  (callback: { (arg0: string[]): any; name?: any; required: any[] }) =>
  (params: string[] = []) => {
    const { required } = callback;
    const missing =
      required?.filter((param: string) => !(param in params)) ?? [];
    if (missing.length !== 0) {
      throw new Error(`${callback.name}() Missing required parameter(s):
    ${missing.join(', ')}`);
    }
    return callback(params);
  };

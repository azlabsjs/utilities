function isobject_(o: unknown) {
  return o != null && typeof o === 'object';
}

/**
 * @description Compare the two javascript object/variables using the === operator
 *
 * @param a
 * @param b
 */
export const strictEqual = (a: unknown, b: unknown) =>  a === b;

/**
 *
 * @description Compare values (shallow comparison) of provided objects
 *
 * @example
 * const result = shallowEqual({lat: 3.9855, long: 1.98204}, {}); // false
 *
 * const result = shallowEqual({lat: 3.9855, long: 1.98204}, {lat: 3.9855, long: 1.98204}); // true
 *
 * @param a
 * @param b
 */
export const shallowEqual = (a: unknown, b: unknown) => {
  if (a === b) {
    return true;
  }
  if (isobject_(a) && isobject_(b)) {
    const _a = a as any;
    const _b = b as any;
    if (
      (Array.isArray(_a) && !Array.isArray(_b)) ||
      (Array.isArray(_a) && !Array.isArray(_b))
    ) {
      return false;
    }
    const aKeys = Object.keys(_a);
    if (aKeys.length !== Object.keys(_b).length) {
      return false;
    }
    for (const key of aKeys) {
      if (_a[key] !== _b[key]) {
        return false;
      }
    }
    return true;
  }
  return Object.is(a, b);
};

/**
 *
 * @description Apply a deep equality comparison on parameters
 * It performs a recursive comparison on all properties of both object.
 *
 * **Warning**
 * When the compared objects have a lot of properties or the structure of
 * the objects is determined during runtime, a better approach is to use {@see shallowEqual}.
 *
 * It also accept a depth parameter that can be used to limit the recursive calls.
 *
 * **Note**
 *  Depth is zero-based therefore should be used with care
 *
 * @example
 * console.log(deepEqual({ lat: 3.9855, long: 1.98204 }, {})); // false
 * console.log(deepEqual({ lat: 3.9855, long: 1.98204 }, { lat: 3.9855, long: 1.98204 })); // true
 * // // Using depth parameter
 * console.log(deepEqual(
 * {
 *      name: 'John Doe',
 *      address: {
 *          email: 'johndoe@example.com',
 *          location: { lat: 3.9855, long: 1.98204 }
 *      }
 * },
 * {
 *      name: 'John Doe',
 *      address: {
 *          email: 'johndoe@example.com',
 *          location: { lat: 3.98, long: 1.982 }
 *      }
 * },
 *  2
 * )); // true b'cause depth is set to 2, as comparison does not goes down to location comparison
 * console.log(deepEqual(
 * {
 *      name: 'John Doe',
 *      address: {
 *          email: 'johndoe@example.com',
 *          location: { lat: 3.9855, long: 1.98204 }
 *      }
 * },
 * {
 *      name: 'John Doe',
 *      address: {
 *          email: 'johndoe@example.com',
 *          location: { lat: 3.98, long: 1.982 }
 *      }
 * },
 * 3
 * )); // false b'cause depth is set to 3, making comparison tp go down to location comparison
 *
 * @param a
 * @param b
 * @param depth
 */
export const deepEqual = (
  a: unknown,
  b: unknown,
  depth = Infinity
) => {
  let lasResult = true;
  let currentDepth = 0;
  const recursiveFn = (_a: any, _b: any, _depth = Infinity) => {
    if (a === b) {
      lasResult = true;
      return lasResult;
    }
    if (currentDepth === _depth) {
      return lasResult;
    }
    currentDepth++;
    if (
      (Array.isArray(_a) && !Array.isArray(_b)) ||
      (Array.isArray(_a) && !Array.isArray(_b))
    ) {
      lasResult = false;
      return lasResult;
    }
    const aKeys = Object.keys(_a);
    if (aKeys.length !== Object.keys(_b).length) {
      lasResult = false;
      return lasResult;
    }
    for (const key of aKeys) {
      const valueOfA = _a[key] as any;
      const valueOfB = _b[key] as any;
      const areObjects = isobject_(valueOfA) && isobject_(valueOfB);
      if (
        (areObjects && !recursiveFn(valueOfA, valueOfB, _depth)) ||
        (!areObjects && valueOfA !== valueOfB)
      ) {
        lasResult = false;
        return lasResult;
      }
    }
    lasResult = true;
    return lasResult;
  };
  recursiveFn(a, b, depth);
  return lasResult;
};

function isobject_(o: unknown): o is Record<string, unknown> {
  return o !== null && typeof o === 'object';
}

/** @description Compare the two javascript object/variables using the === operator */
export const strictEqual = (a: unknown, b: unknown) => a === b;

/**
 *
 * @description Compare values (shallow comparison) of provided objects
 *
 * @example
 * const result = shallowEqual({lat: 3.9855, long: 1.98204}, {}); // false
 *
 * const result = shallowEqual({lat: 3.9855, long: 1.98204}, {lat: 3.9855, long: 1.98204});
 */
export const shallowEqual = (a: unknown, b: unknown) => {
  if (a === b) {
    return true;
  }
  if (isobject_(a) && isobject_(b)) {
    if (
      (Array.isArray(a) && !Array.isArray(b)) ||
      (Array.isArray(a) && !Array.isArray(b))
    ) {
      return false;
    }
    const aKeys = Object.keys(a);
    if (aKeys.length !== Object.keys(b).length) {
      return false;
    }
    for (const key of aKeys) {
      if (a[key] !== b[key]) {
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
export const deepEqual = (a: unknown, b: unknown, depth = Infinity) => {
  let result = true;
  let track = 0;
  const fn = (_a: unknown, _b: unknown, _depth = Infinity) => {
    if (a === b) {
      result = true;
      return result;
    }

    if (track === _depth) {
      return result;
    }

    track++;
    if (
      (Array.isArray(_a) && !Array.isArray(_b)) ||
      (Array.isArray(_a) && !Array.isArray(_b))
    ) {
      result = false;
      return result;
    }

    if (isobject_(_a) && isobject_(_b)) {
      const aKeys = Object.keys(_a);
      if (aKeys.length !== Object.keys(_b).length) {
        result = false;
        return result;
      }
      for (const key of aKeys) {
        const valueOfA = _a[key];
        const valueOfB = _b[key];
        const areObjects = isobject_(valueOfA) && isobject_(valueOfB);
        if (
          (areObjects && !fn(valueOfA, valueOfB, _depth)) ||
          (!areObjects && valueOfA !== valueOfB)
        ) {
          result = false;
          return result;
        }
      }
      result = true;
    } else {
      result = a === b;
    }

    return result;
  };

  fn(a, b, depth);

  return result;
};

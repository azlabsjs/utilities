// Cache
import {
  CacheComparator,
  CacheEntry,
  CacheKey,
  CacheType,
  Compator,
  EqualityCacheOptions,
  NOT_FOUND,
} from './types';

// Helpers
// @internal
// Internal implementation of a cache arguments comparator function
function cacheComparator(equals: Compator) {
  return (prev: CacheKey, next: CacheKey) => {
    if (
      prev === null ||
      typeof prev === 'undefined' ||
      typeof next === 'undefined' ||
      next === null ||
      prev?.length !== next?.length
    ) {
      return false;
    }
    for (let i = 0; i < prev.length; i++) {
      if (!equals(prev[i], next[i])) {
        return false;
      }
    }
    return true;
  };
}
//!Helpers
//
/**
 * Memoizer cache implementation
 * It computes hash of arguments to memoize and use the computed
 * hash value of check if result exists in cache or not
 *
 * @example
 * const cache = HashCache();
 *
 * // Memoize arguments
 * cache.set({url: 'http:localhost', params: {page: 1, per_page: 10}}, []);
 *
 * // Get memoized arguments
 * cache.get({url: 'http:localhost', params: {page: 1, per_page: 10}});
 *
 * @returns {@see CacheType}
 */
export function HashCache(): CacheType {
  const store = new Map<number, any>();
  const computeHash = (str: string) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  };
  /**
   * // Serialization function
   * Takes in list of arguments and convert them into string
   */
  const valueHasher = (value: any) => {
    const serialize_ = (arg: any) => {
      const argType = typeof arg;
      if (argType === 'string') {
        return arg;
      }
      const stringeable =
        arg === null ||
        argType === 'undefined' ||
        argType === 'number' ||
        argType === 'boolean' ||
        argType === 'function';
      if (stringeable) {
        return arg.toString();
      }
      if (argType === 'object' && typeof arg.entries === 'function') {
        return JSON.stringify(Object.fromEntries(arg.entries()));
      }
      return JSON.stringify(arg);
    };
    return function <T>(hashFunction: (v: string) => T) {
      const result = hashFunction(
        Array.isArray(value)
          ? value.map((v) => serialize_(v)).join(',')
          : (serialize_(value) as string)
      );
      return result;
    };
  };
  // Compute the hash value of the serialized
  const keyFn = (value: any) => valueHasher(value)(computeHash);
  return {
    get: (key: unknown) => {
      const key_ = keyFn(key);
      return store.get(key_) ?? NOT_FOUND;
    },
    set: (key: unknown, value: any) => {
      const key_ = keyFn(key);
      store.set(key_, value);
    },
    entries: () => Array.from(store.values()),
  };
}

/**
 * Memoizer cache implementation
 *
 * It uses a comparator function to check if arguments result exists in cache.
 * It maintains a single entry of each computed values
 *
 * @example
 * const cache = SingleValueCache(cacheComparator(strictEquality));
 *
 * // Memoize arguments
 * cache.set({url: 'http:localhost', params: {page: 1, per_page: 10}}, []);
 *
 * // Get memoized arguments
 * cache.get({url: 'http:localhost', params: {page: 1, per_page: 10}});
 *
 *
 * @param equals {@see CacheComparator}
 * @returns CacheType
 */
export function SingleValueCache(equals: CacheComparator): CacheType {
  let entry!: CacheEntry;
  return {
    get: (key: CacheKey) => {
      if (entry && equals(entry.key, key)) {
        return entry.value;
      }
      return NOT_FOUND;
    },
    set: (key: CacheKey, value: unknown) => {
      entry = { key, value };
    },
    entries: () => (entry ? [entry] : []),
  };
}

// @internal
function LRUCache(size: number, equals: CacheComparator): CacheType {
  let entries: CacheEntry[] = [];

  const __get = (key: CacheKey) => {
    const index = entries.findIndex((entry) => equals(key, entry.key));
    if (index !== -1) {
      const entry = entries[index];
      if (index > 0) {
        // Remove entry from the
        entries.splice(index, 1);
        // Move entry to the top of the list
        entries = [entry].concat(entries.slice(1));
      }
      return entry.value;
    }
    return NOT_FOUND;
  };
  return {
    get: (key: CacheKey) => __get(key),

    set: (key: CacheKey, value: unknown) => {
      if (__get(key) !== NOT_FOUND) {
        return;
      }
      // Remove the least recent item accessed if the cache is full
      if (entries.length > size - 1) {
        entries.pop();
      }
      // Add recent cache item to the top
      entries = [{ key, value }, ...entries.slice(1)];
    },
    entries: () => {
      return entries;
    },

    clear: () => {
      entries = [];
    },
  };
}

export const HashCacheFactory = {
  create: () => HashCache(),
};

export const EqualityCacheFactory = (options: EqualityCacheOptions) => ({
  create: () =>
    options?.size
      ? LRUCache(options?.size, cacheComparator(options.func))
      : SingleValueCache(cacheComparator(options.func)),
});
// !Ends Cache

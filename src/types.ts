// constants
// @internal
export const NOT_FOUND = '__NOT_FOUND__';
//!Ends Constants

// Types
//
// @internal
export type Compator<Params extends unknown[] = any[]> = (
  a: unknown,
  b: unknown,
  ...least: Params
) => boolean;

// @internal
export type CacheComparator = (
  prev: unknown[] | IArguments | undefined,
  next: unknown[] | IArguments | undefined
) => boolean;

// @internal
export type CacheKey = unknown[] | IArguments | undefined;

// @internal
export type CacheEntry = { key: CacheKey; value: unknown };

// @internal
export type CacheType = {
  get(key: CacheKey): any | typeof NOT_FOUND;
  set(key: CacheKey, value: any): void;
  entries: () => unknown;
  clear?: () => void;
};

// @internal
export type EqualityCacheOptions = {
  func: Compator;
  size?: number;
};

export type MemoizerOptions = {
  cacheFactory: {
    create(): CacheType;
  };
  equality: EqualityCacheOptions;
  hash?: boolean;
  strategy: (
    internal: (...args: unknown[]) => unknown,
    options: MemoizerOptions
  ) => any;
};

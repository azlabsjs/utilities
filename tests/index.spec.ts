import {
  deepEqual,
  isArrayLike,
  isBuffer,
  isDate,
  isDefined,
  isEmpty,
  isError,
  isNullOrNaN,
  isNumber,
  isObject,
  isPlainObject,
  isPrimitive,
  isPrototype,
  isTypedArray,
  typeOf,
} from '../src';
import {
  isGeneratorFunction,
  isGeneratorObj,
  isObjectLike,
} from '../src/internals';

describe('Collection Class Test', () => {
  it('should evaluate whether two variables are equals', () => {
    const result = deepEqual(
      { lat: '3.4597', long: '1.234567' },
      new Object({ lat: '3.4597', long: '1.234567' })
    );
    expect(result).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual([1, 2, 4, 5], [1, 2, 4, 5])).toBe(true);
    expect(deepEqual([1, 2, 4, 5], [1, 2, 5])).toBe(false);
    expect(
      deepEqual(
        [
          {
            age: 15,
          },
          {
            age: 20,
          },
        ],
        [
          {
            age: 15,
          },
          {
            age: 20,
          },
        ]
      )
    ).toBe(true);
    expect(
      deepEqual(
        [
          {
            age: 15,
          },
          {
            age: 20,
          },
        ],
        [
          {
            age: 20,
          },
          {
            age: 15,
          },
        ]
      )
    ).toBe(false);
  });

  it('isDefined() should returns false for undefined and null and true other values', () => {
    expect(isDefined(undefined)).toBe(false);
    expect(isDefined(null)).toBe(false);
    expect(isDefined({})).toBe(true);
  });

  it('isObject() should returns true Object child classes while returs false for strings, numbers, arrays...', () => {
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject({})).toBe(true);
    expect(isObject(new Object())).toBe(true);
    expect(isObject(jest.mock('./stubs/stubs'))).toBe(true);
  });

  it('isObjectLike() should returns true for null and Object child classes while returns false for strings, numbers, arrays, undefined...', () => {
    expect(isObjectLike(null)).toBe(false);
    expect(isObjectLike({})).toBe(true);
    expect(isObjectLike(new Object())).toBe(true);
    expect(isObjectLike(undefined)).toBe(false);
  });

  it('isPrototype() should returns true for object prototype', () => {
    expect(isPrototype({})).toBe(false);
    expect(isPrototype(Object)).toBe(false);
    expect(isPrototype(jest.mock('./stubs/stubs'))).toBe(false);
  });

  it('isPlainObject() should return false for non object', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object)).toBe(false);
  });

  it('isPrimitive() should return false for user define objects or prototypes', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(1)).toBe(true);
    expect(isPrimitive('Hello World!')).toBe(true);
  });

  it('isNumber() should return false for non number values', () => {
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(1)).toBe(true);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber('Hello World!')).toBe(false);
  }); //
  it('isNullOrNaN() should return true for null, undefined or if isNaN return true', () => {
    expect(isNullOrNaN({})).toBe(true);
    expect(isNullOrNaN([])).toBe(true);
    expect(isNullOrNaN(1)).toBe(false);
    expect(isNullOrNaN(undefined)).toBe(true);
    expect(isNullOrNaN(null)).toBe(true);
    expect(isNullOrNaN('Hello World!')).toBe(true);
  });

  it('isError() should return false if object is not a javascript Error object', () => {
    expect(isError(new Error())).toBe(true);
    expect(isError('Error access resource')).toBe(false);
  });

  it('isGeneratorObj() should returns true if the object is a generator while is isGeneratorFunction() should return true if an object is a generator function', () => {
    const generator = function* () {
      yield 1;
    };
    expect(isGeneratorObj(generator())).toBe(true);
    expect(isGeneratorObj(generator)).toBe(false);
    expect(isGeneratorFunction(generator())).toBe(false);
  });

  it('isDate() should returns true if the object is javascript date', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate('2010-10-11')).toBe(false);
  });

  it('isBuffer() should returns true if the object is a buffer like', () => {
    const buffer = Buffer.alloc(512);
    expect(isBuffer(buffer)).toBe(true);
    expect(isBuffer(new ArrayBuffer(10))).toBe(false);
  });

  it('isArrayLike() should returns true if the object is an array like object', () => {
    expect(isArrayLike([])).toBe(true);
  });

  it('isArray() should returns true if the object is an array', () => {
    expect(isArrayLike([])).toBe(true);
    expect(isArrayLike(new ArrayBuffer(34))).toBe(false);
  }); //

  it('isTypedArray() should returns true if the object is a typed Fload|Uint8|Uint16... array', () => {
    const buffer = new ArrayBuffer(10);
    expect(isTypedArray(buffer)).toBe(false);
    expect(isTypedArray([])).toBe(false);
    expect(isTypedArray(new Uint16Array())).toBe(true);
    expect(isTypedArray(new Float32Array())).toBe(true);
    expect(isTypedArray(new Uint8Array())).toBe(true);
  });

  it('isEmpty() should returns true for {}, [], undefined, null', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(new Uint16Array())).toBe(true);
    expect(isEmpty(new Float32Array())).toBe(true);
    expect(isEmpty(new Uint8Array())).toBe(true);
  });

  it('typeOf should return customized type name for complex types', () => {
    expect(typeOf(1)).toBe(typeof 1);
    expect(typeOf('Hello World')).toBe(typeof 'Hello World');
    expect(typeOf({})).toBe(typeof {});
    expect(typeOf(Symbol)).toBe(typeof Symbol);
    expect(typeOf(new Uint16Array())).not.toBe(typeof Uint16Array);
    expect(typeOf(true)).toBe(typeof true);
    expect(typeOf([])).not.toBe(typeof []);
    expect(typeOf(new Promise(() => {}))).toBe('promise');
    expect(typeOf(new Map())).toBe('map');
    expect(typeOf(new Set())).toBe('set');
    expect(typeOf(new WeakMap())).toBe('weakmap');
  });
});

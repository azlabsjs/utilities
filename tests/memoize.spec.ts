import { memoize } from '../src/memoize';
import { deepEqual } from '../src/unknown';

describe('Memoization tests', () => {
  it('Should called memoize function only if arguments changes', () => {
    const costFunc = (() => {
      let numCalls = 0;
      return {
        compute: (params: { [index: number]: number }, initial: number = 0) => {
          // Performs heavy computation
          numCalls++;
          return (
            Array.from(Object.keys(params)).map((value) => +value) ?? []
          ).reduce((carry, curr) => {
            carry += curr;
            return carry;
          }, initial ?? 0);
        },
        toBeCalled: (times: number) => {
          return times === numCalls;
        },
      };
    })();

    const func = memoize(costFunc.compute, {
      equality: {
        func: deepEqual,
      },
      //   hash: true,
    });
    // Call the memoized function twice with empty
    func([]);
    func([]);
    expect(costFunc.toBeCalled(1)).toEqual(true);

    // Call the memoized twice function with non parameters
    func([1, 2, 3, 4, 5, 6]);
    func([1, 2, 3, 4, 5, 6]);
    expect(costFunc.toBeCalled(2)).toBe(true);
  });
});

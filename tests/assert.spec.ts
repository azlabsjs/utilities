import { assertRequiredArgs } from  '../src';

describe('Assertion function tests', () => {

    it('assertRequiredArgs should throw Error when all required arguments are not provided by caller', () => {

        const testFunc = function (...args: unknown[]) {
            assertRequiredArgs(1, arguments);
            console.log(args);
        }
        try {
            testFunc();
        } catch(err) {
            expect(err).toBeInstanceOf(TypeError);
        }
    });
});
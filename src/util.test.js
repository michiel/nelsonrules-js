const {
  stdDevFn,
} = require('./util');

describe('Standard Deviation Fn', () => {
  test('It calculates the standard deviation', () => {
    const input = [10, 12, 23, 23, 16, 23, 21, 16];
    const expectedOutput = 4.898979485566356;
    expect(stdDevFn(input)).toEqual(expectedOutput);
  });

  test('It calculates the standard deviation (again)', () => {
    const input = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const expectedOutput = 0;
    expect(stdDevFn(input)).toEqual(expectedOutput);
  });
});

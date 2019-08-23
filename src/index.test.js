const {
  stdDevFn,
  NELSONRULE01,
  NELSONRULE01_DESC,
  NELSONRULE02,
  NELSONRULE02_DESC
} = require('./index')

describe('Standard Deviation Fn', () => {
  test('It calculates the standard deviation', () => {
    const input = [10, 12, 23, 23, 16, 23, 21, 16]
    const expectedOutput = 4.898979485566356
    expect(stdDevFn(input)).toEqual(expectedOutput)
  })

  test('It calculates the standard deviation', () => {
    const input = [1, 1, 1, 1, 1, 1, 1, 1, 1]
    const expectedOutput = 0
    expect(stdDevFn(input)).toEqual(expectedOutput)
  })
})

describe('Nelson Rule 01', () => {
  test('It can detect one outlier', () => {
    const input = [10, 12, 23, 23, 16, 23, 21, 16, 100]
    const expectedOutput = 1
    expect(NELSONRULE01(input)).toEqual(expectedOutput)
  })

  test('It can correctly detect one outlier and report it at the correct position', () => {
    const input = [10, 12, 23, 23, 16, 23, 21, 16, 100]
    const expectedOutput = [8]
    expect(NELSONRULE01_DESC(input).positions).toEqual(expectedOutput)
  })

  test('It can correctly detect two outliers', () => {
    const input = [1, 1, 1, 1, -25, -25, -25, -25, -25, 300, 1, 1, 1, 1000]
    const expectedOutput = 2
    expect(NELSONRULE01(input)).toEqual(expectedOutput)
  })

  test('It can correctly detect two outliers and report them at the correct positions', () => {
    const input = [1, 1, 1, 1, -25, -25, -25, -25, -25, 300, 1, 1, 1, 1000]
    const expectedOutput = [9, 13]
    expect(NELSONRULE01_DESC(input).positions).toEqual(expectedOutput)
  })

  test('It correctly reports zero outliers', () => {
    const input = [1, 1, 1, 1, 1, 1, 1, 1, 1]
    const expectedOutput = 0
    expect(NELSONRULE01(input)).toEqual(expectedOutput)
  })
})

describe('Nelson Rule 02', () => {
  test('It can detect one long bias sequence', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1]
    const expectedOutput = 1
    expect(NELSONRULE02(input)).toEqual(expectedOutput)
  })
  test('It can detect one exact bias sequence', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1]
    const expectedOutput = 1
    expect(NELSONRULE02(input)).toEqual(expectedOutput)
  })
  test('It can detect one exact bias sequence at the correct positions', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1]
    const expectedOutput = [4, 5, 6, 7, 8, 9, 10, 11, 12]
    expect(NELSONRULE02_DESC(input).positions).toEqual(expectedOutput)
  })
  test('It can detect two exact bias sequences', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const expectedOutput = 2
    expect(NELSONRULE02(input)).toEqual(expectedOutput)
  })
  test('It can detect two exact bias sequences at the correct positions', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const expectedOutput = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
    expect(NELSONRULE02_DESC(input).positions).toEqual(expectedOutput)
  })
})

const {
  NELSONRULE01,
  NELSONRULE01_DESC,
  NELSONRULE02,
  NELSONRULE02_DESC,
  NELSONRULE03,
  NELSONRULE03_DESC,
  NELSONRULE04,
  NELSONRULE04_DESC,
  NELSONRULE05,
  NELSONRULE05_DESC,
  NELSONRULE06,
  NELSONRULE06_DESC,
  NELSONRULE07,
  NELSONRULE07_DESC,
  NELSONRULE08,
  NELSONRULE08_DESC,
} = require('./index');

describe('Nelson Rule 01', () => {
  test('It can detect one outlier', () => {
    const input = [10, 12, 23, 23, 16, 23, 21, 16, 100];
    const expectedOutput = 1;
    expect(NELSONRULE01(input)).toEqual(expectedOutput);
  });

  test('It can correctly detect one outlier and report it at the correct position', () => {
    const input = [10, 12, 23, 23, 16, 23, 21, 16, 100];
    const expectedOutput = [8];
    expect(NELSONRULE01_DESC(input).positions).toEqual(expectedOutput);
  });

  test('It can correctly detect two outliers', () => {
    const input = [1, 1, 1, 1, -25, -25, -25, -25, -25, 300, 1, 1, 1, 1000];
    const expectedOutput = 2;
    expect(NELSONRULE01(input)).toEqual(expectedOutput);
  });

  test('It can correctly detect two outliers and report them at the correct positions', () => {
    const input = [1, 1, 1, 1, -25, -25, -25, -25, -25, 300, 1, 1, 1, 1000];
    const expectedOutput = [9, 13];
    expect(NELSONRULE01_DESC(input).positions).toEqual(expectedOutput);
  });

  test('It correctly reports zero outliers', () => {
    const input = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    const expectedOutput = 0;
    expect(NELSONRULE01(input)).toEqual(expectedOutput);
  });
});

describe('Nelson Rule 02', () => {
  test('It can detect one long bias sequence', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1];
    const expectedOutput = 1;
    expect(NELSONRULE02(input)).toEqual(expectedOutput);
  });
  test('It can detect one exact bias sequence', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1];
    const expectedOutput = 1;
    expect(NELSONRULE02(input)).toEqual(expectedOutput);
  });
  test('It can detect one exact bias sequence at the correct positions', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1];
    const expectedOutput = [4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(NELSONRULE02_DESC(input).positions).toEqual(expectedOutput);
  });
  test('It can detect two exact bias sequences', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const expectedOutput = 2;
    expect(NELSONRULE02(input)).toEqual(expectedOutput);
  });
  test('It can detect two exact bias sequences in the correct position groupings', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const expectedOutput = [
      [4, 5, 6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19, 20, 21],
    ];
    expect(NELSONRULE02_DESC(input).groups).toEqual(expectedOutput);
  });
  test('It can detect two exact bias sequences at the correct positions', () => {
    const input = [1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const expectedOutput = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    expect(NELSONRULE02_DESC(input).positions).toEqual(expectedOutput);
  });
});

describe('Nelson Rule 03', () => {
  test('It can detect one trend', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const expectedOutput = 1;
    expect(NELSONRULE03(input)).toEqual(expectedOutput);
  });
  test('It can detect two disconnected trends', () => {
    const input = [1, 2, 3, 4, 5, 6, 0, 6, 5, 4, 3, 2, 1];
    const expectedOutput = 2;
    expect(NELSONRULE03(input)).toEqual(expectedOutput);
  });
  test('It can detect two connected trends', () => {
    const input = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
    const expectedOutput = 2;
    expect(NELSONRULE03(input)).toEqual(expectedOutput);
  });
  test('It can detect three connected trends', () => {
    const input = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6];
    const expectedOutput = 3;
    expect(NELSONRULE03(input)).toEqual(expectedOutput);
  });
  test('It can detect three connected trends in the correct position groupings', () => {
    const input = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6];
    const expectedOutput = [
      [0, 1, 2, 3, 4, 5],
      [5, 6, 7, 8, 9, 10],
      [10, 11, 12, 13, 14, 15],
    ];
    expect(NELSONRULE03_DESC(input).groups).toEqual(expectedOutput);
  });
  test('It can detect three connected trends at the correct positions', () => {
    const input = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6];
    const expectedOutput = [0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15];
    expect(NELSONRULE03_DESC(input).positions).toEqual(expectedOutput);
  });
});

describe('Nelson Rule 04', () => {
  test('It can detect one oscillating sequence', () => {
    const input = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    const expectedOutput = 1;
    expect(NELSONRULE04(input)).toEqual(expectedOutput);
  });
  test('It can detect one oscillating sequence exactly', () => {
    const input = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 1];
    const expectedOutput = 1;
    expect(NELSONRULE04(input)).toEqual(expectedOutput);
  });
  test('It can detect one oscillating sequence exactly at the correct position', () => {
    const input = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 1];
    const expectedOutput = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    expect(NELSONRULE04_DESC(input).positions).toEqual(expectedOutput);
  });
  test('It can detect two oscillating sequences exactly', () => {
    const sequence = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    const input = [].concat(sequence).concat([0, 0]).concat(sequence).concat(sequence);
    const expectedOutput = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
        34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    ];
    expect(NELSONRULE04_DESC(input).groups).toEqual(expectedOutput);
  });
});

describe('Nelson Rule 05', () => {
  test('It can detect one slightly out of control sequence', () => {
    const input = [10, 10, 10, 10, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10];
    const expectedOutput = 1;
    expect(NELSONRULE05(input)).toEqual(expectedOutput);
  });
  test('It can detect two slightly out of control sequences', () => {
    const input = [10, 10, 10, 10, 20, 20, 10, 10, 0, 0, 10, 10, 10, 10];
    const expectedOutput = 2;
    expect(NELSONRULE05(input)).toEqual(expectedOutput);
  });
  test('It can detect five two or three-part out of control sequences', () => {
    const input = [10, 10, 10, 10, 10, 10, 25, 155, 25, 0, 0, 0, 0, 10, 10, 10, 10];
    const expectedOutput = 5;
    expect(NELSONRULE05(input)).toEqual(expectedOutput);
  });
  test('It can detect five two or three-part out of control sequences at the correct positions', () => {
    const input = [10, 10, 10, 10, 10, 10, 25, 155, 25, 0, 0, 0, 0, 10, 10, 10, 10];
    const expectedOutput = [6, 7, 6, 7, 8, 9, 10, 9, 10, 11, 10, 11, 12];
    expect(NELSONRULE05_DESC(input).positions).toEqual(expectedOutput);
  });
  test('It can detect five two or three-part out of control sequences in the correct groups', () => {
    const input = [10, 10, 10, 10, 10, 10, 25, 155, 25, 0, 0, 0, 0, 10, 10, 10, 10];
    const expectedOutput = [
      [6, 7],
      [6, 7, 8],
      [9, 10],
      [9, 10, 11],
      [10, 11, 12],
    ];
    expect(NELSONRULE05_DESC(input).groups).toEqual(expectedOutput);
  });
});

describe('Nelson Rule 06', () => {
  test('It can detect one slightly out of control sequence', () => {
    const input = [10, 10, 10, 20, 20, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    const expectedOutput = 1;
    expect(NELSONRULE06(input)).toEqual(expectedOutput);
  });
  test('It can detect one slightly out of control sequence at the correct positions', () => {
    const input = [10, 10, 10, 20, 20, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    const expectedOutput = [3, 4, 5, 6];
    expect(NELSONRULE06_DESC(input).positions).toEqual(expectedOutput);
  });
});

describe('Nelson Rule 07', () => {
  test('It can detect one sequence of limited variation', () => {
    const input = [
      8,
      9, 11, 9, 11, 9,
      11, 9, 11, 9, 11,
      9, 11, 9, 11, 9,
      12, 12];
    const expectedOutput = 1;
    expect(NELSONRULE07(input)).toEqual(expectedOutput);
  });
  test('It can detect two disconnected sequences of limited variation', () => {
    const input = [
      8,
      9, 11, 9, 11, 9,
      11, 9, 11, 9, 11,
      9, 11, 9, 11, 9,
      12, 12];
    const expectedOutput = 2;
    expect(NELSONRULE07(input.concat(input))).toEqual(expectedOutput);
  });
  test('It can detect three disconnected sequences of limited variation in the correct groupings', () => {
    const sequence = [
      8,
      9, 11, 9, 11, 9,
      11, 9, 11, 9, 11,
      9, 11, 9, 11, 9,
      12, 12];
    const input = sequence.concat(sequence).concat(sequence);
    const expectedOutput = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
      [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    ];
    expect(NELSONRULE07_DESC(input).groups).toEqual(expectedOutput);
  });
  test('It can detect three connected sequences of limited variation in the correct groupings', () => {
    const sequence = [
      9, 11, 9, 11, 9,
      11, 9, 11, 9, 11,
      9, 11, 9, 11, 9,
    ];
    const input = [7, 7].concat(sequence).concat(sequence).concat(sequence).concat([12, 12]);
    const expectedOutput = [
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
    ];
    expect(NELSONRULE07_DESC(input).groups).toEqual(expectedOutput);
  });
});

describe('Nelson Rule 08', () => {
  test('It can detect one sequence outside the 1 stddev range', () => {
    const input = [
      10, 10,
      0, 20, 0, 20,
      0, 20, 0, 20,
      10, 10,
    ];
    const expectedOutput = 1;
    expect(NELSONRULE08(input)).toEqual(expectedOutput);
  });
  test('It can detect one sequence outside the 1 stddev range in the correct grouping', () => {
    const input = [
      10, 10,
      0, 20, 0, 20,
      0, 20, 0, 20,
      10, 10,
    ];
    const expectedOutput = [
      [2, 3, 4, 5, 6, 7, 8, 9],
    ];
    expect(NELSONRULE08_DESC(input).groups).toEqual(expectedOutput);
  });
  test('It can detect three disconnected sequences outside the 1 stddev range in the correct groupings', () => {
    const padding = [10, 10];
    const sequence = [
      0, 20, 0, 20,
      0, 20, 0, 20,
    ];
    const input = padding
      .concat(sequence)
      .concat(padding)
      .concat(sequence)
      .concat(padding)
      .concat(sequence)
      .concat(padding);
    const expectedOutput = [
      [2, 3, 4, 5, 6, 7, 8, 9],
      [12, 13, 14, 15, 16, 17, 18, 19],
      [22, 23, 24, 25, 26, 27, 28, 29],
    ];
    expect(NELSONRULE08_DESC(input).groups).toEqual(expectedOutput);
  });
  test('It can detect three connected sequences outside the 1 stddev range in the correct groupings', () => {
    const padding = [10, 10];
    const sequence = [
      0, 20, 0, 20,
      0, 20, 0, 20,
    ];
    const input = padding
      .concat(sequence)
      .concat(sequence)
      .concat(sequence)
      .concat(padding);
    const expectedOutput = [
      [2, 3, 4, 5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24, 25],
    ];
    expect(NELSONRULE08_DESC(input).groups).toEqual(expectedOutput);
  });
});

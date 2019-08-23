function filterOutliers(arr) {
  const values = arr.concat();
  values.sort((a, b) => a - b);

  const q1 = values[Math.floor((values.length / 4))];
  const q3 = values[Math.ceil((values.length * (3 / 4)))];
  const iqr = q3 - q1;

  const maxValue = q3 + iqr * 1.5;
  const minValue = q1 - iqr * 1.5;

  return values.filter((x) => (x <= maxValue) && (x >= minValue));
}

function meanFn(arr) {
  return arr.reduce(
    (a, b) => a + b, 0,
  ) / arr.length;
}

function stdDevFn(arr) {
  const mean = meanFn(arr);
  return Math.sqrt(
    meanFn(
      arr.map((value) => (value - mean) ** 2),
    ),
  );
}

function NELSONRULE01_DESC(arr) {
  const values = filterOutliers(arr);
  const mean = meanFn(values);
  const stdDev3 = stdDevFn(values) * 3;
  const upper = mean + stdDev3;
  const lower = mean - stdDev3;

  const positions = [];

  const triggers = arr.filter((val, idx) => {
    const outOfBounds = (val > upper) || (val < lower);
    if (outOfBounds) {
      positions.push(idx);
    }
    return outOfBounds;
  }).length;

  return {
    meta: {
      mean,
      stdDev3,
      upper,
      lower,
    },
    triggers,
    positions,
  };
}
/**
 * Nelson Rule 01
 * One point is more than 3 standard deviations from the mean. At least one sample is grossly out of control.
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULE01(arr) {
  return NELSONRULE01_DESC(arr).triggers;
}

function NELSONRULE02_DESC(arr) {
  const values = filterOutliers(arr);
  const mean = meanFn(values);
  const BIAS = 9;

  let over = null;
  let counter = 1;
  let triggers = 0;
  const positions = [];

  function counterUp() {
    counter++;
    if (counter === 9) {
      triggers++;
    }
  }

  function flip(idx) {
    if (counter > BIAS - 1) {
      for (let i = (idx - counter); i < idx; i++) {
        positions.push(i);
      }
    }
    counter = 1;
    over = !over;
  }

  arr.forEach((val, idx) => {
    if (over === null) {
      over = (val < mean);
      flip(idx);
    } else if (over) {
      if (val > mean) {
        counterUp();
      } else {
        flip(idx);
      }
    } else if (val < mean) {
      counterUp();
    } else {
      flip(idx);
    }
  });

  flip(arr.length);

  return {
    meta: {
      mean,
    },
    positions,
    triggers,
  };
}

/**
 * Nelson Rule 02
 * Nine (or more) points in a row are on the same side of the mean.  Some prolonged bias exists
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULE02(arr) {
  return NELSONRULE02_DESC(arr).triggers;
}

module.exports = {
  stdDevFn,
  NELSONRULE01,
  NELSONRULE01_DESC,
  NELSONRULE02,
  NELSONRULE02_DESC,
};

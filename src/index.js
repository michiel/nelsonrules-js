function sanitizeInput(list) {
  return list.map((el) => parseFloat(el));
}

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

function NELSONRULE01_DESC(listIn) {
  const arr = sanitizeInput(listIn);
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
 * One point is more than 3 standard deviations from the mean.
 * At least one sample is grossly out of control.
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULE01(arr) {
  return NELSONRULE01_DESC(arr).triggers;
}

function NELSONRULE02_DESC(listIn) {
  const arr = sanitizeInput(listIn);
  const values = filterOutliers(arr);
  const mean = meanFn(values);
  const BIAS = 9;

  let over = null;
  let counter = 1;
  let triggers = 0;
  let positions = [];
  const groups = [];

  function counterUp() {
    counter += 1;
    if (counter === BIAS) {
      triggers += 1;
    }
  }

  function endSequence(idx) {
    if (counter > BIAS - 1) {
      const group = [];
      for (let i = ((idx + 1) - counter); i < idx; i += 1) {
        group.push(i);
      }
      groups.push(group);
      positions = positions.concat(group);
    }
    counter = 2;
    over = !over;
  }

  arr.forEach((val, idx) => {
    if (over === null) {
      over = (val < mean);
      counterUp();
    } else if (over) {
      if (val > mean) {
        counterUp();
      } else {
        endSequence(idx);
      }
    } else if (val < mean) {
      counterUp();
    } else {
      endSequence(idx);
    }
  });

  endSequence(arr.length);

  return {
    meta: {
      mean,
    },
    groups,
    positions,
    triggers,
  };
}

/**
 * Nelson Rule 02
 * Nine (or more) points in a row are on the same side of the mean.
 * Some prolonged bias exists
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULE02(arr) {
  return NELSONRULE02_DESC(arr).triggers;
}

function NELSONRULE03_DESC(listIn) {
  const arr = sanitizeInput(listIn);
  const TREND = 6;

  const groups = [];
  let positions = [];

  let triggers = 0;
  let trendUp = null;
  let counter = 1;

  function counterUp() {
    counter += 1;
    if (counter === TREND) {
      triggers += 1;
    }
  }

  function endSequence(idx) {
    const group = [];
    if (counter >= TREND) {
      for (let i = ((idx + 1) - counter); i < idx; i += 1) {
        group.push(i);
      }
    }
    groups.push(group);
    positions = positions.concat(group);
    counter = 2;
    trendUp = !trendUp;
  }

  function isUp(a, b) {
    return a > b;
  }

  function isTrending(a, b) {
    return a === b;
  }

  arr.forEach((val, idx) => {
    const prevVal = arr[idx - 1];
    const goingUp = isUp(val, prevVal);

    if (trendUp === null) {
      if (idx !== 0) {
        trendUp = goingUp;
      }
    } else if (!isTrending(trendUp, goingUp)) {
      endSequence(idx);
    }
    counterUp();
  });

  endSequence(arr.length);

  return {
    groups,
    positions,
    triggers,
  };
}


/**
 * Nelson Rule 03
 * Six (or more) points in a row are continually increasing (or decreasing).
 * A trend exists.
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULE03(arr) {
  return NELSONRULE03_DESC(arr).triggers;
}

function NELSONRULE04_DESC(listIn) {
  const arr = sanitizeInput(listIn);
  const SEQUENCE_LENGTH = 15;
  const groups = [];
  let positions = [];
  let triggers = 0;
  let counter = 0;

  function isUp(a, b) {
    return a > b;
  }

  function counterUp() {
    if (counter === 0) {
      counter = 3;
    } else {
      counter += 1;
    }
  }

  function endSequence(idx) {
    if (counter >= SEQUENCE_LENGTH) {
      const group = [];
      for (let i = ((idx + 1) - counter); i < idx; i += 1) {
        group.push(i);
      }
      groups.push(group);
      positions = positions.concat(group);
    }
  }

  function cycle(val, idx, list) {
    const val1 = list[idx - 1];
    const val2 = list[idx - 2];

    if (isUp(val, val1) === !isUp(val1, val2)) {
      counterUp();
    } else {
      endSequence(idx);
      counter = 0;
    }

    if (counter === SEQUENCE_LENGTH) {
      triggers += 1;
    }
  }

  arr.forEach(cycle);
  endSequence(arr.length);

  return {
    groups,
    positions,
    triggers,
  };
}

// Fourteen (or more) points in a row alternate in direction, increasing then
// decreasing.
// This much oscillation is beyond noise.
function NELSONRULE04(arr) {
  return NELSONRULE04_DESC(arr).triggers;
}

// Two (or three) out of three points in a row are more than 2 standard
// deviations from the mean in the same direction.
// There is a medium tendency for samples to be mediumly out of control.
function NELSONRULE05_DESC(listIn) {
  const arr = sanitizeInput(listIn);
  const values = filterOutliers(arr);
  const mean = meanFn(values);
  const stdDev2 = stdDevFn(values) * 2;
  const upper = mean + stdDev2;
  const lower = mean - stdDev2;

  const groups = [];
  let positions = [];
  let triggers = 0;

  function isAbove(val) {
    return val > upper;
  }

  function isBelow(val) {
    return val < lower;
  }

  function match(a, b, c, idx) {
    const matches = [];
    if (isAbove(b)) {
      matches.push(idx - 1);
      if (isAbove(c)) {
        matches.push(idx);
        if (isAbove(a)) {
          matches.unshift(idx - 2);
        }
      }
    } else if (isBelow(b)) {
      matches.push(idx - 1);
      if (isBelow(c)) {
        matches.push(idx);
        if (isBelow(a)) {
          matches.unshift(idx - 2);
        }
      }
    }
    if (matches.length > 1) {
      return matches;
    }
    return [];
  }

  function cycle(val, idx, list) {
    if (idx > 1) {
      const val1 = list[idx - 1];
      const val2 = list[idx - 2];
      const matches = match(val2, val1, val, idx);
      if (matches.length > 1) {
        triggers += 1;
        groups.push(matches);
        positions = positions.concat(matches);
      }
    }
  }

  arr.forEach(cycle);

  return {
    meta: {
      mean,
      stdDev2,
      upper,
      lower,
    },
    groups,
    positions,
    triggers,
  };
}

function NELSONRULE05(arr) {
  return NELSONRULE05_DESC(arr).triggers;
}

function NELSONRULE06_DESC(listIn) {
  const arr = sanitizeInput(listIn);
  const values = filterOutliers(arr);
  const mean = meanFn(values);
  const stdDev = stdDevFn(values);
  const upper = mean + stdDev;
  const lower = mean - stdDev;

  const groups = [];
  let positions = [];
  let triggers = 0;

  const isAbove = (val) => val > upper;
  const isBelow = (val) => val < lower;

  function match(a, b, c, d, e, idx) {
    const matches = [];
    if (isAbove(b) && isAbove(c) && isAbove(d)) {
      matches.push(idx - 3);
      matches.push(idx - 2);
      matches.push(idx - 1);
      if (isAbove(e)) {
        matches.push(idx);
        if (isAbove(a)) {
          matches.unshift(idx - 4);
        }
      }
    } else if (isBelow(b) && isBelow(c) && isBelow(d)) {
      matches.push(idx - 3);
      matches.push(idx - 2);
      matches.push(idx - 1);
      if (isBelow(e)) {
        matches.push(idx);
        if (isBelow(a)) {
          matches.unshift(idx - 4);
        }
      }
    }
    if (matches.length > 3) {
      return matches;
    }
    return [];
  }

  function cycle(val, idx, list) {
    if (idx > 1) {
      const val1 = list[idx - 1];
      const val2 = list[idx - 2];
      const val3 = list[idx - 3];
      const val4 = list[idx - 4];
      const matches = match(val4, val3, val2, val1, val, idx);

      if (matches.length > 3) {
        triggers += 1;
        groups.push(matches);
        positions = positions.concat(matches);
      }
    }
  }

  arr.forEach(cycle);

  return {
    meta: {
      mean,
      stdDev,
      upper,
      lower,
    },
    groups,
    positions,
    triggers,
  };
}

// Four (or five) out of five points in a row are more than 1 standard
// deviation from the mean in the same direction.
// There is a strong tendency for samples to be slightly out of control.
function NELSONRULE06(arr) {
  return NELSONRULE06_DESC(arr).triggers;
}


function NELSONRULE07_DESC(listIn) {
  const arr = sanitizeInput(listIn);
  const SEQUENCE_LENGTH = 15;
  const values = filterOutliers(arr);
  const mean = meanFn(values);
  const stdDev = stdDevFn(values);
  const upper = mean + stdDev;
  const lower = mean - stdDev;

  const groups = [];
  let positions = [];
  let triggers = 0;
  let counter = 0;

  const isInRange = (val) => (val < upper) && (val > lower);

  function match(list, offset) {
    if (list.filter(isInRange).length === list.length) {
      return list.map((el, idx) => (offset - list.length) + (idx));
    }
    return [];
  }

  function cycle(val, idx, list) {
    counter += 1;
    if (counter >= SEQUENCE_LENGTH) {
      const matches = match(list.slice(idx - SEQUENCE_LENGTH, idx), idx);
      if (matches.length > 0) {
        triggers += 1;
        groups.push(matches);
        positions = positions.concat(matches);
        counter = 0;
      }
    }
  }

  arr.forEach(cycle);

  return {
    meta: {
      mean,
      stdDev,
      upper,
      lower,
    },
    groups,
    positions,
    triggers,
  };
}

// Fifteen points in a row are all within 1 standard deviation of the mean on
// either side of the mean.
// With 1 standard deviation, greater variation would be expected.
function NELSONRULE07(arr) {
  return NELSONRULE07_DESC(arr).triggers;
}

function NELSONRULE08_DESC(listIn) {
  const arr = sanitizeInput(listIn);
  const SEQUENCE_LENGTH = 8;
  const values = filterOutliers(arr);
  const mean = meanFn(values);
  const stdDev = stdDevFn(values);
  const upper = mean + stdDev;
  const lower = mean - stdDev;

  const groups = [];
  let positions = [];
  let triggers = 0;
  let counter = 0;

  const isAbove = (val) => (val > upper);
  const isBelow = (val) => (val < lower);
  const isOutOfRange = (val) => isAbove(val) || isBelow(val);

  const allOutOfRange = (list) => list.filter(isOutOfRange).length === list.length;
  const someAbove = (list) => list.filter(isAbove).length < list.length;
  const someBelow = (list) => list.filter(isBelow).length < list.length;

  function match(list, offset) {
    if (allOutOfRange(list) && someBelow(list) && someAbove(list)) {
      return list.map((el, idx) => (offset - list.length) + (idx));
    }
    return [];
  }

  function cycle(val, idx, list) {
    counter += 1;
    if (counter >= SEQUENCE_LENGTH) {
      const matches = match(list.slice(idx - SEQUENCE_LENGTH, idx), idx);
      if (matches.length > 0) {
        triggers += 1;
        groups.push(matches);
        positions = positions.concat(matches);
        counter = 0;
      }
    }
  }

  arr.forEach(cycle);

  return {
    meta: {
      mean,
      stdDev,
      upper,
      lower,
    },
    groups,
    positions,
    triggers,
  };
}

// Eight points in a row exist, but none within 1 standard deviation of the
// mean, and the points are in both directions from the mean.
// Jumping from above to below whilst missing the first standard deviation band
// is rarely random.
function NELSONRULE08(arr) {
  return NELSONRULE08_DESC(arr).triggers;
}

module.exports = {
  stdDevFn,
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
};

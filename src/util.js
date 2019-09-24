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

module.exports = {
  sanitizeInput,
  filterOutliers,
  meanFn,
  stdDevFn,
};

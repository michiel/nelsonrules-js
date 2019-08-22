function filterOutliers(arr) {
	let values = arr.concat();
	values.sort((a, b)=> a - b);

	const q1 = values[Math.floor((values.length / 4))];
	const q3 = values[Math.ceil((values.length * (3 / 4)))];
	const iqr = q3 - q1;

	const maxValue = q3 + iqr*1.5;
	const minValue = q1 - iqr*1.5;

	return values.filter((x)=> {
		return (x <= maxValue) && (x >= minValue);
	});
}

function meanFn(arr) {
	return arr.reduce(((a, b) => a + b), 0) / arr.length;
}

function stdDevFn(arr) {
	const mean = meanFn(arr);
	return Math.sqrt(
		meanFn(
			arr.map(value => (value - mean) ** 2)
		)
	);
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
  const values = filterOutliers(arr);
	const mean = meanFn(values);
	const stdDev3 = stdDevFn(values) * 3;
	const upper = mean + stdDev3;
	const lower = mean - stdDev3;

	return arr.filter(val=> {
		return (val > upper) || (val < lower);
	}).length;
}

module.exports = {
	stdDevFn,
	NELSONRULE01,
}


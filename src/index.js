function filterOutliers (arr) {
  let values = arr.concat()
  values.sort(function (a, b) {
    return a - b
  })

  const q1 = values[Math.floor((values.length / 4))]
  const q3 = values[Math.ceil((values.length * (3 / 4)))]
  const iqr = q3 - q1

  const maxValue = q3 + iqr * 1.5
  const minValue = q1 - iqr * 1.5

  return values.filter((x) => {
    return (x <= maxValue) && (x >= minValue)
  })
}

function meanFn (arr) {
  return arr.reduce(
    function (a, b) {
      return a + b
    }, 0) / arr.length
}

function stdDevFn (arr) {
  const mean = meanFn(arr)
  return Math.sqrt(
    meanFn(
      arr.map(function (value) {
        return (value - mean) ** 2
      })
    )
  )
}

/**
 * Nelson Rule 01
 * One point is more than 3 standard deviations from the mean. At least one sample is grossly out of control.
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULE01 (arr) {
  const values = filterOutliers(arr)
  const mean = meanFn(values)
  const stdDev3 = stdDevFn(values) * 3
  const upper = mean + stdDev3
  const lower = mean - stdDev3

  return arr.filter(function (val) {
    return (val > upper) || (val < lower)
  }).length
}

/**
 * Nelson Rule 02
 * Nine (or more) points in a row are on the same side of the mean.  Some prolonged bias exists
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULE02 (arr) {
  const values = filterOutliers(arr)
  const mean = meanFn(values)

  let over = null
  let counter = 1
  let triggers = 0

  function flip () {
    counter = 1
    over = !over
  }

  arr.forEach(val => {
    if (over === null) {
      over = (val < mean)
      flip()
    } else if (over) {
      if (val > mean) {
        counter++
      } else {
        flip()
      }
    } else {
      if (val < mean) {
        counter++
      } else {
        flip()
      }
    }
    if (counter === 6) {
      triggers++
    }
  })
  return triggers
}

module.exports = {
  stdDevFn,
  NELSONRULE01,
  NELSONRULE02
}

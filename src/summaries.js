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
} = require('./rules');


/**
 * Nelson Rules (All)
 * Apply all Nelson Rules and return the number of triggers
 *
 * @param {Array} arr Array of Numbers
 * @return Number of triggers
 * @customfunction
 */
function NELSONRULES_ALL_TRIGGERS(arr) {
  return [
    NELSONRULE01,
    NELSONRULE02,
    NELSONRULE03,
    NELSONRULE04,
    NELSONRULE05,
    NELSONRULE06,
    NELSONRULE07,
    NELSONRULE08,
  ]
    .map((rule) => rule(arr))
    .reduce(((a, b) => a + b), 0);
}

function NELSONRULES_ALL_VALUES(arr) {
  return [
    NELSONRULE01_DESC,
    NELSONRULE02_DESC,
    NELSONRULE03_DESC,
    NELSONRULE04_DESC,
    NELSONRULE05_DESC,
    NELSONRULE06_DESC,
    NELSONRULE07_DESC,
    NELSONRULE08_DESC,
  ]
    .map((rule) => {
      const { positions } = rule(arr);
      return arr.map((val, idx) => {
        if (positions.indexOf(idx) > -1) {
          return val;
        }
        return null;
      });
    });
}

module.exports = {
  NELSONRULES_ALL_TRIGGERS,
  NELSONRULES_ALL_VALUES,
};

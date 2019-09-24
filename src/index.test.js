const index = require('./index');

describe('Package exports', () => {
  test('All exports are functions', () => {
    Object.entries(index).forEach((kv) => {
      /*
      if (typeof (kv[1]) !== 'function') {
        console.error(kv[0]);
      }
      */
      expect(typeof (kv[1])).toEqual('function');
    });
  });
});

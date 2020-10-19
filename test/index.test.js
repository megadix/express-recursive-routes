const assert = require('assert');
const expect = require('chai').expect;

const index = require('../src/index');

describe('index', function() {
  describe('mountRoutes()', function() {
    it('check parameters', function() {
      expect(() => index.mountRoutes(null)).to.throw(assert.AssertionError);
    });
  });
});
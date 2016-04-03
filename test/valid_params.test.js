var fs = require('fs');
var unexpected = require('unexpected')

var app = require('../examples/valid_params').app;
var intercepts = require('../examples/valid_params').intercepts;

describe('Expected params error', function() {
  var expect,
      errorMsg = 'wrongParam isn\'t a valid param (isInterceptable, intercept, afterSend)',
      error = new Error(errorMsg);

  beforeEach(function() {
    expect = unexpected.clone()
    .installPlugin(require('unexpected-express'))
  });

  it('should throw an error when wrong params: number', function() {
    intercepts.wrongParam = 1;
    expect.addAssertion('to have message', function (expect, subject, error) {
      return expect(error, 'to have message', errorMsg);
    });

    return expect('/index.html', 'to have message', error);
  });

  it('should throw an error when wrong params: function', function() {
    intercepts.wrongParam = function() { return 1; };
    expect.addAssertion('to have message', function (expect, subject, error) {
      return expect(error, 'to have message', errorMsg);
    });

    return expect('/index.html', 'to have message', error);
  });

});

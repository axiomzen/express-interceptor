var fs      = require('fs');
var app = require('../examples/afterSend');
var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-express'))
    .addAssertion('to yield response', function (expect, subject, value) {
        return expect(app, 'to yield exchange', {
            request: subject,
            response: value
        });
    });

function cleanupLog(done){
  fs.exists('body.log', function (exists) {
    if(exists){
      fs.unlink('body.log',done);
    } else {
      done();
    }
  });
}

describe('Using the after() method', function() {

  before(cleanupLog);

  it('should intercept the generated .html and respond with the same .html', function() {
    return expect('/README.md', 'to yield response', 200);
  });

  it('verify log file exist', function() {
      return expect(function (cb) {
          fs.open('body.log', 'r', cb);
      }, 'to call the callback without error');
  });

  after(cleanupLog);
});

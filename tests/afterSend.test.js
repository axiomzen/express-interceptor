var request = require('supertest');
var expect  = require('chai').expect;
var fs      = require('fs');

var app = require('../examples/afterSend');

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

  it('should intercept the generated .html and respond with the same .html', function(done) {
    request(app)
      .get('/README.md')
      .expect(200)
      .end(done);
  });

  it('verify log file exist', function(done) {
    fs.exists('body.log', function(exist) {
      expect(exist).to.equal(true);
      done();
    });
  });

  after(cleanupLog);
});

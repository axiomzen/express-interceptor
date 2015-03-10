var request = require('supertest');
var expect  = require('chai').expect;
var fs      = require('fs');

var app = require('../examples/modify_html');

describe('Expecting only html responses', function() {

  it('should intercept the generated .html (after template engine) and respond with a modified html', function(done) {
    request(app)
      .get('/index')
      .expect(200)
      .end(function(err, res) {
        var index = '<html><head></head><body><p>&quot;Hello world&quot; from interceptor!</p></body></html>';
        expect(res.text).to.equal(index);
        done(err);
      });
  });

  it('should intercept the .html (from a static file) and respond with a modified html', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        var index = '<html><head></head><body><p>&quot;Hello world&quot; from interceptor!</p></body></html>';
        expect(res.text).to.equal(index);
        done(err);
      });
  });

});

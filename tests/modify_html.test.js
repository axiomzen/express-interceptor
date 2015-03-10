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

  it('should intercept the .json (from a static file) and return it without modification', function(done) {
    request(app)
      .get('/index.json')
      .expect(200)
      .end(function(err, res) {
        var indexJson = fs.readFileSync(__dirname + '/../examples/static/index.json');
        expect(res.text).to.equal(indexJson.toString('utf8'));
        done(err);
      });
  });

});

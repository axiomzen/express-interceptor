var request = require('supertest');
var expect  = require('chai').expect;
var fs      = require('fs');

var app = require('../examples/template_engine');

describe('Using a template engine (Jade)', function() {

  it('should intercept the generated .html and respond with the same .html', function(done) {
    request(app)
      .get('/index')
      .expect(200)
      .end(function(err, res) {
        var index = fs.readFileSync(__dirname + '/../examples/static/index.html');
        expect(res.text).to.equal(index.toString('utf8'));
        done(err);
      });
  });

});

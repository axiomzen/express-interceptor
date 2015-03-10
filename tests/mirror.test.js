var request = require('supertest');
var expect  = require('chai').expect;
var fs      = require('fs');

var app = require('../examples/mirror');

describe('Mirroring the response', function() {

  it('should intercept a .json and respond with the same .json', function(done) {
    request(app)
      .get('/package.json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.deep.equal(require('../package.json'));
        done(err);
      });
  });

  it('should intercept a .html and respond with the same .html', function(done) {
    request(app)
      .get('/examples/static/index.html')
      .expect(200)
      .end(function(err, res) {
        var index = fs.readFileSync(__dirname + '/../examples/static/index.html');
        expect(res.text).to.equal(index.toString('utf8'));
        done(err);
      });
  });

  it('should intercept a .md and respond with the same .md', function(done) {
    request(app)
      .get('/README.md')
      .expect(200)
      .end(function(err, res) {
        var readme = fs.readFileSync(__dirname + '/../README.md');
        expect(res.text).to.equal(readme.toString('utf8'));
        done(err);
      });
  });

  it('should intercept a .js and respond with the same .js', function(done) {
    request(app)
      .get('/index.js')
      .expect(200)
      .end(function(err, res) {
        var index = fs.readFileSync(__dirname + '/../index.js');
        expect(res.text).to.equal(index.toString('utf8'));
        done(err);
      });
  });

  it('should intercept 404 and respond with the same 404', function(done) {
    request(app)
      .get('/not-here.json')
      .expect(404)
      .end(function(err, res) {
        expect(res.text).to.equal('Cannot GET /not-here.json\n');
        done(err);
      });
  });

});

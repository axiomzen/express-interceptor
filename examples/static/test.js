var request = require('supertest');
var expect = require('chai').expect;
var fs = require('fs');

describe('Express serving static', function() {
  it('intercept a json and reply same way', function(done) {
    var app = require('./mirror');
    request(app)
      .get('/package.json')
      .expect(200)
      .end(function(err,res) {
        expect(res.body).to.deep.equal(require('../../package.json'));
        done(err);
      });
  });
  it('intercept a .md', function(done) {
    var app = require('./mirror');
    request(app)
      .get('/README.md')
      .expect(200)
      .end(function(err,res) {
        var readme = fs.readFileSync(__dirname+'/../../README.md');
        expect(res.text).to.equal(readme.toString('utf8'));
        done(err);
      });
  });
  it('404 is still 404', function(done) {
    var app = require('./mirror');
    request(app)
      .get('/not-here.json')
      .expect(404)
      .end(function(err,res) {
        expect(res.text).to.equal('Cannot GET /not-here.json\n');
        done(err);
      });
  });

  it('can wrap README in json', function(done) {
    var app = require('./json_wrap');

    request(app)
      .get('/README.md')
      .expect(200)
      .end(function(err,res) {
        expect(res.headers['content-type']).to.equal('application/json');
        var readme = fs.readFileSync(__dirname+'/../../README.md');
        expect(res.body.json).to.equal(readme.toString('utf8'));
        done(err);
      });
  });
});

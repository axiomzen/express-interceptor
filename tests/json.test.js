var request = require('supertest');
var expect  = require('chai').expect;
var fs      = require('fs');

var app = require('../examples/json');

describe('JSON wrapping a response', function() {

  it('should get a .json file and respond with a .json wraping that file', function(done) {
    request(app)
      .get('/package.json')
      .expect(200)
      .end(function(err,res) {
        expect(res.headers['content-type']).to.equal('application/json');
        var package_json = fs.readFileSync(__dirname + '/../package.json');
        expect(res.body.json).to.equal(package_json.toString('utf8'));
        done(err);
      });
  });

  it('should get a .html file and respond with a .json wraping that file', function(done) {
    request(app)
      .get('/examples/static/index.html')
      .expect(200)
      .end(function(err,res) {
        expect(res.headers['content-type']).to.equal('application/json');
        var index = fs.readFileSync(__dirname + '/../examples/static/index.html');
        expect(res.body.json).to.equal(index.toString('utf8'));
        done(err);
      });
  });

  it('should get a .md file and respond with a .json wraping that file', function(done) {
    request(app)
      .get('/README.md')
      .expect(200)
      .end(function(err,res) {
        expect(res.headers['content-type']).to.equal('application/json');
        var readme = fs.readFileSync(__dirname + '/../README.md');
        expect(res.body.json).to.equal(readme.toString('utf8'));
        done(err);
      });
  });

});

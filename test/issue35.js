var express = require('express');
var expect = require('unexpected')
.clone()
.installPlugin(require('unexpected-express'));

var interceptorMiddleware = require('../')(function (req, res) {
  return {
    isInterceptable: function () {
      return true;
    },
    intercept: function (body, send) {
      send(body);
    }
  }
});

describe('issue 35', function () {
  before(function () {
    this.app = express()
    .use(interceptorMiddleware)
    .use(function (req, res, next) {
      res.status(200);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      next();
    })
    .get('/string', function (req, res) {
      res.write('foobar');
      res.end();
    })
    .get('/stringAndBuffer', function (req, res) {
      res.write(new Buffer('foo'));
      res.write('bar');
      res.end();
    });
  });
  it('one string', function () {
    return expect(this.app, 'to yield exchange', {
      request: 'GET /string',
      response: {
        body: 'foobar'
      }
    });
  });
  it('string and buffer', function () {
    return expect(this.app, 'to yield exchange', {
      request: 'GET /stringAndBuffer',
      response: {
        body: 'foobar'
      }
    });
  });
});

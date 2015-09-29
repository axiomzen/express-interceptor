var expect = require('unexpected')
  .clone()
  .installPlugin(require('unexpected-express'))
  .addAssertion('to yield response', function (expect, subject, value) {
    return expect(app, 'to yield exchange', {
      request: subject,
      response: value
    });
  });

var express = require('express');
var interceptor = require('../');

describe('res.writeHead', function() {
  it('should overwrite res.writeHead(statusCode, headers)', function() {
    var app = express()
      .use(interceptor(function (req, res) {
        return {
          isInterceptable: function(){
            return true;
          },
          intercept: function(body, send) {
            var json = JSON.stringify(body.split('\n'));
            res.set('Content-Type', 'application/json');
            send(json);
          }
        };
      }))
      .use(function (req, res, next) {
        res.writeHead('201', {
            'content-type': 'text/plain',
            'x-custom-header': 'foobar'
        });
        res.write(new Buffer('foo\n'));
        res.write(new Buffer('bar'));
        res.end();
      });
    return expect(app, 'to yield exchange', {
        request: 'GET /',
        response: {
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'foobar'
            },
            statusCode: 201
        }
    });
  });
  it('should overwrite res.writeHead(statusCode, statusMessage, headers) (and ignore statusMessage)', function() {
    var app = express()
      .use(interceptor(function (req, res) {
        return {
          isInterceptable: function(){
            return true;
          },
          intercept: function(body, send) {
            var json = JSON.stringify(body.split('\n'));
            res.set('Content-Type', 'application/json');
            send(json);
          }
        };
      }))
      .use(function (req, res, next) {
        res.writeHead('200', 'Something Custom', {
            'content-type': 'text/plain',
            'x-custom-header': 'foobar'
        });
        res.write(new Buffer('foo\n'));
        res.write(new Buffer('bar'));
        res.end();
      });
    return expect(app, 'to yield exchange', {
        request: 'GET /',
        response: {
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'foobar'
            },
            statusMessage: 'OK',
            statusCode: 200
        }
    });
  });
});

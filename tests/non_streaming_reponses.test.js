var app = require('../examples/mirror');
var fs = require('fs');

var app = require('express')()
    .use(require('../')(function (req, res) {
        return {
            isInterceptable: function () {
                return false;
            },
            intercept: function (body, send) {}
        }
    }))
    .get('/hello', function (req, res) {
        res.status(200).send('world');
    });

var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-express'))
    .addAssertion('to yield response', function (expect, subject, value) {
        return expect(app, 'to yield exchange', {
            request: subject,
            response: value
        });
    });

describe('Non streaming responses', function () {
    it('should not be swallowed when sent by .send', function () {
        return expect('/hello', 'to yield response', 'world');
    });
});

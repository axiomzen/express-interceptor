var express = require('express');
var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-express'));

describe('Multibyte character', function () {
    it('☺ smiley face', function () {
        var app = express()
            .use(require('../')(function (req, res) {
                return {
                    isInterceptable: function () {
                        return true;
                    },
                    intercept: function (body, send) {
                        send(body);
                    }
                }
            }))
            .use('/smiley', function (req, res) {
                res.status(200);
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.write(new Buffer([0xe2]));
                res.write(new Buffer([0x98]));
                res.write(new Buffer([0xba]));
                res.end();
            });
        return expect(app, 'to yield exchange', {
            request: 'GET /smiley',
            response: {
                body: '☺'
            }
        });
    });
});

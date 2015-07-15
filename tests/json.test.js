var fs      = require('fs');
var app = require('../examples/json');
var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-express'))
    .addAssertion('to yield response', function (expect, subject, value) {
        return expect(app, 'to yield exchange', {
            request: subject,
            response: value
        });
    });

describe('JSON wrapping a response', function() {

  it('should get a .json file and respond with a .json wraping that file', function() {
    return expect('/package.json', 'to yield response', {
      headers: {
          'Content-Type': 'application/json'
      },
      body: {
        json: fs.readFileSync(__dirname + '/../package.json', 'utf-8')
      }
    });
  });

  it('should get a .html file and respond with a .json wraping that file', function() {
    return expect('/examples/static/index.html', 'to yield response', {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            json: fs.readFileSync(__dirname + '/../examples/static/index.html', 'utf-8')
        }
    });
  });

  it('should get a .md file and respond with a .json wraping that file', function() {
    return expect('/README.md', 'to yield response', {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            json: fs.readFileSync(__dirname + '/../README.md', 'utf-8')
        }
    });
  });

});

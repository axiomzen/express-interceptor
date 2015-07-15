var fs = require('fs');
var app = require('../examples/modify_html');
var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-express'))
    .addAssertion('to yield response', function (expect, subject, value) {
        return expect(app, 'to yield exchange', {
            request: subject,
            response: value
        });
    });


describe('Expecting only html responses', function() {

  it('should intercept the generated .html (after template engine) and respond with a modified html', function() {
    var index = '<html><head></head><body><p>&quot;Hello world&quot; from interceptor!</p></body></html>';
    return expect('/index', 'to yield response', index);
  });

  it('should intercept the .html (from a static file) and respond with a modified html', function() {
    var index = '<html><head></head><body><p>&quot;Hello world&quot; from interceptor!</p></body></html>';
    return expect('/index', 'to yield response', index);
  });

  it('should intercept the .json (from a static file) and return it without modification', function() {
    var indexJson = fs.readFileSync(__dirname + '/../examples/static/index.json', 'utf-8');
    return expect('/index.json', 'to yield response', {
        body: JSON.parse(indexJson)
    });
  });

});

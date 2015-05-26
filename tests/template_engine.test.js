var app = require('../examples/template_engine');
var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-express'))
    .addAssertion('to yield response', function (expect, subject, value) {
        return expect(app, 'to yield exchange', {
            request: subject,
            response: value
        });
    });

describe('Using a template engine (Jade)', function() {

  it('should intercept the generated .html and respond with the same .html', function() {
      return expect('/index', 'to yield response', {
          body: expect.it('to contain', '<script>alert("you were intercepted!")</script>')
      });
  });

});

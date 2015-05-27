var app = require('../examples/mirror');
var fs = require('fs');
var expect = require('unexpected')
    .clone()
    .installPlugin(require('unexpected-express'))
    .addAssertion('to yield response', function (expect, subject, value) {
        return expect(app, 'to yield exchange', {
            request: subject,
            response: value
        });
    })
    .addAssertion('to mirror the file on disk', function (expect, subject) {
        var fileName = subject.replace(/^\//, '');
        var pathToFileOnDisk = require('path').resolve(__dirname, '..', fileName);
        var fileContent = fs.readFileSync(pathToFileOnDisk, 'utf-8')

        if (/\.json$/.test(fileName)) {
            fileContent = JSON.parse(fileContent);
        }

        return expect(app, 'to yield exchange', {
            request: subject,
            response: {
                body: fileContent
            }
        });
    });

describe('Mirroring the response', function() {

  it('should intercept a .json and respond with the same .json', function() {
    return expect('/package.json', 'to mirror the file on disk');
  });

  it('should intercept a .html and respond with the same .html', function() {
    return expect('/examples/static/index.html', 'to mirror the file on disk');
  });

  it('should intercept a .md and respond with the same .md', function() {
    return expect('/README.md', 'to mirror the file on disk');
  });

  it('should intercept a .js and respond with the same .js', function() {
    return expect('/index.js', 'to mirror the file on disk');
  });

  it('should intercept 404 and respond with the same 404', function() {
    return expect('/not-here.json', 'to yield response', 404);
  });

});

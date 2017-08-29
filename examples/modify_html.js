var express = require('express');
var app     = express();

var cheerio = require('cheerio');

var interceptor = require('../index');

app.use(interceptor(function(req, res){
  return {
    isInterceptable: function(){
      return /text\/html/.test(res.get('Content-Type'));
    },
    intercept: function(body, send) {
      var $document = cheerio.load(body || '');
      $document('body p').append(' from interceptor!');

      send($document.html());
    }
  };
}));

app.set('views', './examples/static');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/static/'));
app.get('/:docId', function(req, res){
  res.render(req.params.docId);
});

module.exports = app;

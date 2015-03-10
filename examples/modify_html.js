var express = require('express');
var app     = express();

var cheerio = require('cheerio');

var interceptor = require('../index');

app.use(interceptor(function(req, res){
  return {
    initerceptPredicate: function(){
      return /text\/html/.test(res.get('Content-Type'));
    },
    send: function(body, done) {
      var $document = cheerio.load(body || '');
      $document('body p').append(' from interceptor!');

      done(null, $document.html());
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

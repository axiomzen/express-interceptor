var express = require('express');
var app     = express();

var interceptor = require('../index');

app.use(interceptor(function(req, res){
  return {
    initerceptPredicate: function(){
      return true;
    },
    send: function(body, done) {
      done(null, body);
    }
  };
}));

app.set('views', './examples/static');
app.set('view engine', 'jade');

app.get('/:docId', function(req, res){
  res.render(req.params.docId);
});

module.exports = app;

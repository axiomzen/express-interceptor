var express = require('express');
var fs      = require('fs');
var logger  = require('morgan');

var app = express();
app.use(logger('combined'));

var interceptor = require('..');
app.use(interceptor(function(req,res){
  return {
    initerceptPredicate: function(){
      return true;
    },
    send: function(body, done) {
      done(null, '{"intercepted":"true"}');
    }
  };
}));

app.use(express.static(__dirname + '/../'));

module.exports = app;

app.listen(3001);
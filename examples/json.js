var express = require('express');
var app     = express();

var interceptor = require('../');

app.use(interceptor(function(req,res){
  return {
    isInterceptable: function(){
      return true;
    },
    intercept: function(body, done) {
      res.set('Content-Type', 'application/json');
      done(JSON.stringify({json: body}));
    }
  };
}));

app.use(express.static(__dirname + '/../'));

module.exports = app;

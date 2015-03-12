var express = require('express');
var app     = express();

var interceptor = require('../index');

app.use(interceptor(function(req, res){
  return {
    isInterceptable: function(){
      return true;
    },
    intercept: function(body, send) {
      send(body);
    }
  };
}));

app.use(express.static(__dirname + '/../'));

module.exports = app;

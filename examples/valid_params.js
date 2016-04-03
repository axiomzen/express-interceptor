var express = require('express');
var app     = express();

var interceptor = require('../index');

var intercepts = {
  isInterceptable: function(){
    return true;
  },
  intercept: function(body, send) {
    send(body);
  }
};

app.use(interceptor(function(req, res){
  return intercepts;
}));

app.use(express.static(__dirname + '/static'));

module.exports = {app: app, intercepts: intercepts};

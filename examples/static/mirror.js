var express = require('express');
var app = express();

var interceptor = require('../..');
app.use(interceptor(function(req,res){
  return {
    initerceptPredicate: function(){
      return true;
    },
    send: function(body, done) {
      done(null, body);
    },
    afterSend: function(oldBody,newBody) {

    }
  };
}));

app.use(express.static(__dirname + '/../../'));

module.exports = app;


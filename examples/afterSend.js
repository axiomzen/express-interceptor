var express = require('express');
var app     = express();

var interceptor = require('../');

var fs = require('fs');

app.use(interceptor(function(req,res){
  return {
    isInterceptable: function(){
      return true;
    },
    intercept: function(body, send) {
      send(body);
    },
    afterSend: function(oldBody,newBody) {
      var line = JSON.stringify({
        oldBody: oldBody,
        newBody: newBody,
        diff: newBody.length - oldBody.length,
        url: req.url,
        at: new Date()
      });
      fs.appendFile('body.log',line+'\n',function(err) {
        console.log('append it is!');
        if(err) return console.warn(err);
      });
    }
  };
}));

app.use(express.static(__dirname + '/../'));

module.exports = app;

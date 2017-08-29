var express = require('express');
var app     = express();

var interceptor = require('../index');

app.use(interceptor(function(req, res){
  return {
    isInterceptable: function(){
      return true;
    },
    intercept: function(body, send) {
      var body2 = body.replace('</body>','<script>alert("you were intercepted!")</script></body>');
      send(body2);
    }
  };
}));

app.set('views', './examples/static');
app.set('view engine', 'jade');

app.get('/:docId', function(req, res){
  res.render(req.params.docId);
});

module.exports = app;

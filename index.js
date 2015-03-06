module.exports = function(fn) {
  var debug = require('debug')('express-intercept');

  return function(req,res,next){
    var methods = fn(req,res);

    var originalEnd = res.end;
    var originalWrite = res.write;
    var chunks = [];
    var isIntercepting;
    var isFirstWrite = true;

    function intercept(chunk, encoding){
      if(isFirstWrite){
        isFirstWrite = false;
        isIntercepting = methods.initerceptPredicate();
      }
      debug('isIntercepting? %s', isIntercepting);
      if (isIntercepting){
        // collect all the parts of a response
        if(chunk){
          chunks.push(chunk.toString(typeof encoding === 'string' ? encoding : 'utf-8'));
        }
        if(typeof cb === 'function'){
          cb();
        }
      }
      return isIntercepting;
    }

    res.write = function(chunk, encoding, cb) {
      debug('write called');
      if( !intercept(chunk,encoding) ){
        originalWrite.apply(res, arguments);
      }
    };

    res.end = function(chunk, encoding, cb) {
      debug('end called');
      var args = Array.prototype.slice.call(arguments, 1);
      if( intercept(chunk,encoding) ){
        res.removeHeader('Content-Length');
        isIntercepting = false;
        methods.send(chunks.join(''), function(err,newBody) {
          if(err){
            return cb && cb(err);
          }
          // TODO handle error
          args[0] = newBody;
          originalEnd.apply(res,args);
          process.nextTick(function() {
            if(typeof methods.afterSend === 'function'){
              methods.afterSend(newBody);
            }
          });
        });
      } else {
        originalEnd.apply(res,args);
      }
    };
    next();
  };
};
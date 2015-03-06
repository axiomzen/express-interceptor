module.exports = function(fn) {
  var debug = require('debug')('express-interceptor');

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

    function afterSend(oldBody, newBody){
      if(typeof methods.afterSend === 'function'){
        process.nextTick(function() {
          debug('methods.afterSend running now, body size: %s %s',oldBody.length, newBody.length);
          methods.afterSend(oldBody, newBody);
        });
      }
    }

    res.end = function(chunk, encoding, cb) {
      debug('end called');
      var args = Array.prototype.slice.call(arguments, 1);
      if( intercept(chunk,encoding) ){
        isIntercepting = false;
        var oldBody = chunks.join('');
        if (typeof methods.send === 'function'){
          debug(' methods.send is defined');
          res.removeHeader('Content-Length');
          // allow the user to re-write destiny
          methods.send(oldBody, function(err,newBody) {
            // debug(' newBody is %s',newBody);
            if(err){
              return cb && cb(err);
            }
            args[0] = newBody;
            originalEnd.apply(res,args);
            afterSend(oldBody,newBody);
          });
        } else {
          debug(' methods.send isnt defined');
          afterSend(oldBody,oldBody);
          originalEnd.apply(res,args);
        }
      } else {
        originalEnd.apply(res,args);
      }
    };
    next();
  };
};
function validateParams(methods){
  var ACCEPT = ['isInterceptable', 'intercept', 'afterSend'];
  for(var k in methods){
    if(ACCEPT.indexOf(k) < 0){
      throw(new Error(k+' isn\'t a valid param ('+ACCEPT.join(', ')+')'));
    }
  }
  if(!('isInterceptable' in methods)){
    throw('isInterceptable is a required param (function)');
  }
}

module.exports = function(fn) {
  var debug = require('debug')('express-interceptor');

  return function(req,res,next){
    var methods = fn(req,res);
    validateParams(methods);

    var originalEnd = res.end;
    var originalWrite = res.write;
    var originalWriteHead = res.writeHead;
    var chunks = [];
    var isIntercepting;
    var isFirstWrite = true;
    var endCalled = false;

    function intercept(chunk, encoding){
      if(isFirstWrite){
        isFirstWrite = false;
        isIntercepting = methods.isInterceptable();
      }
      debug('isIntercepting? %s', isIntercepting);
      if (isIntercepting){
        // collect all the parts of a response
        if(chunk){
          chunks.push(chunk);
        }
        if(typeof cb === 'function'){
          cb();
        }
      }
      return isIntercepting;
    }

    res.writeHead = function (statusCode, statusMessage, headers) {
      if (!methods.isInterceptable() || endCalled) {
        return originalWriteHead.apply(res, arguments);
      } else {
        if (!headers && statusMessage && typeof statusMessage === 'object') {
          headers = statusMessage;
          statusMessage = null;
        }

        if (statusMessage) {
            debug('the statusMessage argument is not supported by express-interceptor');
        }

        if (statusCode) {
          res.status(statusCode)
        }

        if (headers) {
          Object.keys(headers).forEach(function (headerName) {
            res.set(headerName, headers[headerName]);
          });
        }
      }
    };

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
      endCalled = true;
      var args = Array.prototype.slice.call(arguments);
      if( intercept(chunk,encoding) ){
        isIntercepting = false;
        var oldBody = Buffer.concat(chunks).toString('utf-8');
        if (methods.intercept){
          if(typeof methods.intercept !== 'function'){
            throw new Error('`send` must be a function with the body to be sent as the only param');
          }
          res.removeHeader('Content-Length');
          // allow the user to re-write response
          methods.intercept(oldBody, function(newBody) {
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

require('es6-promise').polyfill();

module.exports = function(fn) {
  var debug = require('debug')('express-interceptor');

  return function(req, res, next) {
    var methods = fn(req, res);
    _validateParams(methods);

    var originalEnd = res.end;
    var originalWrite = res.write;
    var chunks = [];
    var isIntercepting;
    var isFirstWrite = true;
    var isInterceptablePromise;

    function intercept(rawChunk, encoding) {
      if (isFirstWrite) {
        isFirstWrite = false;

        isInterceptablePromise = Promise.resolve(methods.isInterceptable())
        .then(function(bool){
          isIntercepting = bool;
          return;
        })
        .catch(function(){
          isIntercepting = false;
          debug('function isInterceptable throws exception', arguments);
          return;
        });
      }

      // isFirstWrite should call first, so isInterceptablePromise will not by null
      isInterceptablePromise.then(function(){
        debug('isIntercepting? %s', isIntercepting);
        if (isIntercepting) {
          // collect all the parts of a response
          if (rawChunk) {
            var chunk = rawChunk
            if (rawChunk !== null && !Buffer.isBuffer(chunk) && encoding !== 'buffer') {
              if (!encoding) {
                chunk = new Buffer(rawChunk)
              } else {
                chunk = new Buffer(rawChunk, encoding)
              }
            }
            chunks.push(chunk);
          }
          if (typeof cb === 'function') {
            cb();
          }
        }
      });

      return isInterceptablePromise;
    }

    res.write = function(chunk, encoding, cb) {
      debug('write called');

      var args = arguments;
      intercept(chunk,encoding).then(function(){
        !isIntercepting && originalWrite.apply(res, args);
      });
    };

    function afterSend(oldBody, newBody) {
      if (typeof methods.afterSend === 'function') {
        process.nextTick(function() {
          debug('methods.afterSend running now, body size: %s %s', oldBody.length, newBody.length);
          methods.afterSend(oldBody, newBody);
        });
      }
    }

    res.end = function(chunk, encoding, cb) {
      debug('end called');
      var args = Array.prototype.slice.call(arguments);

      intercept(chunk,encoding).then(function(){
        if (isIntercepting) {
          isIntercepting = false;
          var oldBody = Buffer.concat(chunks);

          if (methods.intercept) {
            if (typeof methods.intercept !== 'function') {
              throw new Error('`send` must be a function with the body to be sent as the only param');
            }

            res.removeHeader('Content-Length');
            // allow the user to re-write response
            methods.intercept(oldBody, function(newBody) {
              args[0] = newBody;

              res.write = originalWrite;
              originalEnd.apply(res,args);
              afterSend(oldBody,newBody);
            });
          } else {
            debug(' methods.send isnt defined');
            afterSend(oldBody, oldBody);

            res.write = originalWrite;
            originalEnd.apply(res, args);
          }
        } else {

          res.write = originalWrite;
          originalEnd.apply(res, args);
        }
      });
    };

    next();
  };
};

var VALID_PARAMS = ['isInterceptable', 'intercept', 'afterSend'];
function _validateParams(methods) {
  for (var k in methods) {
    if (VALID_PARAMS.indexOf(k) < 0) {
      throw(new Error(k+' isn\'t a valid param (' + VALID_PARAMS.join(', ') + ')'));
    }
  }

  if (!('isInterceptable' in methods)) {
    throw('isInterceptable is a required param (function)');
  }
}

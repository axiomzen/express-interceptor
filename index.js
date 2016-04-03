
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

    function intercept(rawChunk, encoding) {
      if (isFirstWrite) {
        isFirstWrite = false;
        isIntercepting = methods.isInterceptable();
      }

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

      return isIntercepting;
    }

    res.write = function(chunk, encoding, cb) {
      debug('write called');
      if(!intercept(chunk,encoding)) {
        originalWrite.apply(res, arguments);
      }
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

      if (intercept(chunk,encoding)) {
        isIntercepting = false;
        var oldBody = Buffer.concat(chunks).toString('utf-8');

        if (methods.intercept) {
          if (typeof methods.intercept !== 'function') {
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
          afterSend(oldBody, oldBody);
          originalEnd.apply(res, args);
        }

      } else {
        originalEnd.apply(res, args);
      }

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

# raison d'etre

Born out of the need for a reliable, customized and maintenable middleware we need for Sesame CMS.

Some use cases include:

- conditionally transform any kind of response
- have access to responses after they are sent

## API

```javascript

app.use(interceptRes(function(req,res){
  return {
    // define your custom condition to intercept this response
    //   returning `true` cause to buffer this request, and activate methods below
    //   otherwise we ignore it completely
    initerceptPredicate: function(){

    },
    // can transform the body, it's a properly encoded String, 
    //   done(err, string) param[1] will become the new response
    //   may omit secrets, erase words, append stuff, etc.
    send: function(body, done) {

    },
    // useful for caching, keeping stats, etc.
    afterSend: function(oldBody, newBody) {

    }
  };
}));

```

You can find many other examples at [/examples folder](https://github.com/axiomzen/express-interceptor/tree/master/examples) - which also happen to be the tests.

## technicalities

Express extends Node.js functionalities, that by default:

- allow setting and modifying of headers until the moment there is a write to the socket, this will submit headers.
- when `initerceptPredicate` returns true, we will buffer the contents, preventing `.write` to be called
- the whole buffer is presented to `send` function that can modify response headers right there, as well as return a new `body` that will be sent right away.
- `afterSend` is optional and happens on next tick.
- this package tries to be minimally obtrusive on the way Node or Express works, original `write` and `end` methods hijacked but then at the end.


## similar to

- [tamper](https://www.npmjs.com/package/tamper)
Similar functionality, with different APIs.

- [express-hijackresponse](https://github.com/papandreou/express-hijackresponse)
Have issues with cache, code is hard to maintain.

## words of advice

This module is new, tests are appreciated. There might be edge cases that need fix.

Not recommended to intercept and transform big responses.

Activate debug with `DEBUG=express-intercept npm test`

# express-interceptor

>A tiny interceptor of Express responses.

With express-interceptor you can define a previos step, before send the response, where you can process such response, transform it, replace it, log it, what ever you want. Using a declarative API, easy to use and maintain, without the necesity of calling `next()` all the time and with no need to manage confusing nested scopes.

[![NPM](https://nodei.co/npm/express-interceptor.png)](https://nodei.co/npm/express-interceptor/)

[![Build Status](https://travis-ci.org/axiomzen/express-interceptor.svg)](https://travis-ci.org/axiomzen/express-interceptor) [![Dependencies](https://david-dm.org/axiomzen/express-interceptor.png)](https://david-dm.org/axiomzen/express-interceptor.png)

## Raison d'etre

After testing other packages, that offer a similar solution, we found really hard to organize, thinking how hard would it be to maintain, the logic to process responses before being sent. So we decided to develop our own solution, taking in account that we want a declarative-structured way of organizing the code to define a custom middleware for response processing.

Some use cases include:

- Transpile custom elements into standard HTML elements.
- Transforms JSX or compiles less files on the fly.
- Store statistics about responses.
- Set response headers based on tags in the response body.
- Dynamically inject live-reload scripts to HTML.

## Usage

* Install the package

    npm install --save express-interceptor

* Define your interceptor

```javascript
var express     = require('express');
var cheerio     = require('cheerio');
var interceptor = require('express-interceptor');

var app = express();

app.use(interceptor(function(req, res){
  return {
    initerceptPredicate: function(){
      return /text\/html/.test(res.get('Content-Type'));
    },
    send: function(body, done) {
      var $document = cheerio.load(body);
      $document('body').append('<p>From interceptor!</p>');

      done(null, $document.html());
    }
  };
}));

app.use(express.static(__dirname + '/public/'));

app.listen(3000);

```

Here you are defining an interceptor that will be executed whenever the response contains html as Content-Type, and if that is true, it will append a child at the end of the body.

You can find other examples at [/examples folder](https://github.com/axiomzen/express-interceptor/tree/master/examples).

## API

* * `initerceptPredicate()`: is a predicate function, where you can define a condition to intercept or not the response, returning `true` cause to buffer the request, and proceeds calling `send()`. Tipically you want to check for this condition in the `res` object exposed in the definition of the middleware.

* * `send(body, done)`: here you will be able to process the complete response in `body`, which it's a properly encoded String. After you finish what you want to do with it, call `done(err, newBody)` passing `err`, in case there is one, and the `newBody` you want to send back to the client.

* `afterSend(oldBody, newBody)`: this method will be called after sending the response to the client, better to say, after the `done()` callback in the `send()` method gets executed. Typically you could use this method to cache something, log stats, fire a job, etc.

(*) Required methods.

## Similar to

- [express-hijackresponse](https://github.com/papandreou/express-hijackresponse)
Have issues with cache, code is hard to maintain.

- [tamper](https://www.npmjs.com/package/tamper)
Similar functionality, with different APIs.

## Words of advice

This module is new, tests are appreciated. There might be edge cases that need fix.

Not recommended to intercept and transform big responses.

Activate debug with `DEBUG=express-interceptor npm test`

## Author

* [AxiomZen](https://www.axiomzen.co/).

## Collaborators

* [Fabiano Soriani](https://github.com/flockonus).
* [Raul Pino](https://github.com/p1nox).

## License

  [MIT](LICENSE)

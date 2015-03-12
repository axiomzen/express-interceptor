# express-interceptor

>A tiny Express response interceptor.

Express-interceptor allows you to define a previous step before sending a response. This previous step allows you to do anything you want with the response, such as processing, transforming, replacing, or logging it. Express-interceptor allows you to avoid the necessity of calling `next()` over and over. Further, you can avoid managing confusing nested scopes. Using a declarative API, it's simple to use and maintain. 

[![NPM](https://nodei.co/npm/express-interceptor.png)](https://nodei.co/npm/express-interceptor/)

[![Build Status](https://travis-ci.org/axiomzen/express-interceptor.svg)](https://travis-ci.org/axiomzen/express-interceptor) [![Dependencies](https://david-dm.org/axiomzen/express-interceptor.png)](https://david-dm.org/axiomzen/express-interceptor.png)

## Raison d'etre

We tested other packages that offer a similar solution, but found they are difficult to organize, to maintain logic, and to process responses before they are sent. We developed a solution to this problem that offers a declarative-structured way to organize code, and that defines custom middleware for response processing.

Some use cases include:

- Transpile custom elements into standard HTML elements.
- Transform JSX or compile less files on the fly.
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

You're defining an interceptor that will be executed whenever the response contains html as Content-Type. If this is true, it will append a child at the end of the body.

Find other examples at [/examples folder](https://github.com/axiomzen/express-interceptor/tree/master/examples).

## API

* * `initerceptPredicate()`: is a predicate function where you define a condition whether or not to intercept a response. Returning `true` buffers the request, and proceeds calling `send()`. Typically, you want to check for this condition in the `res` object in the definition of the middleware.

* * `send(body, done)`: Enables you to process the complete response in `body`, as a  properly encoded String. When you're finished with what you wish to do, call `done(err, newBody)` passing `err` in case there is one, and the `newBody` you wish to send back to the client. 

* `afterSend(oldBody, newBody)`: This method will be called after sending the response to the client – after the `done()` callback in the `send()` method is executed. This method would typically be used to cache something, log stats, fire a job, etc. 

(*) Required methods.

## Similar to

- [express-hijackresponse](https://github.com/papandreou/express-hijackresponse)
Has issues with cache; code is difficult to maintain. 

- [tamper](https://www.npmjs.com/package/tamper)
Similar functionality with different APIs.

## Words of advice

This module is new and tests are appreciated. Some edge cases may need fixing. 

Not recommended for intercepting and transforming big responses. 

Activate debug with `DEBUG=express-interceptor npm test`

## Author

* [AxiomZen](https://www.axiomzen.co/).

## Collaborators

* [Fabiano Soriani](https://github.com/flockonus).
* [Raul Pino](https://github.com/p1nox).

## License

  [MIT](LICENSE)

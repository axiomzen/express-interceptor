# express-interceptor

_A tiny Express response interceptor_

[![NPM](https://nodei.co/npm/express-interceptor.png)](https://nodei.co/npm/express-interceptor/)

[![Build Status](https://travis-ci.org/axiomzen/express-interceptor.svg)](https://travis-ci.org/axiomzen/express-interceptor) [![Dependencies](https://david-dm.org/axiomzen/express-interceptor.png)](https://david-dm.org/axiomzen/express-interceptor.png)
<a href="https://zenhub.io"><img src="https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png" height="18px"></a>

Express-interceptor allows you to define a previous step before sending a response. This allows you to do anything you want with the response, such as processing, transforming, replacing, or logging it. Express-interceptor allows you to avoid calling `next()` over and over. Further more, you can avoid managing nested scopes. Using a declarative API, it’s simple to use and maintain.

Some use cases include:

- Transpile custom elements into standard HTML elements.
- Transform JSX or compile less files on the fly.
- Store statistics about responses.
- Set response headers based on tags in the response body.
- Dynamically inject live-reload scripts to HTML.

## Usage

Install the package


    npm i --save express-interceptor

Define your interceptor

```javascript
var express     = require('express');
var cheerio     = require('cheerio');
var interceptor = require('express-interceptor');

var app = express();

var finalParagraphInterceptor = interceptor(function(req, res){
  return {
    // Only HTML responses will be intercepted
    isInterceptable: function(){
      return /text\/html/.test(res.get('Content-Type'));
    },
    // Appends a paragraph at the end of the response body
    intercept: function(body, send) {
      var $document = cheerio.load(body);
      $document('body').append('<p>From interceptor!</p>');

      send($document.html());
    }
  };
})

// Add the interceptor middleware
app.use(finalParagraphInterceptor);

app.use(express.static(__dirname + '/public/'));

app.listen(3000);

```

You're defining an interceptor that will be executed whenever the response contains html as Content-Type. If this is true, it will append a child at the end of the body. In other words, it will transform the response:

```html
<html>
<head></head>
<body>
  <p>"Hello world"</p>
</body>
</html>
```

Into:

```html
<html>
<head></head>
<body>
  <p>"Hello world"</p>
  <p>From interceptor!</p>
</body>
</html>
```

See [more examples](https://github.com/axiomzen/express-interceptor/tree/master/examples). Also, you can debug express-interceptor actions using [debug](https://github.com/visionmedia/debug) env variable `DEBUG=express-interceptor`.

## API

* `isInterceptable()` (required): is a predicate function where you define a condition whether or not to intercept a response. Returning `true` buffers the request, and proceeds calling `intercept()` as well as `afterSend()`. Typically, you want to check for this condition in the `res` object in the definition of the middleware.

* `intercept(body, send)` (required): Parse the body as an encoded string. After processing the body, call `send(newBody)` with the content to be sent back to the client.

* `afterSend(oldBody, newBody)`: This method will be called after sending the response to the client – after the `done()` callback in the `send()` method is executed. This method would typically be used to cache something, log stats, fire a job, among other things.

## Who is using it?

* [node-stylus-require](https://www.npmjs.com/package/node-stylus-require)
* [express-html-minify](https://www.npmjs.com/package/express-html-minify)
* [express-jare](https://www.npmjs.com/package/express-jare)
* [hospitalrun-server-routes](https://www.npmjs.com/package/hospitalrun-server-routes)

## Similar to

- [express-hijackresponse](https://github.com/papandreou/express-hijackresponse)
Different API, using callbacks with no top down structure, more obtrusive to HTTP internals.

- [hijackresponse](https://github.com/gustavnikolaj/hijackresponse)
Attempting to solve same problems than `express-hijackresponse`. Different API using pipes, recommended if you have problems with [streaming](https://github.com/axiomzen/express-interceptor/issues/15) or if you need more control over responses.

- [tamper](https://github.com/fgnass/tamper)
Similar functionality but different internals and API.

## Words of advice

If your `intercept` method make calls to a database, or needs to make expensive transformations to the original response, you should take in account the time that will add to the response. You should define your `isInterceptable` method carefully, checking the type of the response, or even the route that was fired by the request, also you may consider implementing a cache strategy to get faster responses.

If you face any issue, don't hesitate to submit it [here](https://github.com/axiomzen/express-interceptor/issues).

## Contributing

Please check [CONTRIBUTING.md](CONTRIBUTING.md).

This project adheres to the [Open Code of Conduct](http://todogroup.org/opencodeofconduct/#express-interceptor/ipinoraul@gmail.com). By participating, you are expected to honor this code.

## Author

* [AxiomZen](https://www.axiomzen.co/).

## Collaborators

* [Fabiano Soriani](https://github.com/flockonus).
* [Raul Pino](https://github.com/p1nox).

## License

  [MIT](LICENSE)

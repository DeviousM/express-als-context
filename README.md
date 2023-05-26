# Express AsyncLocalStorage Context
Get and set request-scoped context anywhere. It's using a now-stable AsyncLocalStorage. It's heavily inspired by [express-http-context](https://github.com/skonves/express-http-context), but doesn't suffer from the same memory leak issue that it brought (which was due to `cls-hooked` issue)

## Support

AsyncLocalStorage supports Node.js from `12.17.0` up.

## How to use it

Install: `npm install --save express-als-context`  

Use the middleware immediately before the first middleware that needs to have access to the context.
You won't have access to the context in any middleware `.use`d before this one.

``` js
var express = require('express');
var httpContext = require('express-als-context');

var app = express();
// Use any third party middleware that does not need access to the context here, e.g. 
// app.use(some3rdParty.middleware);
app.use(httpContext.middleware);
// all code from here on has access to the same context for each request
```

Set values based on the incoming request:

``` js
// Example authorization middleware
app.use((req, res, next) => {
  userService.getUser(req.get('Authorization'), (err, result) => {
    if (err) {
      next(err);
    } else {
      httpContext.set('user', result.user)
      next();
    }
  });
});
```

You can read the values in the code that doesn't have access to the express's `req` object:

``` js
var httpContext = require('express-als-context');

// Somewhere deep in the Todo Service
function createTodoItem(title, content, callback) {
  var user = httpContext.get('user');
  db.insert({ title, content, userId: user.id }, callback);
}
```
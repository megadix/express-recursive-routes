# express-recursive-routes

Recursively configure Express.js routes in a folder. It uses sensible defaults (filenames) but can be easily customized.

# Usage

For more examples see the examples repository:  
[express-recursive-routes-example](https://github.com/megadix/express-recursive-routes-example)

### Old way (express-generator)

[express-generator](https://www.npmjs.com/package/express-generator) creates routes under `/routes` folder, but you have to manually register routes like this:

`app.js`:

```js
var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', users);
```

### ✨ New way: `express-recursive-routes`

With `express-recursive-routes` you can let function `mountRoutes()` do the magic:

`app.js`:

```js
const routeUtils = require('express-recursive-routes');
routeUtils.mountRoutes(app);
```

Then, under `/routes` (default - see *Configuration* below):

`index.js` will be mounted under `/`

```js
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from /')
});

module.exports = router;
```

`users.js` will be mounted under `/users` 

```js
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from /users/')
});

module.exports = router;
```

etc...

## Configuration

If your setup is different, you can pass configuration parameters to `mountRoutes()`:

- `rootDir`: folder containing route files. Defaults to `./routes`
- `basePath`: prefix path added to all routes. Defaults to `''` (empty)
- `filter`: search for filenames containing this string
  - defaults to `.js`
  - strips `filter` from route path
  - it *always* strips the trailing `.js` suffix

### Logging

You can activate various logging levels setting `EXPRESS_RECURSIVE_ROUTES_LOG_LEVEL` environment variable. Valid values are:

- `ERROR` (default)
- `WARN`
- `INFO`
- `DEBUG`

### Example 1: custom routes folder

If your routes files are stored in a folder different from `routes`, for example:  
`src/my-routes`

you can configure them like this:

```
routeUtils.mountRoutes(app, './src/my-routes');
```

### Example 1: custom prefix path

Sometimes you want your routes to have a special prefix, for example `/api`:

```
routeUtils.mountRoutes(app, null, '/api');
```

------------------------------------------------------------------------------------------------------------------------

# Development

Install `semantic-release-cli`:

```
npm install -g semantic-release-cli
semantic-release-cli setup
```

Commit using `commit` script ([commit-zen](https://github.com/commitizen/cz-cli)):

```
npm run commit
```
